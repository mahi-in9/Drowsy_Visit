// src/components/ChatWindow/MessageBubble.jsx
import { useSelector } from "react-redux";

const MessageBubble = ({ msg }) => {
  const user = useSelector((state) => state.auth.user);

  const mine = msg.sender === user._id;

  return (
    <div className={`flex ${mine ? "justify-end" : "justify-start"}`}>
      <div
        className={`max-w-[75%] px-3 py-2 rounded-lg shadow-md text-sm 
        ${
          mine
            ? "bg-green-500 text-white rounded-br-none"
            : "bg-white dark:bg-gray-800 dark:text-gray-200 rounded-bl-none"
        }`}
      >
        {msg.content}

        {msg.edited && (
          <span className="block text-[10px] opacity-60">edited</span>
        )}

        {msg.reactions?.length > 0 && (
          <div className="mt-1 text-xs opacity-80">
            {msg.reactions[0].emoji}
          </div>
        )}
      </div>
    </div>
  );
};

export default MessageBubble;
