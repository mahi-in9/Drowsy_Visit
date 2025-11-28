// src/components/chat/ChatList.jsx
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUserChats } from "../../redux/thunks/chatThunks";
import ChatListItem from "./ChatListItem";

const ChatList = () => {
  const dispatch = useDispatch();
  const { chats, loading } = useSelector((s) => s.chats);

  useEffect(() => {
    dispatch(getUserChats());
  }, [dispatch]);

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 font-semibold text-lg border-b">Chats</div>

      <div className="flex-1 overflow-y-auto">
        {loading && (
          <p className="text-center text-gray-400 py-4">Loading chats...</p>
        )}

        {chats.map((c) => (
          <ChatListItem key={c._id} chat={c} />
        ))}
      </div>
    </div>
  );
};

export default ChatList;
