/**
 * @file index.tsx
 * @description Main application component and related components for managing the chat interface.
 * @module Client
 */

import { createRoot } from "react-dom/client";
import { usePartySocket } from "partysocket/react";
import React, { useState, useEffect } from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  useParams,
  useLocation,
} from "react-router";
import { nanoid } from "nanoid";
import { createClient } from "@openauthjs/openauth/client";
import { object, string, validate } from "valibot";

import { names, type ChatMessage, type Message } from "../shared";

// Create an OpenAuth client for user authentication
const client = createClient({
  clientID: "your-client-id",
  issuer: "https://auth.myserver.com",
});

// Define a schema for input validation using valibot
const messageSchema = object({
  content: string().min(1, "Content cannot be empty"),
});

/**
 * ErrorBoundary component to catch and handle errors in the component tree.
 * 
 * @param {Object} props - Component properties.
 * @param {React.ReactNode} props.children - Child components.
 * 
 * @returns {JSX.Element} The rendered error boundary component.
 * 
 * @example
 * <ErrorBoundary>
 *   <App />
 * </ErrorBoundary>
 */
class ErrorBoundary extends React.Component<{ children: React.ReactNode }, { hasError: boolean }> {
  constructor(props: { children: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("ErrorBoundary caught an error", error, errorInfo);
    // Implement a logging mechanism to log errors to an external logging service
    // Example: logErrorToService(error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong. Please try again later.</h1>;
    }

    return this.props.children;
  }
}

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
  const [name, setName] = useState<string | null>(null);
  const [profile, setProfile] = useState<{
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
  } | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>(""); // Search query state
  const { room } = useParams();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const query = new URLSearchParams(location.search);
        const code = query.get("code");
        if (code) {
          const tokens = await client.exchange(code, window.location.origin);
          localStorage.setItem("access_token", tokens.access);
          localStorage.setItem("refresh_token", tokens.refresh);

          const userProfile = await client.getUserProfile(tokens.access);
          setName(userProfile.name);
          setProfile({
            picture: userProfile.picture,
            status: userProfile.status,
            bio: userProfile.bio,
            location: userProfile.location,
            website: userProfile.website,
            social_media_links: userProfile.social_media_links,
          });
        }
      } catch (error) {
        console.error("Error during authentication callback", error);
        // Display user-friendly error message
        alert("An error occurred during authentication. Please try again.");
      }
    };

    handleAuthCallback();
  }, [location.search]);

  // Initialize PartySocket for real-time communication
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
  });

  // Filter messages based on search query
  const filteredMessages = messages.filter((message) =>
    message.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
            {profile && (
              <>
                <img src={profile.picture} alt="Profile" className="profile-picture" />
                <div className="status-message">{profile.status}</div>
                <div className="bio">{profile.bio}</div>
                <div className="location">{profile.location}</div>
                <div className="website">
                  <a href={profile.website} target="_blank" rel="noopener noreferrer">
                    {profile.website}
                  </a>
                </div>
                <div className="social-media-links">{profile.social_media_links}</div>
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
            <FeedbackButtons messageId={message.id} />
            <RatingSystem messageId={message.id} />
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
          const validationResult = validate(messageSchema, { content: content.value });
          if (!validationResult.success) {
            alert(validationResult.errors[0].message);
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

            const chatMessage: ChatMessage = {
              id: nanoid(8),
              content: content.value,
              user: name || "Anonymous",
              role: "user",
              attachments: attachmentUrl ? [attachmentUrl] : [],
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
        />
        <input type="file" name="attachment" className="ten columns" />
        <button type="submit" className="send-message two columns">
          Send
        </button>
      </form>
      <SurveyLink />
      <EmbeddedSurvey />
    </div>
  );
}

/**
 * Component for managing user profile settings.
 * 
 * @returns {JSX.Element} The rendered profile settings form.
 * 
 * @example
 * <ProfileSettings />
 */
function ProfileSettings(): JSX.Element {
  const [profile, setProfile] = useState<{
    picture: string;
    status: string;
    bio: string;
    location: string;
    website: string;
    social_media_links: string;
  }>({
    picture: "",
    status: "",
    bio: "",
    location: "",
    website: "",
    social_media_links: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfile((prevProfile) => ({
      ...prevProfile,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // Save profile settings to the server or local storage
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Profile Picture URL:
        <input
          type="text"
          name="picture"
          value={profile.picture}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Status:
        <input
          type="text"
          name="status"
          value={profile.status}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Bio:
        <input type="text" name="bio" value={profile.bio} onChange={handleInputChange} />
      </label>
      <label>
        Location:
        <input
          type="text"
          name="location"
          value={profile.location}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Website:
        <input
          type="text"
          name="website"
          value={profile.website}
          onChange={handleInputChange}
        />
      </label>
      <label>
        Social Media Links:
        <input
          type="text"
          name="social_media_links"
          value={profile.social_media_links}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}

/**
 * Component for providing feedback buttons (thumbs up/down).
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.messageId - The ID of the message to provide feedback for.
 * 
 * @returns {JSX.Element} The rendered feedback buttons.
 * 
 * @example
 * <FeedbackButtons messageId="12345" />
 */
function FeedbackButtons({ messageId }: { messageId: string }): JSX.Element {
  const handleFeedback = (feedback: string) => {
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  return (
    <div className="feedback-buttons">
      <button onClick={() => handleFeedback("thumbs-up")}>👍</button>
      <button onClick={() => handleFeedback("thumbs-down")}>👎</button>
    </div>
  );
}

/**
 * Component for providing a star rating system.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.messageId - The ID of the message to rate.
 * 
 * @returns {JSX.Element} The rendered star rating system.
 * 
 * @example
 * <RatingSystem messageId="12345" />
 */
function RatingSystem({ messageId }: { messageId: string }): JSX.Element {
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = (rate: number) => {
    setRating(rate);
    console.log(`Rating for message ${messageId}: ${rate}`);
  };

  return (
    <div className="rating-system">
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`star ${rating && rating >= star ? "selected" : ""}`}
          onClick={() => handleRating(star)}
        >
          ★
        </span>
      ))}
    </div>
  );
}

/**
 * Component for providing detailed feedback form.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.messageId - The ID of the message to provide detailed feedback for.
 * 
 * @returns {JSX.Element} The rendered detailed feedback form.
 * 
 * @example
 * <FeedbackForm messageId="12345" />
 */
function FeedbackForm({ messageId }: { messageId: string }): JSX.Element {
  const [feedback, setFeedback] = useState<string>("");

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(`Detailed feedback for message ${messageId}: ${feedback}`);
    setFeedback("");
  };

  return (
    <form className="feedback-form" onSubmit={handleSubmit}>
      <textarea
        value={feedback}
        onChange={(e) => setFeedback(e.target.value)}
        placeholder="Provide detailed feedback..."
      />
      <button type="submit">Submit</button>
    </form>
  );
}

/**
 * Component for displaying a survey link.
 * 
 * @returns {JSX.Element} The rendered survey link.
 * 
 * @example
 * <SurveyLink />
 */
function SurveyLink(): JSX.Element {
  const handleSurveyClick = () => {
    console.log("Survey link clicked");
  };

  return (
    <a className="survey-link" onClick={handleSurveyClick}>
      Take our survey
    </a>
  );
}

/**
 * Component for embedding a survey within the application.
 * 
 * @returns {JSX.Element} The rendered embedded survey.
 * 
 * @example
 * <EmbeddedSurvey />
 */
function EmbeddedSurvey(): JSX.Element {
  return (
    <div className="embedded-survey">
      <iframe
        src="https://example.com/survey"
        title="Embedded Survey"
        frameBorder="0"
      ></iframe>
    </div>
  );
}

/**
 * Component for message reactions.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.messageId - The ID of the message to react to.
 * 
 * @returns {JSX.Element} The rendered message reactions.
 * 
 * @example
 * <MessageReactions messageId="12345" />
 */
function MessageReactions({ messageId }: { messageId: string }): JSX.Element {
  const [reactions, setReactions] = useState<{ [key: string]: number }>({});

  const handleReaction = (reaction: string) => {
    setReactions((prevReactions) => ({
      ...prevReactions,
      [reaction]: (prevReactions[reaction] || 0) + 1,
    }));
    console.log(`Reaction for message ${messageId}: ${reaction}`);
  };

  return (
    <div className="message-reactions">
      {["👍", "❤️", "😂", "😮", "😢", "😡"].map((reaction) => (
        <button key={reaction} onClick={() => handleReaction(reaction)}>
          {reaction} {reactions[reaction] || 0}
        </button>
      ))}
    </div>
  );
}

/**
 * Component for message threads and replies.
 * 
 * @param {Object} props - Component properties.
 * @param {string} props.messageId - The ID of the message to reply to.
 * 
 * @returns {JSX.Element} The rendered message threads and replies.
 * 
 * @example
 * <MessageThreads messageId="12345" />
 */
function MessageThreads({ messageId }: { messageId: string }): JSX.Element {
  const [replies, setReplies] = useState<ChatMessage[]>([]);
  const [replyContent, setReplyContent] = useState<string>("");

  const handleReplySubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const newReply: ChatMessage = {
      id: nanoid(8),
      content: replyContent,
      user: "Anonymous",
      role: "user",
      attachments: [],
    };
    setReplies((prevReplies) => [...prevReplies, newReply]);
    setReplyContent("");
    console.log(`Reply for message ${messageId}: ${replyContent}`);
  };

  return (
    <div className="message-threads">
      {replies.map((reply) => (
        <div key={reply.id} className="reply">
          {reply.content}
        </div>
      ))}
      <form onSubmit={handleReplySubmit}>
        <input
          type="text"
          value={replyContent}
          onChange={(e) => setReplyContent(e.target.value)}
          placeholder="Write a reply..."
        />
        <button type="submit">Reply</button>
      </form>
    </div>
  );
}

// Render the application
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <ErrorBoundary>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to={`/${nanoid()}`} />} />
        <Route path="/:room" element={<App />} />
        <Route path="/profile-settings" element={<ProfileSettings />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  </ErrorBoundary>,
);
