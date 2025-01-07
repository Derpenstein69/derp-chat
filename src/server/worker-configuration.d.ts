/**
 * Environment interface for the Durable Chat application.
 * This interface defines the environment variables and bindings used in the application.
 */
interface Env {
  /**
   * Durable Object namespace for the Chat class.
   * This binding allows the application to create and interact with Durable Objects of the Chat class.
   */
  Chat: DurableObjectNamespace<import("./index").Chat>;

  /**
   * AI binding for the AI assistant.
   * This binding allows the application to interact with the AI assistant for generating responses.
   */
  AI: Ai;

  /**
   * Fetcher binding for serving static assets.
   * This binding allows the application to fetch and serve static assets from the specified directory.
   */
  ASSETS: Fetcher;

  /**
   * KV Namespace for storing authentication-related data.
   * This binding allows the application to store and retrieve authentication-related data in a key-value store.
   */
  AUTH_STORAGE: KVNamespace;

  /**
   * D1 Database for storing user and session data.
   * This binding allows the application to interact with a D1 database for storing user profiles and session information.
   */
  AUTH_DB: D1Database;

  /**
   * Google OAuth client ID.
   * This environment variable stores the client ID for Google OAuth authentication.
   */
  GOOGLE_CLIENT_ID: string;

  /**
   * Google OAuth client secret.
   * This environment variable stores the client secret for Google OAuth authentication.
   */
  GOOGLE_CLIENT_SECRET: string;

  /**
   * GitHub OAuth client ID.
   * This environment variable stores the client ID for GitHub OAuth authentication.
   */
  GITHUB_CLIENT_ID: string;

  /**
   * GitHub OAuth client secret.
   * This environment variable stores the client secret for GitHub OAuth authentication.
   */
  GITHUB_CLIENT_SECRET: string;

  /**
   * Apple OAuth client ID.
   * This environment variable stores the client ID for Apple OAuth authentication.
   */
  APPLE_CLIENT_ID: string;

  /**
   * Apple OAuth client secret.
   * This environment variable stores the client secret for Apple OAuth authentication.
   */
  APPLE_CLIENT_SECRET: string;

  /**
   * Discord OAuth client ID.
   * This environment variable stores the client ID for Discord OAuth authentication.
   */
  DISCORD_CLIENT_ID: string;

  /**
   * Discord OAuth client secret.
   * This environment variable stores the client secret for Discord OAuth authentication.
   */
  DISCORD_CLIENT_SECRET: string;

  /**
   * JWT secret for token validation.
   * This environment variable stores the secret key used for JWT token validation.
   */
  JWT_SECRET: string;

  /**
   * HMAC secret key for signature validation.
   * This environment variable stores the secret key used for HMAC signature validation.
   */
  HMAC_SECRET_KEY: string;

  /**
   * Cloudflare R2 access key ID.
   * This environment variable stores the access key ID for Cloudflare R2.
   */
  R2_ACCESS_KEY_ID: string;

  /**
   * Cloudflare R2 secret access key.
   * This environment variable stores the secret access key for Cloudflare R2.
   */
  R2_SECRET_ACCESS_KEY: string;

  /**
   * Cloudflare R2 bucket name.
   * This environment variable stores the name of the Cloudflare R2 bucket.
   */
  R2_BUCKET_NAME: string;

  /**
   * Cloudflare R2 region.
   * This environment variable stores the region of the Cloudflare R2 bucket.
   */
  R2_REGION: string;

  /**
   * Cloudflare Worker for image classification.
   * This environment variable stores the Cloudflare Worker for image classification.
   */
  IMAGE_CLASSIFICATION_WORKER: string;

  /**
   * Cloudflare KV namespace for storing classification metadata.
   * This environment variable stores the Cloudflare KV namespace for storing classification metadata.
   */
  CLASSIFICATION_METADATA: KVNamespace;

  /**
   * Vectorize API key.
   * This environment variable stores the API key for Vectorize.
   */
  VECTORIZE_API_KEY: string;

  /**
   * Vectorize endpoint.
   * This environment variable stores the endpoint for Vectorize.
   */
  VECTORIZE_ENDPOINT: string;
}

/**
 * User interface for the Durable Chat application.
 * This interface defines the user profile fields used in the application.
 */
interface User {
  id: string;
  name: string;
  email: string;
  profile_picture_url: string;
  status_message: string;
  bio: string;
  location: string;
  website: string;
  social_media_links: string;
}
