// src/components/ChatWindow/ChatWindow.jsx
import { useSelector } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

const ChatWindow = () => {
  const activeChat = useSelector((state) => state.chats.activeChat);
  const messages = useSelector((state) => state.messages.list);

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  return (
    <div className="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-800 flex items-center gap-3">
        <img
          src={activeChat.avatar || "/default-avatar.png"}
          className="w-10 h-10 rounded-full"
        />
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          {activeChat.name}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-2">
        {messages.map((msg) => (
          <MessageBubble key={msg._id} msg={msg} />
        ))}
      </div>

      {/* Input */}
      <MessageInput chatId={activeChat._id} />
    </div>
  );
};

export default ChatWindow;
