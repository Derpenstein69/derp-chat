import React, { useState, useEffect } from "react";

export function RatingSystem({ messageId }: { messageId: string }): JSX.Element {
  const [rating, setRating] = useState<number | null>(null);
  const [ratingCounts, setRatingCounts] = useState<{ [key: number]: number }>({});

  useEffect(() => {
    const fetchRatingCounts = async () => {
      try {
        const response = await fetch(`/rating-counts?messageId=${messageId}`);
        if (!response.ok) {
          throw new Error("Failed to fetch rating counts");
        }
        const data = await response.json();
        setRatingCounts(data);
      } catch (error) {
        console.error("Error fetching rating counts", error);
      }
    };

    fetchRatingCounts();
  }, [messageId]);

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
      setRatingCounts((prevCounts) => ({
        ...prevCounts,
        [rate]: (prevCounts[rate] || 0) + 1,
      }));
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
          ★ {ratingCounts[star] || 0}
        </span>
      ))}
    </div>
  );
}
