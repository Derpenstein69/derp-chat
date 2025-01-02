/**
 * @file shared.ts
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
 * @property {string} [session_id] - Optional session ID associated with the message.
 * @property {string} [user_id] - Optional user ID associated with the message.
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
 *     status: "Online"
 *   },
 *   session_id: "session1",
 *   user_id: "user1"
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
  };
  session_id?: string;
  user_id?: string;
};

/**
 * Represents different types of messages that can be sent in the application.
 * - "add": A new message is added.
 * - "update": An existing message is updated.
 * - "all": All messages are sent.
 * 
 * @typedef {Object} Message
 * @property {"add" | "update" | "all"} type - The type of the message.
 * @property {string} id - The unique identifier for the message.
 * @property {string} content - The content of the message.
 * @property {string} user - The user who sent the message.
 * @property {"user" | "assistant"} role - The role of the user (either "user" or "assistant").
 * @property {string[]} [attachments] - Optional attachments associated with the message.
 * @property {Object} [profile] - Optional profile information of the user.
 * @property {string} profile.picture - The profile picture URL of the user.
 * @property {string} profile.status - The status message of the user.
 * @property {string} [session_id] - Optional session ID associated with the message.
 * @property {string} [user_id] - Optional user ID associated with the message.
 * @property {ChatMessage[]} [messages] - Array of chat messages (used for "all" type).
 * 
 * @example
 * const addMessage = {
 *   type: "add",
 *   id: "12345",
 *   content: "Hello, world!",
 *   user: "Alice",
 *   role: "user",
 *   attachments: ["image.png"],
 *   profile: {
 *     picture: "https://example.com/profile.png",
 *     status: "Online"
 *   },
 *   session_id: "session1",
 *   user_id: "user1"
 * };
 * 
 * const updateMessage = {
 *   type: "update",
 *   id: "12345",
 *   content: "Hello, world!",
 *   user: "Alice",
 *   role: "user",
 *   attachments: ["image.png"],
 *   profile: {
 *     picture: "https://example.com/profile.png",
 *     status: "Online"
 *   },
 *   session_id: "session1",
 *   user_id: "user1"
 * };
 * 
 * const allMessages = {
 *   type: "all",
 *   messages: [addMessage, updateMessage]
 * };
 */
export type Message =
  | {
      type: "add";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
      attachments?: string[];
      profile?: {
        picture: string;
        status: string;
      };
      session_id?: string;
      user_id?: string;
    }
  | {
      type: "update";
      id: string;
      content: string;
      user: string;
      role: "user" | "assistant";
      attachments?: string[];
      profile?: {
        picture: string;
        status: string;
      };
      session_id?: string;
      user_id?: string;
    }
  | {
      type: "all";
      messages: ChatMessage[];
    };

/**
 * Represents a user session in the application.
 * Each session has an ID, user ID, timestamps, messages, IP address, and user agent.
 * 
 * @typedef {Object} Session
 * @property {string} session_id - The unique identifier for the session.
 * @property {string} user_id - The unique identifier for the user.
 * @property {string} created_at - The timestamp when the session was created.
 * @property {string} updated_at - The timestamp when the session was last updated.
 * @property {string} messages - The messages associated with the session.
 * @property {string} ip_address - The IP address of the user.
 * @property {string} user_agent - The user agent of the user's device.
 * 
 * @example
 * const session = {
 *   session_id: "session1",
 *   user_id: "user1",
 *   created_at: "2023-01-01T00:00:00Z",
 *   updated_at: "2023-01-01T01:00:00Z",
 *   messages: "Hello, world!",
 *   ip_address: "192.168.1.1",
 *   user_agent: "Mozilla/5.0"
 * };
 */
export type Session = {
  session_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: string;
  ip_address: string;
  user_agent: string;
};

/**
 * List of predefined user names for the chat application.
 * These names are used to assign default names to users.
 * 
 * @constant {string[]} names
 * 
 * @example
 * const defaultName = names[0]; // "Alice"
 */
export const names = [
  "Alice",
  "Bob",
  "Charlie",
  "David",
  "Eve",
  "Frank",
  "Grace",
  "Heidi",
  "Ivan",
  "Judy",
  "Kevin",
  "Linda",
  "Mallory",
  "Nancy",
  "Oscar",
  "Peggy",
  "Quentin",
  "Randy",
  "Steve",
  "Trent",
  "Ursula",
  "Victor",
  "Walter",
  "Xavier",
  "Yvonne",
  "Zoe",
];
