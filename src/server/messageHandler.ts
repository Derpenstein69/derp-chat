/**
 * @file messageHandler.ts
 * @description Handles incoming messages from clients, updates local store and broadcasts messages.
 * @module Server
 */

import { Connection, WSMessage } from "partyserver";
import { nanoid } from "nanoid";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { validate } from "valibot";
import jwt from "jsonwebtoken";
import { performance } from "perf_hooks";
import { SentimentAnalyzer, PorterStemmer } from "natural";
import { createHmac } from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import type { ChatMessage, Message, Session } from "../shared";
import { Chat } from "./chatServer";
import { generateMessageSummary, generateSuggestions, analyzeConversationSentiment } from "./sessionManager";

/**
 * Handles incoming messages from clients, updates local store and broadcasts messages.
 * 
 * @param {Connection} connection - The connection object representing the client.
 * @param {WSMessage} message - The message received from the client.
 */
export async function onMessage(connection: Connection, message: WSMessage) {
  const startTime = performance.now();
  try {
    // let's broadcast the raw message to everyone else
    Chat.prototype.broadcast(message);

    // let's update our local messages store
    const parsed = JSON.parse(message as string) as Message;

    // Validate input data
    const validationResult = validate(messageSchema, { content: parsed.content });
    if (!validationResult.success) {
      throw new Error(validationResult.errors[0].message);
    }

    // Sentiment analysis
    const sentiment = Chat.prototype.sentimentAnalyzer.getSentiment(parsed.content.split(" "));
    parsed.sentiment = sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral";

    // HMAC signature validation
    const hmac = createHmac('sha256', Chat.prototype.env.HMAC_SECRET_KEY);
    hmac.update(parsed.content);
    const signature = hmac.digest('hex');
    if (parsed.signature !== signature) {
      throw new Error("Invalid HMAC signature");
    }

    // Expiration date enforcement
    const currentTime = new Date().getTime();
    if (parsed.expiration && currentTime > parsed.expiration) {
      throw new Error("Link has expired");
    }

    if (parsed.type === "add") {
      // add the message to the local store
      Chat.prototype.saveMessage(parsed);

      // manage session data
      const session = Chat.prototype.sessions.get(parsed.session_id) || {
        session_id: parsed.session_id,
        user_id: parsed.user_id,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        messages: [],
        ip_address: connection.remoteAddress,
        user_agent: connection.userAgent,
        user_activity_timestamps: [],
        device_information: connection.deviceInformation,
        session_duration: 0,
        sentiment: parsed.sentiment,
      };

      // Validate IP address and user agent
      if (session.ip_address !== connection.remoteAddress || session.user_agent !== connection.userAgent) {
        throw new Error("IP address or user agent mismatch");
      }

      session.messages.push(parsed);
      session.updated_at = new Date().toISOString();
      session.user_activity_timestamps.push(new Date().toISOString());
      session.session_duration = (new Date().getTime() - new Date(session.created_at).getTime()) / 1000;
      session.sentiment = parsed.sentiment;
      Chat.prototype.saveSession(session);

      // let's ask AI to respond as well for fun
      const aiMessage = {
        id: nanoid(8),
        content: "...",
        user: "AI",
        role: "assistant",
        attachments: [],
      } as const;

      Chat.prototype.broadcastMessage({
        type: "add",
        ...aiMessage,
      });

      const aiMessageStream = (await Chat.prototype.env.AI.run(
        "@cf/meta/llama-2-7b-chat-int8",
        {
          stream: true,
          messages: Chat.prototype.messages.map((m) => ({
            content: m.content,
            role: m.role,
          })),
          context: session.messages.map((m) => ({
            content: m.content,
            role: m.role,
          })),
          knowledgeSources: ["https://api.example.com/knowledge"],
          nlpModel: "advanced-nlp-model",
        },
      )) as ReadableStream;

      Chat.prototype.saveMessage(aiMessage);

      const eventStream = aiMessageStream
        .pipeThrough(new TextDecoderStream())
        .pipeThrough(new EventSourceParserStream());

      // We want the AI to respond to the message in real-time
      // so we're going to stream every chunk as an "update" message

      let buffer = "";

      for await (const event of eventStream) {
        if (event.data !== "[DONE]") {
          // let's append the response to the buffer
          const data = JSON.parse(event.data) as { response: string };
          buffer += data.response;
          // and broadcast the buffer as an update
          Chat.prototype.broadcastMessage({
            type: "update",
            ...aiMessage,
            content: buffer + "...", // let's add an ellipsis to show it's still typing
          });
        } else {
          // the AI is done responding
          // we update our local messages store with the final response
          Chat.prototype.saveMessage({
            ...aiMessage,
            content: buffer,
          });

          // let's update the message with the final response
          Chat.prototype.broadcastMessage({
            type: "update",
            ...aiMessage,
            content: buffer,
          });
        }
      }
    } else if (parsed.type === "update") {
      // update the message in the local store
      Chat.prototype.saveMessage(parsed);
    }
  } catch (error) {
    console.error("Error processing message", error);
    // Implement a logging mechanism to log errors to an external logging service
    await Chat.prototype.logErrorToService(error, connection, message);
  } finally {
    const endTime = performance.now();
    console.log(`Message processing time: ${endTime - startTime}ms`);
  }
}
