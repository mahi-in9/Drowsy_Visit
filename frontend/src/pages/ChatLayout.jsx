// src/pages/ChatLayout.jsx
import { useSelector } from "react-redux";
import ChatList from "../components/ChatList/ChatList";
import ChatWindow from "../components/ChatWindow/ChatWindow";

const ChatLayout = () => {
  const activeChat = useSelector((state) => state.chats.activeChat);
  const isMobile = window.innerWidth < 768;

  return (
    <div className="w-full h-screen overflow-hidden bg-gray-100 dark:bg-gray-900">
      {/* DESKTOP LAYOUT */}
      <div className="hidden md:grid md:grid-cols-[350px_1fr] h-full">
        <ChatList />
        <ChatWindow />
      </div>

      {/* MOBILE LAYOUT */}
      <div className="md:hidden h-full">
        {!activeChat ? <ChatList /> : <ChatWindow />}
      </div>
    </div>
  );
};

export default ChatLayout;
