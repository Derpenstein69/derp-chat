import React, { useState } from "react";

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
