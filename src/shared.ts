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
};

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
    }
  | {
      type: "all";
      messages: ChatMessage[];
    };

export type Session = {
  session_id: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  messages: string;
  ip_address: string;
  user_agent: string;
};

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
