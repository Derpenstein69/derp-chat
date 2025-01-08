import { createRoot } from "react-dom/client";
import { usePartySocket } from "./RealTimeComm";
import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router";
import { nanoid } from "nanoid";
import { handleAuthCallback } from "./UserAuth";
import { z } from "zod";

import { names, type ChatMessage, type Message } from "../shared";
import {
  FeedbackButtons,
  RatingSystem,
  FeedbackForm,
  SurveyLink,
  EmbeddedSurvey,
  MessageReactions,
  MessageThreads,
  AnalyticsDisplay,
  CloudflareSecretsSettings,
} from "./UIComponents";

// Define a schema for input validation using Zod
const messageSchema = z.object({
  content: z.string().min(1, "Content cannot be empty"),
});

/**
 * Main application component.
 * Manages the chat interface, user authentication, and real-time communication.
 * 
 * @returns {JSX.Element} The rendered chat application component.
 * 
 * @example
 * <App />
 */
function App(): JSX.Element {
  // State variables for managing user profile, messages, and search query
  const [name, setName] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
    theme: string; // Pc65c
    avatar: string; // Pc65c
    interaction_style: string; // Pc65c
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const { room } = useParams();
  const location = useLocation();

  // Effect for handling authentication callback and setting user profile
  useEffect(() => {
    handleAuthCallback(location).then((userProfile) => {
      if (userProfile) {
        setName(userProfile.name);
        setProfile(userProfile.profile);
      }
    });
  }, [location.search]);

  // Initialize PartySocket for real-time communication and user authentication
  const socket = usePartySocket({
    party: "chat",
    room,
    onMessage: (evt) => {
      try {
        const message = JSON.parse(evt.data as string) as Message;
        if (message.type === "add") {
          const foundIndex = messages.findIndex((m) => m.id === message.id);
          if (foundIndex === -1) {
            // probably someone else who added a message
            setMessages((messages) => [
              ...messages,
              {
                id: message.id,
                content: message.content,
                user: message.user,
                role: message.role,
                attachments: message.attachments,
                profile: message.profile, // P3190
                context: message.context, // P3a7a
                preferences: message.preferences, // P5238
                multi_modal_attachments: message.multi_modal_attachments, // P1668
                classification: message.classification, // P35d4
              },
            ]);
          } else {
            // this usually means we ourselves added a message
            // and it was broadcasted back
            // so let's replace the message with the new message
            setMessages((messages) => {
              return messages
                .slice(0, foundIndex)
                .concat({
                  id: message.id,
                  content: message.content,
                  user: message.user,
                  role: message.role,
                  attachments: message.attachments,
                  profile: message.profile, // P3190
                  context: message.context, // P3a7a
                  preferences: message.preferences, // P5238
                  multi_modal_attachments: message.multi_modal_attachments, // P1668
                  classification: message.classification, // P35d4
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
                    profile: message.profile, // P3190
                    context: message.context, // P3a7a
                    preferences: message.preferences, // P5238
                    multi_modal_attachments: message.multi_modal_attachments, // P1668
                    classification: message.classification, // P35d4
                  }
                : m,
            ),
          );
        } else {
          setMessages(message.messages);
        }
      } catch (error) {
        console.error("Error processing incoming message", error);
        // Display user-friendly error message
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

  // Filter messages based on search query
  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Voice recognition setup
  const [isListening, setIsListening] = useState(false);
  const [voiceInput, setVoiceInput] = useState("");

  useEffect(() => {
    if (isListening) {
      const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.onresult = (event) => {
        const transcript = Array.from(event.results)
          .map((result) => result[0])
          .map((result) => result.transcript)
          .join("");
        setVoiceInput(transcript);
      };
      recognition.start();
      return () => recognition.stop();
    }
  }, [isListening]);

  return (
    <div className="chat container">
      <form className="row search-form">
        <input
          type="text"
          name="search"
          className="ten columns search-input"
          placeholder="Search messages..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>
      {filteredMessages.map((message) => (
        <div key={message.id} className="row message">
          <div className="two columns user">
            {message.user}
            {message.profile && ( // P3190
              <>
                <img src={message.profile.picture} alt="Profile" className="profile-picture" />
                <div className="status-message">{message.profile.status}</div>
                <div className="bio">{message.profile.bio}</div>
                <div className="location">{message.profile.location}</div>
                <div className="website">
                  <a href={message.profile.website} target="_blank" rel="noopener noreferrer">
                    {message.profile.website}
                  </a>
                </div>
                <div className="social-media-links">{message.profile.social_media_links}</div>
              </>
            )}
          </div>
          <div className="ten columns">
            {message.content}
            {message.attachments &&
              message.attachments.map((attachment, index) => (
                <div key={index}>
                  {attachment.match(/\.(jpeg|jpg|gif|png)$/) ? (
                    <img src={attachment} alt="Attachment" className="attachment-image" />
                  ) : (
                    <a href={attachment} target="_blank" rel="noopener noreferrer">
                      {attachment}
                    </a>
                  )}
                </div>
              ))}
            {message.classification && ( // P35d4
              <div className="classification-result">
                Classification: {message.classification}
              </div>
            )}
            <FeedbackButtons messageId={message.id} />
            {message.role === "assistant" && <RatingSystem messageId={message.id} />}
            <FeedbackForm messageId={message.id} />
            <MessageReactions messageId={message.id} />
            <MessageThreads messageId={message.id} />
          </div>
        </div>
      ))}
      <form
        className="row"
        onSubmit={async (e) => {
          e.preventDefault();
          const content = e.currentTarget.elements.namedItem(
            "content",
          ) as HTMLInputElement;
          const fileInput = e.currentTarget.elements.namedItem(
            "attachment",
          ) as HTMLInputElement;

          // Validate input data
          const validationResult = messageSchema.safeParse({ content: content.value });
          if (!validationResult.success) {
            alert(validationResult.error.errors[0].message);
            return;
          }

          try {
            const formData = new FormData();
            formData.append("content", content.value);
            if (fileInput.files && fileInput.files.length > 0) {
              formData.append("attachment", fileInput.files[0]);
            }

            const response = await fetch("/upload", {
              method: "POST",
              body: formData,
            });

            const { attachmentUrl } = await response.json();

            const classificationResponse = await fetch("/classify-image", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ imageUrl: attachmentUrl }),
            });

            const { classification } = await classificationResponse.json();

            const chatMessage: ChatMessage = {
              id: nanoid(8),
              content: content.value,
              user: name || "Anonymous",
              role: "user",
              attachments: attachmentUrl ? [attachmentUrl] : [],
              profile: profile || undefined, // P3190
              context: "", // P3a7a
              preferences: profile ? { // P5238
                theme: profile.theme,
                avatar: profile.avatar,
                interaction_style: profile.interaction_style,
              } : undefined,
              multi_modal_attachments: [], // P1668
              classification, // P35d4
            };

            setMessages((messages) => [...messages, chatMessage]);

            socket.send(
              JSON.stringify({
                type: "add",
                ...chatMessage,
              } satisfies Message),
            );

            content.value = "";
            fileInput.value = "";
          } catch (error) {
            console.error("Error sending message", error);
            // Display user-friendly error message
            alert("An error occurred while sending the message. Please try again.");
          }
        }}
      >
        <input
          type="text"
          name="content"
          className="ten columns my-input-text"
          placeholder={`Hello ${name || "Anonymous"}! Type a message...`}
          autoComplete="off"
          value={voiceInput}
        />
        <input type="file" name="attachment" className="ten columns" />
        <button type="submit" className="send-message two columns">
          Send
        </button>
        <button
          type="button"
          className="voice-input two columns"
          onClick={() => setIsListening((prev) => !prev)}
        >
          {isListening ? "Stop Listening" : "Start Listening"}
        </button>
      </form>
      <SurveyLink />
      <EmbeddedSurvey />
      <AnalyticsDisplay />
    </div>
  );
}
