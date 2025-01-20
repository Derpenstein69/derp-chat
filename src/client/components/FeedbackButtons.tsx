import React, { useState } from "react";

export function FeedbackButtons({ messageId }: { messageId: string }): JSX.Element {
  const [feedbackCounts, setFeedbackCounts] = useState<{ [key: string]: number }>({
    "thumbs-up": 0,
    "thumbs-down": 0,
    "laugh": 0,
    "sad": 0,
    "angry": 0,
  });

  const handleFeedback = (feedback: string) => {
    setFeedbackCounts((prevCounts) => ({
      ...prevCounts,
      [feedback]: (prevCounts[feedback] || 0) + 1,
    }));
    console.log(`Feedback for message ${messageId}: ${feedback}`);
  };

  return (
    <div className="feedback-buttons">
      <button onClick={() => handleFeedback("thumbs-up")}>👍 {feedbackCounts["thumbs-up"]}</button>
      <button onClick={() => handleFeedback("thumbs-down")}>👎 {feedbackCounts["thumbs-down"]}</button>
      <button onClick={() => handleFeedback("laugh")}>😂 {feedbackCounts["laugh"]}</button>
      <button onClick={() => handleFeedback("sad")}>😢 {feedbackCounts["sad"]}</button>
      <button onClick={() => handleFeedback("angry")}>😡 {feedbackCounts["angry"]}</button>
    </div>
  );
}
