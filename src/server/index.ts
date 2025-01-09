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
import { PasswordProvider } from "@openauthjs/openauth/provider/password";
import { PasswordUI } from "@openauthjs/openauth/ui/password";
import { object, string, validate } from "valibot";
import { GoogleProvider } from "@openauthjs/openauth/provider/google";
import { GithubProvider } from "@openauthjs/openauth/provider/github";
import { AppleProvider } from "@openauthjs/openauth/provider/apple";
import { DiscordProvider } from "@openauthjs/openauth/provider/discord";
import jwt from "jsonwebtoken";
import { performance } from "perf_hooks";
import { SentimentAnalyzer, PorterStemmer } from "natural";
import { createCipheriv, createDecipheriv, randomBytes, createHmac } from "crypto";
import { S3Client, PutObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import rateLimit from "express-rate-limit";
import { z } from "zod";

import { Chat } from "./chatServer";
import { onMessage } from "./messageHandler";
import { generateMessageSummary, generateSuggestions, analyzeConversationSentiment } from "./sessionManager";
import routing from "./routing";
import serverSetup from "./serverSetup";

const subjects = createSubjects({
  user: object({
    id: string(),
  }),
});

/**
 * Main server logic for handling fetch requests, managing user authentication, and integrating with external services.
 * 
 * @param {Request} request - The incoming request object.
 * @param {Env} env - The environment variables.
 * @param {ExecutionContext} ctx - The execution context.
 * @returns {Promise<Response>} The response object.
 * 
 * @example
 * const response = await fetch(request, env, ctx);
 * console.log(response.status);
 */
export default {
  async fetch(request, env, ctx) {
    // TODO: Explain this stuff at the top (for demo purposes only)
    const url = new URL(request.url);
    if (url.pathname === "/") {
      return Response.redirect(
        url.origin +
          `/authorize?client_id=${env.CLIENT_ID}&redirect_uri=${encodeURIComponent(url.origin + "/callback")}&response_type=code`,
      );
    } else if (url.pathname === "/callback") {
      return Response.json({
        message: "OAuth flow complete!",
        params: Object.fromEntries(url.searchParams.entries()),
      });
    } else if (url.pathname === "/rate" && request.method === "POST") {
      try {
        const { userId, messageId, rating } = await request.json();
        const chat = new Chat();
        chat.saveRating(userId, messageId, rating);
        return new Response("Rating submitted successfully", { status: 200 });
      } catch (error) {
        console.error("Error handling rating submission", error);
        return new Response("An error occurred while submitting the rating. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/context-aware-summary" && request.method === "POST") {
      try {
        const { sessionId } = await request.json();
        const chat = new Chat();
        const summary = generateMessageSummary(sessionId);
        return new Response(JSON.stringify({ summary }), { status: 200 });
      } catch (error) {
        console.error("Error generating context-aware summary", error);
        return new Response("An error occurred while generating the summary. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/context-aware-suggestions" && request.method === "POST") {
      try {
        const { sessionId } = await request.json();
        const chat = new Chat();
        const suggestions = generateSuggestions(sessionId);
        return new Response(JSON.stringify({ suggestions }), { status: 200 });
      } catch (error) {
        console.error("Error generating context-aware suggestions", error);
        return new Response("An error occurred while generating the suggestions. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/context-aware-sentiment" && request.method === "POST") {
      try {
        const { sessionId } = await request.json();
        const chat = new Chat();
        const sentiment = analyzeConversationSentiment(sessionId);
        return new Response(JSON.stringify({ sentiment }), { status: 200 });
      } catch (error) {
        console.error("Error analyzing conversation sentiment", error);
        return new Response("An error occurred while analyzing the sentiment. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/classify-image" && request.method === "POST") {
      try {
        const { imageUrl } = await request.json();
        const chat = new Chat();
        const classification = await chat.classifyImage(imageUrl);
        await chat.storeClassificationMetadata(imageUrl, classification);
        return new Response(JSON.stringify({ classification }), { status: 200 });
      } catch (error) {
        console.error("Error classifying image", error);
        return new Response("An error occurred while classifying the image. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/seed-knowledge" && request.method === "POST") {
      try {
        const { documents } = await request.json();
        const chat = new Chat();
        await chat.seedKnowledge(documents);
        return new Response("Knowledge seeded successfully", { status: 200 });
      } catch (error) {
        console.error("Error seeding knowledge", error);
        return new Response("An error occurred while seeding knowledge. Please try again.", { status: 500 });
      }
    } else if (url.pathname === "/query-knowledge" && request.method === "GET") {
      try {
        const query = url.searchParams.get("query");
        if (!query) {
          return new Response("Query parameter is required", { status: 400 });
        }
        const chat = new Chat();
        const response = await chat.queryKnowledge(query);
        return new Response(JSON.stringify({ response }), { status: 200 });
      } catch (error) {
        console.error("Error querying knowledge", error);
        return new Response("An error occurred while querying knowledge. Please try again.", { status: 500 });
      }
    }

    // Rate limiting middleware
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: "Too many requests from this IP, please try again later.",
    });

    // Apply rate limiting
    limiter(request, env, ctx, () => {});

    // Input validation using Zod
    const requestSchema = z.object({
      userId: z.string().uuid(),
      messageId: z.string().uuid(),
      rating: z.number().min(1).max(5),
    });

    try {
      requestSchema.parse(request);
    } catch (error) {
      return new Response("Invalid request data", { status: 400 });
    }

    // The real OpenAuth server code starts here:
    return authorizer({
      storage: CloudflareStorage({
        namespace: env.AUTH_STORAGE,
      }),
      subjects,
      providers: {
        password: PasswordProvider(
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
        google: GoogleProvider({
          clientID: env.GOOGLE_CLIENT_ID,
          clientSecret: env.GOOGLE_CLIENT_SECRET,
          scopes: ["profile", "email"],
        }),
        github: GithubProvider({
          clientID: env.GITHUB_CLIENT_ID,
          clientSecret: env.GITHUB_CLIENT_SECRET,
          scopes: ["user:email"],
        }),
        apple: AppleProvider({
          clientID: env.APPLE_CLIENT_ID,
          clientSecret: env.APPLE_CLIENT_SECRET,
          scopes: ["name", "email"],
        }),
        discord: DiscordProvider({
          clientID: env.DISCORD_CLIENT_ID,
          clientSecret: env.DISCORD_CLIENT_SECRET,
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

/**
 * Retrieves or creates a user in the database based on the provided email.
 * 
 * @param {Env} env - The environment variables.
 * @param {string} email - The email of the user.
 * @returns {Promise<string>} The user ID.
 * 
 * @example
 * const userId = await getOrCreateUser(env, "user@example.com");
 * console.log(userId);
 */
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
