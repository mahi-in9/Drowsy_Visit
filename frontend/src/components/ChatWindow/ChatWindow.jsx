// src/components/ChatWindow/ChatWindow.jsx
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { fetchMessagesThunk } from "../../redux/thunks/messageThunks";
import { getSocket } from "../../socket/socket";

const ChatWindow = () => {
  const dispatch = useDispatch();
  const activeChat = useSelector((state) => state.chats.activeChat);
  const messagesMap = useSelector((state) => state.messages.data || {});
  const activeMessages = activeChat ? messagesMap[activeChat._id] || [] : [];
  const msgsRef = useRef(null);

  // fetch messages when activeChat changes
  useEffect(() => {
    if (!activeChat?._id) return;
    dispatch(
      fetchMessagesThunk({ chatId: activeChat._id, page: 1, limit: 50 })
    );
  }, [activeChat?._id, dispatch]);

  // auto scroll when messages change
  useEffect(() => {
    msgsRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [activeMessages.length]);

  if (!activeChat) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500 dark:text-gray-400">
        Select a chat to start messaging
      </div>
    );
  }

  const title = activeChat.isGroup
    ? activeChat.name || "Group"
    : (activeChat.members || []).find(
        (m) => m._id !== localStorage.getItem("userId")
      )?.name || "Chat";

  return (
    <div className="relative flex flex-col h-full bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <div className="p-4 border-b bg-white dark:bg-gray-800 flex items-center gap-3">
        <img
          src={activeChat.avatar || "/default-avatar.png"}
          alt="avatar"
          className="w-10 h-10 rounded-full object-cover"
        />
        <p className="font-semibold text-gray-700 dark:text-gray-200">
          {title}
        </p>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {activeMessages.length === 0 ? (
          <div className="text-center text-sm text-gray-500 py-6">
            No messages yet — say hi 👋
          </div>
        ) : (
          activeMessages.map((msg) => <MessageBubble key={msg._id} msg={msg} />)
        )}

        <div ref={msgsRef} />
      </div>

      {/* Input */}
      <MessageInput chatId={activeChat._id} />
    </div>
  );
};

export default ChatWindow;
