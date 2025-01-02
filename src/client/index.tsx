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

import { names, type ChatMessage, type Message } from "../shared";

const client = createClient({
  clientID: "your-client-id",
  issuer: "https://auth.myserver.com",
});

function App() {
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
  const { room } = useParams();
  const location = useLocation();

  useEffect(() => {
    const handleAuthCallback = async () => {
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
    };

    handleAuthCallback();
  }, [location.search]);

  const socket = usePartySocket({
    party: "chat",
    room,
    onMessage: (evt) => {
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
    },
  });

  return (
    <div className="chat container">
      {messages.map((message) => (
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

function ProfileSettings() {
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

function FeedbackButtons({ messageId }: { messageId: string }) {
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

function RatingSystem({ messageId }: { messageId: string }) {
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

function FeedbackForm({ messageId }: { messageId: string }) {
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

function SurveyLink() {
  const handleSurveyClick = () => {
    console.log("Survey link clicked");
  };

  return (
    <a className="survey-link" onClick={handleSurveyClick}>
      Take our survey
    </a>
  );
}

function EmbeddedSurvey() {
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

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
createRoot(document.getElementById("root")!).render(
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Navigate to={`/${nanoid()}`} />} />
      <Route path="/:room" element={<App />} />
      <Route path="/profile-settings" element={<ProfileSettings />} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  </BrowserRouter>,
);
