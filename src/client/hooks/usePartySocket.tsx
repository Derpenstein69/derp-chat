import { usePartySocket as originalUsePartySocket } from "partysocket/react";
import { useState } from "react";
import { nanoid } from "nanoid";
import { type ChatMessage, type Message } from "../../types/ChatMessage";

export function usePartySocket(options) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socket = originalUsePartySocket({
    ...options,
    onMessage: (evt) => {
      try {
        const message = JSON.parse(evt.data as string) as Message;
        if (message.type === "add") {
          const foundIndex = messages.findIndex((m) => m.id === message.id);
          if (foundIndex === -1) {
            setMessages((messages) => [
              ...messages,
              {
                id: message.id,
                content: message.content,
                user: message.user,
                role: message.role,
                attachments: message.attachments,
                profile: message.profile,
                context: message.context,
                preferences: message.preferences,
                multi_modal_attachments: message.multi_modal_attachments,
                classification: message.classification,
              },
            ]);
          } else {
            setMessages((messages) => {
              return messages
                .slice(0, foundIndex)
                .concat({
                  id: message.id,
                  content: message.content,
                  user: message.user,
                  role: message.role,
                  attachments: message.attachments,
                  profile: message.profile,
                  context: message.context,
                  preferences: message.preferences,
                  multi_modal_attachments: message.multi_modal_attachments,
                  classification: message.classification,
                })
                .concat(messages.slice(foundIndex + 1));
            });
          }
        } else if (message.type === "update") {
          setMessages((messages) =>
            messages.map((m) =>
              m.id === message.id
                ? {
                    id: message.id,
                    content: message.content,
                    user: message.user,
                    role: message.role,
                    attachments: message.attachments,
                    profile: message.profile,
                    context: message.context,
                    preferences: message.preferences,
                    multi_modal_attachments: message.multi_modal_attachments,
                    classification: message.classification,
                  }
                : m,
            ),
          );
        } else {
          setMessages(message.messages);
        }
      } catch (error) {
        console.error("Error processing incoming message", error);
        alert("An error occurred while processing a message. Please try again.");
      }
    },
    onAuth: async () => {
      const tokens = {
        access: localStorage.getItem("access_token"),
        refresh: localStorage.getItem("refresh_token"),
      };
      if (!tokens.access || !tokens.refresh) {
        throw new Error("User is not authenticated");
      }
      return tokens.access;
    },
  });

  return socket;
}
