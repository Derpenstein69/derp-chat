import React, { useState } from "react";

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
