/**
 * Represents a chat message in the application.
 * Each message has an ID, content, user, role, and optional attachments and profile information.
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
