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
import { object, string } from "valibot";
import { GoogleAdapter } from "@openauthjs/openauth/adapter/google";
import { GithubAdapter } from "@openauthjs/openauth/adapter/github";
import { AppleAdapter } from "@openauthjs/openauth/adapter/apple";
import { DiscordAdapter } from "@openauthjs/openauth/adapter/discord";
import jwt from "jsonwebtoken";

import type { ChatMessage, Message } from "../shared";

/**
 * Chat class handles the chat server logic and manages messages and sessions.
 */
export class Chat extends Server<Env> {
  static options = { hibernate: true };

  messages = [] as ChatMessage[];
  sessions = new Map<string, any>();

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
      `CREATE TABLE IF NOT EXISTS messages (id TEXT PRIMARY KEY, user TEXT, role TEXT, content TEXT, attachments TEXT, user_id TEXT, thread_id TEXT, reply_to TEXT)`,
    );

    // create the sessions table if it doesn't exist
    this.ctx.storage.sql.exec(
      `CREATE TABLE IF NOT EXISTS sessions (session_id TEXT PRIMARY KEY, user_id TEXT REFERENCES users(id), created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP, messages TEXT, ip_address TEXT, user_agent TEXT)`,
    );

    // load the messages from the database
    this.messages = this.ctx.storage.sql
      .exec(`SELECT * FROM messages`)
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

    this.ctx.storage.sql.exec(
      `INSERT INTO messages (id, user, role, content, attachments, user_id, session_id, thread_id, reply_to) VALUES ('${
        message.id
      }', '${message.user}', '${message.role}', ${JSON.stringify(
        message.content,
      )}, ${JSON.stringify(message.attachments)}, '${message.user_id}', '${message.session_id}', '${message.thread_id}', '${message.reply_to}') ON CONFLICT (id) DO UPDATE SET content = ${JSON.stringify(
        message.content,
      )}, attachments = ${JSON.stringify(message.attachments)}, thread_id = '${message.thread_id}', reply_to = '${message.reply_to}'`,
    );
  }

  /**
   * Saves a session to the local store and the database.
   * 
   * @param {any} session - The session to save.
   */
  saveSession(session: any) {
    this.sessions.set(session.session_id, session);

    this.ctx.storage.sql.exec(
      `INSERT INTO sessions (session_id, user_id, created_at, updated_at, messages, ip_address, user_agent) VALUES ('${
        session.session_id
      }', '${session.user_id}', '${session.created_at}', '${session.updated_at}', ${JSON.stringify(
        session.messages,
      )}, '${session.ip_address}', '${session.user_agent}') ON CONFLICT (session_id) DO UPDATE SET updated_at = '${session.updated_at}', messages = ${JSON.stringify(
        session.messages,
      )}`,
    );
  }

  /**
   * Handles incoming messages from clients, updates local store and broadcasts messages.
   * 
   * @param {Connection} connection - The connection object representing the client.
   * @param {WSMessage} message - The message received from the client.
   */
  async onMessage(connection: Connection, message: WSMessage) {
    // let's broadcast the raw message to everyone else
    this.broadcast(message);

    // let's update our local messages store
    const parsed = JSON.parse(message as string) as Message;

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
      };
      session.messages.push(parsed);
      session.updated_at = new Date().toISOString();
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
