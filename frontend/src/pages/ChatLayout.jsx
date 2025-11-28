// src/pages/ChatLayout.jsx
import ChatList from "../components/chat/ChatList";
import ChatWindow from "../components/ChatWindow/ChatWindow";
import { useSelector } from "react-redux";

const ChatLayout = () => {
  const activeChat = useSelector((s) => s.chats.activeChat);

  return (
    <div className="h-screen w-full flex bg-gray-100 overflow-hidden">
      {/* LEFT PANE (Chat List) */}
      <div className="w-full md:w-1/3 lg:w-1/4 border-r bg-white">
        <ChatList />
      </div>

      {/* RIGHT PANE (Chat Window) */}
      <div className="hidden md:flex flex-col w-2/3 lg:w-3/4">
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            Select a chat to start messaging
          </div>
        )}
      </div>

      {/* MOBILE — Chat Window replaces chat list */}
      <div className="md:hidden absolute inset-0 bg-white">
        {activeChat ? (
          <ChatWindow />
        ) : (
          <div className="h-full flex items-center justify-center text-gray-500 text-lg">
            Select a chat to start messaging
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatLayout;
