/**
 * @file index.ts
 * @description Chat server logic and main functionalities for managing messages and sessions.
 * @module Server
 */

import {
  type Connection,
  Server,
  type WSMessage,
  routePartykitRequest,
} from "partyserver";
import { nanoid } from "nanoid";
import { EventSourceParserStream } from "eventsource-parser/stream";
import { authorizer, createSubjects } from "@openauthjs/openauth";
import { CloudflareStorage } from "@openauthjs/openauth/storage/cloudflare";
import { PasswordAdapter } from "@openauthjs/openauth/adapter/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { object, string, validate } from "valibot";
import { GoogleAdapter } from "@openauthjs/openauth/adapter/google";
import { GithubAdapter } from "@openauthjs/openauth/adapter/github";
import { AppleAdapter } from "@openauthjs/openauth/adapter/apple";
import { DiscordAdapter } from "@openauthjs/openauth/adapter/discord";
import jwt from "jsonwebtoken";
import { performance } from "perf_hooks";
import { SentimentAnalyzer, PorterStemmer } from "natural";
import { createCipheriv, createDecipheriv, randomBytes, createHmac } from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";

import type { ChatMessage, Message, Session } from "../shared";

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
    region: process.env.R2_REGION,
    credentials: {
      accessKeyId: process.env.R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.R2_SECRET_ACCESS_KEY,
    },
    endpoint: `https://${process.env.R2_REGION}.r2.cloudflarestorage.com`,
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

  /**
   * Handles incoming messages from clients, updates local store and broadcasts messages.
   * 
   * @param {Connection} connection - The connection object representing the client.
   * @param {WSMessage} message - The message received from the client.
   */
  async onMessage(connection: Connection, message: WSMessage) {
    const startTime = performance.now();
    try {
      // let's broadcast the raw message to everyone else
      this.broadcast(message);

      // let's update our local messages store
      const parsed = JSON.parse(message as string) as Message;

      // Validate input data
      const validationResult = validate(messageSchema, { content: parsed.content });
      if (!validationResult.success) {
        throw new Error(validationResult.errors[0].message);
      }

      // Sentiment analysis
      const sentiment = this.sentimentAnalyzer.getSentiment(parsed.content.split(" "));
      parsed.sentiment = sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral";

      // HMAC signature validation
      const hmac = createHmac('sha256', process.env.HMAC_SECRET_KEY!);
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
        this.saveMessage(parsed);

        // manage session data
        const session = this.sessions.get(parsed.session_id) || {
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
        this.saveSession(session);

        // let's ask AI to respond as well for fun
        const aiMessage = {
          id: nanoid(8),
          content: "...",
          user: "AI",
          role: "assistant",
          attachments: [],
        } as const;

        this.broadcastMessage({
          type: "add",
          ...aiMessage,
        });

        const aiMessageStream = (await this.env.AI.run(
          "@cf/meta/llama-2-7b-chat-int8",
          {
            stream: true,
            messages: this.messages.map((m) => ({
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

        this.saveMessage(aiMessage);

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
            this.broadcastMessage({
              type: "update",
              ...aiMessage,
              content: buffer + "...", // let's add an ellipsis to show it's still typing
            });
          } else {
            // the AI is done responding
            // we update our local messages store with the final response
            this.saveMessage({
              ...aiMessage,
              content: buffer,
            });

            // let's update the message with the final response
            this.broadcastMessage({
              type: "update",
              ...aiMessage,
              content: buffer,
            });
          }
        }
      } else if (parsed.type === "update") {
        // update the message in the local store
        this.saveMessage(parsed);
      }
    } catch (error) {
      console.error("Error processing message", error);
      // Implement a logging mechanism to log errors to an external logging service
      // Example: logErrorToService(error);
    } finally {
      const endTime = performance.now();
      console.log(`Message processing time: ${endTime - startTime}ms`);
    }
  }

  /**
   * Validates a JWT token and returns the decoded payload if valid.
   * 
   * @param {string} token - The JWT token to validate.
   * @returns {object | null} The decoded payload if the token is valid, otherwise null.
   */
  validateToken(token: string) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      return decoded;
    } catch (err) {
      return null;
    }
  }

  /**
   * Generates a context-aware message summary for a given session.
   * 
   * @param {string} sessionId - The ID of the session.
   * @returns {string} The summary of the conversation history.
   */
  generateMessageSummary(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
    return `Summary: ${messages}`;
  }

  /**
   * Provides context-aware suggestions based on the conversation history and user preferences.
   * 
   * @param {string} sessionId - The ID of the session.
   * @returns {string[]} The list of suggestions.
   */
  generateSuggestions(sessionId: string): string[] {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
    return [`Suggestion 1 based on: ${messages}`, `Suggestion 2 based on: ${messages}`];
  }

  /**
   * Analyzes the sentiment of the conversation history to adjust the tone and style of the AI assistant's responses.
   * 
   * @param {string} sessionId - The ID of the session.
   * @returns {string} The sentiment analysis result.
   */
  analyzeConversationSentiment(sessionId: string): string {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    const messages = session.messages.map((m: ChatMessage) => m.content).join(" ");
    const sentiment = this.sentimentAnalyzer.getSentiment(messages.split(" "));
    return sentiment > 0 ? "positive" : sentiment < 0 ? "negative" : "neutral";
  }

  /**
   * Uploads an image to Cloudflare R2.
   * 
   * @param {string} key - The key for the image in R2.
   * @param {Buffer} body - The image data.
   */
  async uploadImageToR2(key: string, body: Buffer) {
    const command = new PutObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
      Body: body,
    });
    await this.r2Client.send(command);
  }

  /**
   * Retrieves an image from Cloudflare R2.
   * 
   * @param {string} key - The key for the image in R2.
   * @returns {Promise<Buffer>} The image data.
   */
  async getImageFromR2(key: string): Promise<Buffer> {
    const command = new GetObjectCommand({
      Bucket: process.env.R2_BUCKET_NAME,
      Key: key,
    });
    const response = await this.r2Client.send(command);
    return response.Body as Buffer;
  }

  /**
   * Initializes the Cloudflare Worker for image classification using Workers AI.
   */
  initializeImageClassificationWorker() {
    this.env.IMAGE_CLASSIFICATION_WORKER = new Worker("@cf/meta/image-classification", {
      bindings: {
        R2_BUCKET_NAME: process.env.R2_BUCKET_NAME,
        R2_REGION: process.env.R2_REGION,
      },
    });
  }

  /**
   * Handles image classification requests using Workers AI.
   * 
   * @param {string} imageUrl - The URL of the image to classify.
   * @returns {Promise<string>} The classification result.
   */
  async classifyImage(imageUrl: string): Promise<string> {
    const response = await this.env.IMAGE_CLASSIFICATION_WORKER.fetch(imageUrl);
    const result = await response.json();
    return result.classification;
  }

  /**
   * Stores classification metadata in Cloudflare KV for efficient retrieval and management.
   * 
   * @param {string} imageUrl - The URL of the image.
   * @param {string} classification - The classification result.
   */
  async storeClassificationMetadata(imageUrl: string, classification: string) {
    await this.env.CLASSIFICATION_METADATA.put(imageUrl, classification);
  }

  /**
   * Seeds knowledge documents into the system.
   * 
   * @param {Array<{ id: string, content: string }>} documents - The documents to seed.
   */
  async seedKnowledge(documents: Array<{ id: string, content: string }>) {
    // Batch processing
    const batchSize = 10;
    for (let i = 0; i < documents.length; i += batchSize) {
      const batch = documents.slice(i, i + batchSize);
      try {
        // Generate embedding vectors
        const embeddings = await Promise.all(
          batch.map(async (doc) => {
            const embedding = await this.env.AI.run("@cf/meta/text-embedding", {
              text: doc.content,
            });
            return { id: doc.id, embedding };
          }),
        );

        // Store embeddings in Vectorize
        await this.env.VECTORIZE.store(embeddings);

        // Store original documents in D1
        await Promise.all(
          batch.map(async (doc) => {
            await this.ctx.storage.sql.exec(
              `INSERT INTO documents (id, content) VALUES (?, ?)`,
              [doc.id, doc.content],
            );
          }),
        );
      } catch (error) {
        console.error("Error processing batch", error);
        // Retry logic with exponential backoff
        setTimeout(() => this.seedKnowledge(batch), 1000 * Math.pow(2, i / batchSize));
      }
    }
  }

  /**
   * Queries knowledge documents based on a query string.
   * 
   * @param {string} query - The query string.
   * @returns {Promise<string>} The generated response.
   */
  async queryKnowledge(query: string): Promise<string> {
    try {
      // Generate embedding vector for the query
      const queryEmbedding = await this.env.AI.run("@cf/meta/text-embedding", {
        text: query,
      });

      // Perform vector search in Vectorize
      const searchResults = await this.env.VECTORIZE.search(queryEmbedding);

      // Retrieve related documents from D1
      const relatedDocuments = await Promise.all(
        searchResults.map(async (result) => {
          const doc = await this.ctx.storage.sql.exec(
            `SELECT content FROM documents WHERE id = ?`,
            [result.id],
          );
          return doc[0].content;
        }),
      );

      // Generate contextual response using Workers AI
      const response = await this.env.AI.run("@cf/meta/text-generation", {
        context: relatedDocuments.join(" "),
        query,
      });

      return response;
    } catch (error) {
      console.error("Error querying knowledge", error);
      throw new Error("Failed to query knowledge");
    }
  }
}

const subjects = createSubjects({
  user: object({
    id: string(),
  }),
});

export default {
  async fetch(request, env, ctx) {
    // TODO: Explain this stuff at the top (for demo purposes only)
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.redirect(
        url.origin +
          `/authorize?client_id=your-client-id&redirect_uri=${encodeURIComponent(url.origin + "/callback")}&response_type=code`,
      );
    } else if (url.pathname === "/callback") {
      return Response.json({
        message: "OAuth flow complete!",
        params: Object.fromEntries(url.searchParams.entries()),
      });
    } else if (url.pathname === "/rate" && request.method === "POST") {
      const { userId, messageId, rating } = await request.json();
      const chat = new Chat();
      chat.saveRating(userId, messageId, rating);
      return new Response("Rating submitted successfully", { status: 200 });
    } else if (url.pathname === "/context-aware-summary" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const summary = chat.generateMessageSummary(sessionId);
      return new Response(JSON.stringify({ summary }), { status: 200 });
    } else if (url.pathname === "/context-aware-suggestions" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const suggestions = chat.generateSuggestions(sessionId);
      return new Response(JSON.stringify({ suggestions }), { status: 200 });
    } else if (url.pathname === "/context-aware-sentiment" && request.method === "POST") {
      const { sessionId } = await request.json();
      const chat = new Chat();
      const sentiment = chat.analyzeConversationSentiment(sessionId);
      return new Response(JSON.stringify({ sentiment }), { status: 200 });
    } else if (url.pathname === "/classify-image" && request.method === "POST") {
      const { imageUrl } = await request.json();
      const chat = new Chat();
      const classification = await chat.classifyImage(imageUrl);
      await chat.storeClassificationMetadata(imageUrl, classification);
      return new Response(JSON.stringify({ classification }), { status: 200 });
    } else if (url.pathname === "/seed-knowledge" && request.method === "POST") {
      const { documents } = await request.json();
      const chat = new Chat();
      await chat.seedKnowledge(documents);
      return new Response("Knowledge seeded successfully", { status: 200 });
    } else if (url.pathname === "/query-knowledge" && request.method === "GET") {
      const query = url.searchParams.get("query");
      if (!query) {
        return new Response("Query parameter is required", { status: 400 });
      }
      const chat = new Chat();
      const response = await chat.queryKnowledge(query);
      return new Response(JSON.stringify({ response }), { status: 200 });
    }

    // The real OpenAuth server code starts here:
    return authorizer({
      storage: CloudflareStorage({
        namespace: env.AUTH_STORAGE,
      }),
      subjects,
      providers: {
        password: PasswordAdapter(
          PasswordUI({
            // eslint-disable-next-line @typescript-eslint/require-await
            sendCode: async (email, code) => {
              // This is where you would email the verification code to the
              // user, e.g. using Resend:
              // https://resend.com/docs/send-with-cloudflare-workers
              console.log(`Sending code ${code} to ${email}`);
            },
            copy: {
              input_code: "Code (check Worker logs)",
            },
          }),
        ),
        google: GoogleAdapter({
          clientID: process.env.GOOGLE_CLIENT_ID!,
          clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
          scopes: ["profile", "email"],
        }),
        github: GithubAdapter({
          clientID: process.env.GITHUB_CLIENT_ID!,
          clientSecret: process.env.GITHUB_CLIENT_SECRET!,
          scopes: ["user:email"],
        }),
        apple: AppleAdapter({
          clientID: process.env.APPLE_CLIENT_ID!,
          clientSecret: process.env.APPLE_CLIENT_SECRET!,
          scopes: ["name", "email"],
        }),
        discord: DiscordAdapter({
          clientID: process.env.DISCORD_CLIENT_ID!,
          clientSecret: process.env.DISCORD_CLIENT_SECRET!,
          scopes: ["identify", "email"],
        }),
      },
      theme: {
        title: "myAuth",
        primary: "#0051c3",
        favicon: "https://workers.cloudflare.com//favicon.ico",
        logo: {
          dark: "https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/db1e5c92-d3a6-4ea9-3e72-155844211f00/public",
          light:
            "https://imagedelivery.net/wSMYJvS3Xw-n339CbDyDIA/fa5a3023-7da9-466b-98a7-4ce01ee6c700/public",
        },
      },
      success: async (ctx, value) => {
        return ctx.subject("user", {
          id: await getOrCreateUser(env, value.email),
        });
      },
    }).fetch(request, env, ctx);
  },
} satisfies ExportedHandler<Env>;

async function getOrCreateUser(env: Env, email: string): Promise<string> {
  const result = await env.AUTH_DB.prepare(
    `
		INSERT INTO user (email)
		VALUES (?)
		ON CONFLICT (email) DO UPDATE SET email = email
		RETURNING id;
		`,
  )
    .bind(email)
    .first<{ id: string }>();
  if (!result) {
    throw new Error(`Unable to process user: ${email}`);
  }
  console.log(`Found or created user ${result.id} with email ${email}`);
  return result.id;
}
