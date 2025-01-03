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
    }
  | {
      type: "all";
      messages: ChatMessage[];
    };

/**
 * Represents a user session in the application.
 * Each session has an ID, user ID, timestamps, messages, IP address, user agent, user activity timestamps, device information, session duration, and optional profile information.
 * 
 * @typedef {Object} Session
 * @property {string} session_id - The unique identifier for the session.
 * @property {string} user_id - The unique identifier for the user.
 * @property {string} created_at - The timestamp when the session was created.
 * @property {string} updated_at - The timestamp when the session was last updated.
 * @property {string} messages - The messages associated with the session.
 * @property {string} ip_address - The IP address of the user.
 * @property {string} user_agent - The user agent of the user's device.
 * @property {string[]} user_activity_timestamps - The timestamps of user activities during the session.
 * @property {string} device_information - The device information of the user's device.
 * @property {number} session_duration - The duration of the session in seconds.
 * @property {Object} [profile] - Optional profile information of the user.
 * @property {string} profile.picture - The profile picture URL of the user.
 * @property {string} profile.status - The status message of the user.
 * @property {string} profile.bio - The bio of the user.
 * @property {string} profile.location - The location of the user.
 * @property {string} profile.website - The website of the user.
 * @property {string} profile.social_media_links - The social media links of the user.
 * @property {string} [context] - Optional context information for the session.
 * @property {Object} [preferences] - Optional user preferences for personalized interactions.
 * @property {string} [preferences.theme] - The theme preference of the user.
 * @property {string} [preferences.avatar] - The avatar preference of the user.
 * @property {string} [preferences.interaction_style] - The interaction style preference of the user.
 * @property {string[]} [multi_modal_attachments] - Optional multi-modal attachments associated with the session.
 * @property {string} [sentiment] - Optional sentiment analysis result of the session.
 * 
 * @example
 * const session = {
 *   session_id: "session1",
 *   user_id: "user1",
 *   created_at: "2023-01-01T00:00:00Z",
 *   updated_at: "2023-01-01T01:00:00Z",
 *   messages: "Hello, world!",
 *   ip_address: "192.168.1.1",
 *   user_agent: "Mozilla/5.0",
 *   user_activity_timestamps: ["2023-01-01T00:00:00Z", "2023-01-01T00:30:00Z"],
 *   device_information: "Windows 10",
 *   session_duration: 3600,
 *   profile: {
 *     picture: "https://example.com/profile.png",
 *     status: "Online",
 *     bio: "Software Developer",
 *     location: "San Francisco",
 *     website: "https://example.com",
 *     social_media_links: "https://twitter.com/example"
 *   },
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
export type Session = {
  session_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: string;
  ip_address: string;
  user_agent: string;
  user_activity_timestamps: string[];
  device_information: string;
  session_duration: number;
  profile?: {
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
  };
  context?: string;
  preferences?: {
    theme: string;
    avatar: string;
    interaction_style: string;
  };
  multi_modal_attachments?: string[];
  sentiment?: string;
};

/**
 * Represents a context-aware message summary.
 * Each summary has an ID, session ID, summary content, and timestamp.
 * 
 * @typedef {Object} ContextAwareMessageSummary
 * @property {string} summary_id - The unique identifier for the summary.
 * @property {string} session_id - The unique identifier for the session.
 * @property {string} summary - The summary content of the conversation history.
 * @property {string} timestamp - The timestamp when the summary was generated.
 * 
 * @example
 * const summary = {
 *   summary_id: "summary1",
 *   session_id: "session1",
 *   summary: "Summary of the conversation history",
 *   timestamp: "2023-01-01T01:00:00Z"
 * };
 */
export type ContextAwareMessageSummary = {
  summary_id: string;
  session_id: string;
  summary: string;
  timestamp: string;
};

/**
 * Represents context-aware suggestions.
 * Each suggestion has an ID, session ID, suggestions content, and timestamp.
 * 
 * @typedef {Object} ContextAwareSuggestions
 * @property {string} suggestion_id - The unique identifier for the suggestion.
 * @property {string} session_id - The unique identifier for the session.
 * @property {string[]} suggestions - The suggestions content based on conversation history and user preferences.
 * @property {string} timestamp - The timestamp when the suggestions were generated.
 * 
 * @example
 * const suggestions = {
 *   suggestion_id: "suggestion1",
 *   session_id: "session1",
 *   suggestions: ["Suggestion 1", "Suggestion 2"],
 *   timestamp: "2023-01-01T01:00:00Z"
 * };
 */
export type ContextAwareSuggestions = {
  suggestion_id: string;
  session_id: string;
  suggestions: string[];
  timestamp: string;
};

/**
 * Represents context-aware sentiment analysis.
 * Each analysis has an ID, session ID, sentiment result, and timestamp.
 * 
 * @typedef {Object} ContextAwareSentimentAnalysis
 * @property {string} analysis_id - The unique identifier for the analysis.
 * @property {string} session_id - The unique identifier for the session.
 * @property {string} sentiment - The sentiment analysis result of the conversation history.
 * @property {string} timestamp - The timestamp when the analysis was performed.
 * 
 * @example
 * const analysis = {
 *   analysis_id: "analysis1",
 *   session_id: "session1",
 *   sentiment: "positive",
 *   timestamp: "2023-01-01T01:00:00Z"
 * };
 */
export type ContextAwareSentimentAnalysis = {
  analysis_id: string;
  session_id: string;
  sentiment: string;
  timestamp: string;
};

/**
 * Represents a knowledge document to be seeded into the system.
 * Each document has an ID and content.
 * 
 * @typedef {Object} KnowledgeDocument
 * @property {string} id - The unique identifier for the document.
 * @property {string} content - The content of the document.
 * 
 * @example
 * const document = {
 *   id: "doc1",
 *   content: "This is a knowledge document."
 * };
 */
export type KnowledgeDocument = {
  id: string;
  content: string;
};

/**
 * Represents a knowledge query to retrieve related documents.
 * Each query has a query string and an array of related documents.
 * 
 * @typedef {Object} KnowledgeQuery
 * @property {string} query - The query string.
 * @property {string[]} relatedDocuments - The array of related documents.
 * 
 * @example
 * const query = {
 *   query: "What is the capital of France?",
 *   relatedDocuments: ["Paris is the capital of France."]
 * };
 */
export type KnowledgeQuery = {
  query: string;
  relatedDocuments: string[];
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
