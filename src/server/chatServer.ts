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

  /**
   * Broadcasts a message to all connected clients, excluding specified clients.
   * 
   * @param {Message} message - The message to broadcast.
   * @param {string[]} [exclude] - List of client IDs to exclude from broadcasting.
   */
  broadcastMessage(message: Message, exclude?: string[]) {
    this.broadcast(JSON.stringify(message), exclude);
  }

  /**
   * Initializes the chat server, loads previous messages from the database.
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

    // load the messages from the database
    this.messages = this.ctx.storage.sql
      .exec(`SELECT * FROM messages LIMIT 50 OFFSET 0`)
      .toArray() as ChatMessage[];
  }

  /**
   * Handles a new client connection, sends initial messages to the client.
   * 
   * @param {Connection} connection - The connection object representing the client.
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
   */
  saveMessage(message: ChatMessage) {
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
    this.ctx.storage.sql.exec(
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
  }

  /**
   * Saves a session to the local store and the database.
   * 
   * @param {Session} session - The session to save.
   */
  saveSession(session: Session) {
    this.sessions.set(session.session_id, session);

    // Use parameterized queries and batch updates to improve performance
    this.ctx.storage.sql.exec(
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
  }

  /**
   * Saves a rating to the database.
   * 
   * @param {string} userId - The ID of the user providing the rating.
   * @param {string} messageId - The ID of the message being rated.
   * @param {number} ratingValue - The rating value (1-5).
   */
  saveRating(userId: string, messageId: string, ratingValue: number) {
    this.ctx.storage.sql.exec(
      `INSERT INTO ratings (rating_id, user_id, message_id, rating_value, timestamp) VALUES ('${nanoid(8)}', '${userId}', '${messageId}', ${ratingValue}, CURRENT_TIMESTAMP)`,
    );
  }
}
