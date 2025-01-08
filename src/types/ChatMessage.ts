/**
 * @file ChatMessage.ts
 * @description Shared types and constants used across the application.
 * @module Shared
 */

/**
 * Represents a chat message in the application.
 * Each message has an ID, content, user, role, and optional attachments and profile information.
 * 
 * @typedef {Object} ChatMessage
 * @property {string} id - The unique identifier for the message.
 * @property {string} content - The content of the message.
 * @property {string} user - The user who sent the message.
 * @property {"user" | "assistant"} role - The role of the user (either "user" or "assistant").
 * @property {string[]} [attachments] - Optional attachments associated with the message.
 * @property {Object} [profile] - Optional profile information of the user.
 * @property {string} profile.picture - The profile picture URL of the user.
 * @property {string} profile.status - The status message of the user.
 * @property {string} profile.bio - The bio of the user.
 * @property {string} profile.location - The location of the user.
 * @property {string} profile.website - The website of the user.
 * @property {string} profile.social_media_links - The social media links of the user.
 * @property {string} [session_id] - Optional session ID associated with the message.
 * @property {string} [user_id] - Optional user ID associated with the message.
 * @property {string} [thread_id] - Optional thread ID associated with the message.
 * @property {string} [reply_to] - Optional reply-to ID associated with the message.
 * @property {string} [context] - Optional context information for the message.
 * @property {Object} [preferences] - Optional user preferences for personalized interactions.
 * @property {string} [preferences.theme] - The theme preference of the user.
 * @property {string} [preferences.avatar] - The avatar preference of the user.
 * @property {string} [preferences.interaction_style] - The interaction style preference of the user.
 * @property {string[]} [multi_modal_attachments] - Optional multi-modal attachments associated with the message.
 * @property {string} [sentiment] - Optional sentiment analysis result of the message.
 * 
 * @example
 * const message = {
 *   id: "12345",
 *   content: "Hello, world!",
 *   user: "Alice",
 *   role: "user",
 *   attachments: ["image.png"],
 *   profile: {
 *     picture: "https://example.com/profile.png",
 *     status: "Online",
 *     bio: "Software Developer",
 *     location: "San Francisco",
 *     website: "https://example.com",
 *     social_media_links: "https://twitter.com/example"
 *   },
 *   session_id: "session1",
 *   user_id: "user1",
 *   thread_id: "thread1",
 *   reply_to: "message1",
 *   context: "Previous conversation context",
 *   preferences: {
 *     theme: "dark",
 *     avatar: "robot",
 *     interaction_style: "friendly"
 *   },
 *   multi_modal_attachments: ["video.mp4"],
 *   sentiment: "positive"
 * };
 */
export type ChatMessage = {
  id: string;
  content: string;
  user: string;
  role: "user" | "assistant";
  attachments?: string[];
  profile?: {
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
  };
  session_id?: string;
  user_id?: string;
  thread_id?: string;
  reply_to?: string;
  context?: string;
  preferences?: {
    theme: string;
    avatar: string;
    interaction_style: string;
  };
  multi_modal_attachments?: string[];
  sentiment?: string;
};
