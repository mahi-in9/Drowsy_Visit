// src/components/ChatWindow/MessageBubble.jsx
import React from "react";
import { useSelector } from "react-redux";

const MessageBubble = ({ msg }) => {
  // Defensive: don't crash if msg is falsy
  if (!msg) return null;

  // Normalize sender id: msg.sender may be an object or a string
  const senderId =
    msg.sender &&
    (typeof msg.sender === "object" ? msg.sender._id : msg.sender);

  const user = useSelector((state) => state.auth.user) || {};
  const myId = user._id || localStorage.getItem("userId");

  const mine = senderId === myId;

  // Normalize content and edited flag
  const content = msg.content ?? "";
  const edited = msg.isEdited || msg.edited || false;
  const reactions = Array.isArray(msg.reactions) ? msg.reactions : [];

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"} `}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-lg shadow-md text-sm break-words
          ${
            mine
              ? "bg-green-500 text-white rounded-br-none"
              : "bg-white dark:bg-gray-800 dark:text-gray-200 rounded-bl-none"
          }`}
        role="listitem"
        aria-label={mine ? "your message" : "message"}
      >
        <div className="whitespace-pre-wrap">{content}</div>

        {edited && (
          <span className="block text-[10px] opacity-60 mt-1">edited</span>
        )}

        {reactions.length > 0 && (
          <div className="mt-1 text-xs opacity-80 flex gap-1 items-center">
            {/* show up to first 3 reactions compactly */}
            {reactions.slice(0, 3).map((r, i) => (
              <span key={i} className="px-1 rounded">
                {r.emoji}
              </span>
            ))}
            {reactions.length > 3 && (
              <span className="text-[10px] opacity-60">
                +{reactions.length - 3}
              </span>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
