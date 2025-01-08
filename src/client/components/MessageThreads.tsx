import React, { useState } from "react";
import { nanoid } from "nanoid";
import { ChatMessage } from "../shared";

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
