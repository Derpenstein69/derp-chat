import React, { useState } from "react";

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
      {["👍", "❤️", "😂", "😮", "😢", "😡", "👏", "🎉", "🔥", "💯"].map((reaction) => (
        <button key={reaction} onClick={() => handleReaction(reaction)}>
          {reaction} {reactions[reaction] || 0}
        </button>
      ))}
    </div>
  );
}
