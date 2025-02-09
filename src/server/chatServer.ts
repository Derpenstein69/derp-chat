/**
 * @file chatServer.ts
 * @description Chat server logic and main functionalities for managing messages and sessions.
 * @module Server
 */

import {
  type Connection,
  Server,
  type WSMessage,
} from "partyserver";
import { nanoid } from "nanoid";
import { SentimentAnalyzer, PorterStemmer } from "natural";
import { createHmac } from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import jwt from "jsonwebtoken";
import { performance } from "perf_hooks";
import Redis from "ioredis";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import type { ChatMessage, Session } from "../shared";

/**
 * Chat class handles the chat server logic and manages messages and sessions.
 */
export class Chat extends Server<Env> {
  static options = { hibernate: true };

  messages = [] as ChatMessage[];
  sessions = new Map<string, any>();
  cache = new Map<string, ChatMessage[]>();
  sentimentAnalyzer = new SentimentAnalyzer("English", PorterStemmer, "afinn");

  r2Client = new S3Client({
    region: this.env.R2_REGION,
    credentials: {
      accessKeyId: this.env.R2_ACCESS_KEY_ID,
      secretAccessKey: this.env.R2_SECRET_ACCESS_KEY,
    },
    endpoint: `https://${this.env.R2_REGION}.r2.cloudflarestorage.com`,
  });

  redisClient = new Redis({
    host: this.env.REDIS_HOST,
    port: this.env.REDIS_PORT,
    password: this.env.REDIS_PASSWORD,
  });

  /**
   * Broadcasts a message to all connected clients, excluding specified clients.
   * 
   * @param {Message} message - The message to broadcast.
   * @param {string[]} [exclude] - List of client IDs to exclude from broadcasting.
   * 
   * @example
   * const chat = new Chat();
   * chat.broadcastMessage({ type: "add", content: "Hello, world!" });
   */
  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  /**
   * Initializes the chat server, loads previous messages from the database.
   * 
   * @example
   * const chat = new Chat();
   * chat.onStart();
   */
  onStart() {
    // this is where you can initialize things that need to be done before the server starts
    // for example, load previous messages from a database or a service

    // create the messages table if it doesn't exist
    this.ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, user TEXT, role TEXT, content TEXT, attachments TEXT, user_id TEXT, thread_id TEXT, reply_to TEXT, session_id TEXT REFERENCES sessions(session_id), sentiment TEXT)`,
    );

    // create the sessions table if it doesn't exist
    this.ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, messages TEXT, ip_address TEXT, user_agent TEXT, sentiment TEXT)`,
    );

    // create the ratings table if it doesn't exist
    this.ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS ratings (rating_id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), message_id TEXT REFERENCES messages(id), rating_value INTEGER CHECK (rating_value >= 1 AND RATING_VALUE <= 5), timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    );

    // create indexes for optimization
    this.ctx.storage.sql.exec(
      `CREATE INDEX IF NOT EXISTS idx_messages_user_id ON messages(user_id)`,
    );
    this.ctx.storage.sql.exec(
      `CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)`,
    );

    // load the messages from the database
    this.messages = this.ctx.storage.sql
      .exec(`SELECT * FROM messages LIMIT 50 OFFSET 0`)
      .toArray() as ChatMessage[];
  }

  /**
   * Handles a new client connection, sends initial messages to the client.
   * 
   * @param {Connection} connection - The connection object representing the client.
   * 
   * @example
   * const chat = new Chat();
   * chat.onConnect(connection);
   */
  onConnect(connection: Connection) {
    connection.send(
      JSON.stringify({
        type: "all",
        messages: this.messages,
      } satisfies Message),
    );
  }

  /**
   * Saves a message to the local store and the database.
   * 
   * @param {ChatMessage} message - The message to save.
   * 
   * @example
   * const chat = new Chat();
   * chat.saveMessage({ id: "123", content: "Hello, world!", user: "Alice", role: "user" });
   */
  async saveMessage(message: ChatMessage) {
    // check if the message already exists
    const existingMessage = this.messages.find((m) => m.id === message.id);
    if (existingMessage) {
      this.messages = this.messages.map((m) => {
        if (m.id === message.id) {
          return message;
        }
        return m;
      });
    } else {
      this.messages.push(message);
    }

    // Use parameterized queries to prevent SQL injection and improve performance
    await this.ctx.storage.sql.exec(
      `INSERT INTO messages (id, user, role, content, attachments, user_id, session_id, thread_id, reply_to, sentiment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (id) DO UPDATE SET content = ?, attachments = ?, thread_id = ?, reply_to = ?, sentiment = ?`,
      [
        message.id,
        message.user,
        message.role,
        JSON.stringify(message.content),
        JSON.stringify(message.attachments),
        message.user_id,
        message.session_id,
        message.thread_id,
        message.reply_to,
        message.sentiment,
        JSON.stringify(message.content),
        JSON.stringify(message.attachments),
        message.thread_id,
        message.reply_to,
        message.sentiment,
      ],
    );

    // Update cache
    this.cache.set(message.id, [message]);
    await this.redisClient.set(`message:${message.id}`, JSON.stringify(message));
  }

  /**
   * Saves a session to the local store and the database.
   * 
   * @param {Session} session - The session to save.
   * 
   * @example
   * const chat = new Chat();
   * chat.saveSession({ session_id: "session1", user_id: "user1", messages: [] });
   */
  async saveSession(session: Session) {
    this.sessions.set(session.session_id, session);

    // Use parameterized queries and batch updates to improve performance
    await this.ctx.storage.sql.exec(
      `INSERT INTO sessions (session_id, user_id, created_at, updated_at, messages, ip_address, user_agent, user_activity_timestamps, device_information, session_duration, sentiment) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT (session_id) DO UPDATE SET updated_at = ?, messages = ?, user_activity_timestamps = ?, device_information = ?, session_duration = ?, sentiment = ?`,
      [
        session.session_id,
        session.user_id,
        session.created_at,
        session.updated_at,
        JSON.stringify(session.messages),
        session.ip_address,
        session.user_agent,
        JSON.stringify(session.user_activity_timestamps),
        JSON.stringify(session.device_information),
        session.session_duration,
        session.sentiment,
        session.updated_at,
        JSON.stringify(session.messages),
        JSON.stringify(session.user_activity_timestamps),
        JSON.stringify(session.device_information),
        session.session_duration,
        session.sentiment,
      ],
    );

    await this.redisClient.set(`session:${session.session_id}`, JSON.stringify(session));
  }

  /**
   * Saves a rating to the database.
   * 
   * @param {string} userId - The ID of the user providing the rating.
   * @param {string} messageId - The ID of the message being rated.
   * @param {number} ratingValue - The rating value (1-5).
   * 
   * @example
   * const chat = new Chat();
   * chat.saveRating("user1", "message1", 5);
   */
  async saveRating(userId: string, messageId: string, ratingValue: number) {
    await this.ctx.storage.sql.exec(
      `INSERT INTO ratings (rating_id, user_id, message_id, rating_value, timestamp) VALUES ('${nanoid(8)}', '${userId}', '${messageId}', ${ratingValue}, CURRENT_TIMESTAMP)`,
    );

    await this.redisClient.set(`rating:${nanoid(8)}`, JSON.stringify({ userId, messageId, ratingValue }));
  }

  /**
   * Logs an error to an external logging service.
   * 
   * @param {Error} error - The error to log.
   * @param {Connection} connection - The connection object representing the client.
   * @param {WSMessage} message - The message that caused the error.
   * 
   * @example
   * const chat = new Chat();
   * chat.logErrorToService(new Error("Test error"), connection, message);
   */
  async logErrorToService(error: Error, connection: Connection, message: WSMessage) {
    try {
      const logData = {
        level: "error",
        message: error.message,
        context: {
          connectionId: connection.id,
          message,
        },
        error: {
          name: error.name,
          stack: error.stack,
        },
      };

      await fetch("https://your-logging-service-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });
    } catch (loggingError) {
      console.error("Error logging to external service", loggingError);
    }
  }

  /**
   * Adds performance monitoring tool integration.
   * 
   * @example
   * const chat = new Chat();
   * chat.addPerformanceMonitoring();
   */
  addPerformanceMonitoring() {
    const monitoringTool = require("monitoring-tool");
    monitoringTool.init({
      apiKey: this.env.MONITORING_TOOL_API_KEY,
      appName: "ChatApp",
    });

    monitoringTool.trackPerformance({
      messages: this.messages.length,
      sessions: this.sessions.size,
    });
  }

  /**
   * Optimizes AI response generation process.
   * 
   * @example
   * const chat = new Chat();
   * chat.optimizeAIResponseGeneration();
   */
  optimizeAIResponseGeneration() {
    // Implement optimization logic here
    console.log("Optimizing AI response generation process...");
  }

  /**
   * Handles scalability improvements.
   * 
   * @example
   * const chat = new Chat();
   * chat.handleScalabilityImprovements();
   */
  handleScalabilityImprovements() {
    // Implement scalability improvements here
    console.log("Handling scalability improvements...");
  }

  /**
   * Handles real-time analytics.
   * 
   * @example
   * const chat = new Chat();
   * chat.handleRealTimeAnalytics();
   */
  handleRealTimeAnalytics() {
    // Implement real-time analytics logic here
    console.log("Handling real-time analytics...");
  }

  /**
   * Handles personalized interactions.
   * 
   * @example
   * const chat = new Chat();
   * chat.handlePersonalizedInteractions();
   */
  handlePersonalizedInteractions() {
    // Implement personalized interactions logic here
    console.log("Handling personalized interactions...");
  }
}
