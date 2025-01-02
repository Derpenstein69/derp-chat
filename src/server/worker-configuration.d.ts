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
