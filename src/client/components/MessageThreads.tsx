import React, { useState } from "react";
import { nanoid } from "nanoid";
import { ChatMessage } from "../../types/ChatMessage";

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

  const renderReplies = (replies: ChatMessage[]) => {
    return replies.map((reply) => (
      <div key={reply.id} className="reply">
        {reply.content}
        {reply.replies && renderReplies(reply.replies)}
      </div>
    ));
  };

  return (
    <div className="message-threads">
      {renderReplies(replies)}
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
