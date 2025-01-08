import React, { useState, useEffect } from "react";
import { nanoid } from "nanoid";
import { ChatMessage } from "../shared";

export function FeedbackButtons({ messageId }: { messageId: string }): JSX.Element {
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

export function RatingSystem({ messageId }: { messageId: string }): JSX.Element {
  const [rating, setRating] = useState<number | null>(null);

  const handleRating = async (rate: number) => {
    setRating(rate);
    console.log(`Rating for message ${messageId}: ${rate}`);

    try {
      const response = await fetch("/rate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageId,
          rating: rate,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to submit rating");
      }

      console.log("Rating submitted successfully");
    } catch (error) {
      console.error("Error submitting rating", error);
      alert("An error occurred while submitting the rating. Please try again.");
    }
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

export function FeedbackForm({ messageId }: { messageId: string }): JSX.Element {
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

export function SurveyLink(): JSX.Element {
  const handleSurveyClick = () => {
    console.log("Survey link clicked");
  };

  return (
    <a className="survey-link" onClick={handleSurveyClick}>
      Take our survey
    </a>
  );
}

export function EmbeddedSurvey(): JSX.Element {
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

export function MessageReactions({ messageId }: { messageId: string }): JSX.Element {
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

export function MessageThreads({ messageId }: { messageId: string }): JSX.Element {
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

export function AnalyticsDisplay(): JSX.Element {
  const [analyticsData, setAnalyticsData] = useState<{
    messageCount: number;
    userActivity: { [key: string]: number };
    messageFrequency: number;
    userPreferences: { [key: string]: any };
    previousInteractions: { [key: string]: any };
    activeSessions: number;
    sessionDuration: number;
  }>({
    messageCount: 0,
    userActivity: {},
    messageFrequency: 0,
    userPreferences: {},
    previousInteractions: {},
    activeSessions: 0,
    sessionDuration: 0,
  });

  useEffect(() => {
    const handleAnalyticsUpdate = (evt: MessageEvent) => {
      const data = JSON.parse(evt.data);
      setAnalyticsData(data);
    };

    const analyticsSocket = new WebSocket("wss://your-analytics-endpoint");
    analyticsSocket.addEventListener("message", handleAnalyticsUpdate);

    return () => {
      analyticsSocket.removeEventListener("message", handleAnalyticsUpdate);
      analyticsSocket.close();
    };
  }, []);

  return (
    <div className="analytics-display">
      <h3>Real-Time Analytics</h3>
      <p>Message Count: {analyticsData.messageCount}</p>
      <p>Message Frequency: {analyticsData.messageFrequency} messages/minute</p>
      <h4>User Activity</h4>
      <ul>
        {Object.entries(analyticsData.userActivity).map(([user, activity]) => (
          <li key={user}>
            {user}: {activity} messages
          </li>
        ))}
      </ul>
      <h4>User Preferences</h4>
      <ul>
        {Object.entries(analyticsData.userPreferences).map(([user, preferences]) => (
          <li key={user}>
            {user}: {JSON.stringify(preferences)}
          </li>
        ))}
      </ul>
      <h4>Previous Interactions</h4>
      <ul>
        {Object.entries(analyticsData.previousInteractions).map(([user, interactions]) => (
          <li key={user}>
            {user}: {JSON.stringify(interactions)}
          </li>
        ))}
      </ul>
      <h4>Active Sessions</h4>
      <p>Active Sessions: {analyticsData.activeSessions}</p>
      <h4>Session Duration</h4>
      <p>Session Duration: {analyticsData.sessionDuration} minutes</p>
    </div>
  );
}

export function CloudflareSecretsSettings(): JSX.Element {
  const [secrets, setSecrets] = useState<{
    GOOGLE_CLIENT_ID: string;
    GOOGLE_CLIENT_SECRET: string;
    GITHUB_CLIENT_ID: string;
    GITHUB_CLIENT_SECRET: string;
    APPLE_CLIENT_ID: string;
    APPLE_CLIENT_SECRET: string;
    DISCORD_CLIENT_ID: string;
    DISCORD_CLIENT_SECRET: string;
    JWT_SECRET: string;
    HMAC_SECRET_KEY: string;
    R2_ACCESS_KEY_ID: string;
    R2_SECRET_ACCESS_KEY: string;
    R2_BUCKET_NAME: string;
    R2_REGION: string;
    IMAGE_CLASSIFICATION_WORKER: string;
    CLASSIFICATION_METADATA: string;
    VECTORIZE_API_KEY: string;
    VECTORIZE_ENDPOINT: string;
  }>({
    GOOGLE_CLIENT_ID: "",
    GOOGLE_CLIENT_SECRET: "",
    GITHUB_CLIENT_ID: "",
    GITHUB_CLIENT_SECRET: "",
    APPLE_CLIENT_ID: "",
    APPLE_CLIENT_SECRET: "",
    DISCORD_CLIENT_ID: "",
    DISCORD_CLIENT_SECRET: "",
    JWT_SECRET: "",
    HMAC_SECRET_KEY: "",
    R2_ACCESS_KEY_ID: "",
    R2_SECRET_ACCESS_KEY: "",
    R2_BUCKET_NAME: "",
    R2_REGION: "",
    IMAGE_CLASSIFICATION_WORKER: "",
    CLASSIFICATION_METADATA: "",
    VECTORIZE_API_KEY: "",
    VECTORIZE_ENDPOINT: "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setSecrets((prevSecrets) => ({
      ...prevSecrets,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch("/save-secrets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(secrets),
      });

      if (!response.ok) {
        throw new Error("Failed to save secrets");
      }

      alert("Secrets saved successfully");
    } catch (error) {
      console.error("Error saving secrets", error);
      alert("An error occurred while saving the secrets. Please try again.");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <h3>Cloudflare Secrets Settings</h3>
      <label>
        GOOGLE_CLIENT_ID:
        <input
          type="password"
          name="GOOGLE_CLIENT_ID"
          value={secrets.GOOGLE_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GOOGLE_CLIENT_SECRET:
        <input
          type="password"
          name="GOOGLE_CLIENT_SECRET"
          value={secrets.GOOGLE_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GITHUB_CLIENT_ID:
        <input
          type="password"
          name="GITHUB_CLIENT_ID"
          value={secrets.GITHUB_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        GITHUB_CLIENT_SECRET:
        <input
          type="password"
          name="GITHUB_CLIENT_SECRET"
          value={secrets.GITHUB_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        APPLE_CLIENT_ID:
        <input
          type="password"
          name="APPLE_CLIENT_ID"
          value={secrets.APPLE_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        APPLE_CLIENT_SECRET:
        <input
          type="password"
          name="APPLE_CLIENT_SECRET"
          value={secrets.APPLE_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        DISCORD_CLIENT_ID:
        <input
          type="password"
          name="DISCORD_CLIENT_ID"
          value={secrets.DISCORD_CLIENT_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        DISCORD_CLIENT_SECRET:
        <input
          type="password"
          name="DISCORD_CLIENT_SECRET"
          value={secrets.DISCORD_CLIENT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        JWT_SECRET:
        <input
          type="password"
          name="JWT_SECRET"
          value={secrets.JWT_SECRET}
          onChange={handleInputChange}
        />
      </label>
      <label>
        HMAC_SECRET_KEY:
        <input
          type="password"
          name="HMAC_SECRET_KEY"
          value={secrets.HMAC_SECRET_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_ACCESS_KEY_ID:
        <input
          type="password"
          name="R2_ACCESS_KEY_ID"
          value={secrets.R2_ACCESS_KEY_ID}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_SECRET_ACCESS_KEY:
        <input
          type="password"
          name="R2_SECRET_ACCESS_KEY"
          value={secrets.R2_SECRET_ACCESS_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_BUCKET_NAME:
        <input
          type="text"
          name="R2_BUCKET_NAME"
          value={secrets.R2_BUCKET_NAME}
          onChange={handleInputChange}
        />
      </label>
      <label>
        R2_REGION:
        <input
          type="text"
          name="R2_REGION"
          value={secrets.R2_REGION}
          onChange={handleInputChange}
        />
      </label>
      <label>
        IMAGE_CLASSIFICATION_WORKER:
        <input
          type="text"
          name="IMAGE_CLASSIFICATION_WORKER"
          value={secrets.IMAGE_CLASSIFICATION_WORKER}
          onChange={handleInputChange}
        />
      </label>
      <label>
        CLASSIFICATION_METADATA:
        <input
          type="text"
          name="CLASSIFICATION_METADATA"
          value={secrets.CLASSIFICATION_METADATA}
          onChange={handleInputChange}
        />
      </label>
      <label>
        VECTORIZE_API_KEY:
        <input
          type="password"
          name="VECTORIZE_API_KEY"
          value={secrets.VECTORIZE_API_KEY}
          onChange={handleInputChange}
        />
      </label>
      <label>
        VECTORIZE_ENDPOINT:
        <input
          type="text"
          name="VECTORIZE_ENDPOINT"
          value={secrets.VECTORIZE_ENDPOINT}
          onChange={handleInputChange}
        />
      </label>
      <button type="submit">Save</button>
    </form>
  );
}
