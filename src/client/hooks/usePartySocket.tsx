import { usePartySocket as originalUsePartySocket } from "partysocket/react";
import { useState, useEffect, useRef } from "react";
import { nanoid } from "nanoid";
import { type ChatMessage, type Message } from "../../types/ChatMessage";

export function usePartySocket(options) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const socketRef = useRef(null);
  const messageQueue = useRef([]);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = originalUsePartySocket({
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
            logErrorToService(error, evt);
          }
        },
        onAuth: async () => {
          try {
            const tokens = {
              access: localStorage.getItem("access_token"),
              refresh: localStorage.getItem("refresh_token"),
            };
            if (!tokens.access || !tokens.refresh) {
              throw new Error("User is not authenticated");
            }
            return tokens.access;
          } catch (error) {
            console.error("Error during authentication", error);
            alert("An error occurred during authentication. Please try again.");
            logErrorToService(error, null);
            throw error;
          }
        },
        onError: (error) => {
          console.error("WebSocket error", error);
          alert("An error occurred with the WebSocket connection. Please try again.");
          logErrorToService(error, null);
        },
      });
    }

    return () => {
      if (socketRef.current) {
        socketRef.current.close();
        socketRef.current = null;
      }
    };
  }, [options]);

  useEffect(() => {
    if (messageQueue.current.length > 0 && socketRef.current) {
      const batch = messageQueue.current.splice(0, messageQueue.current.length);
      batch.forEach((msg) => socketRef.current.send(msg));
    }
  }, [messages]);

  const logErrorToService = async (error, evt) => {
    try {
      const logData = {
        level: "error",
        message: error.message,
        context: {
          event: evt,
        },
        error: {
          name: error.name,
          stack: error.stack,
        },
      };

      await fetch("https://your-logging-service-endpoint", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(logData),
      });
    } catch (loggingError) {
      console.error("Error logging to external service", loggingError);
    }
  };

  const sendMessage = (msg) => {
    if (socketRef.current && socketRef.current.readyState === WebSocket.OPEN) {
      socketRef.current.send(msg);
    } else {
      messageQueue.current.push(msg);
    }
  };

  return { socket: socketRef.current, sendMessage, messages };
}
