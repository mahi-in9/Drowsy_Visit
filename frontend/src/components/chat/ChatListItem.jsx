// src/components/chat/ChatListItem.jsx
import { useDispatch, useSelector } from "react-redux";
import { setActiveChat } from "../../redux/slices/chatSlice";

const ChatListItem = ({ chat }) => {
  const dispatch = useDispatch();
  const activeChat = useSelector((s) => s.chats.activeChat);
  const isActive = activeChat?._id === chat._id;

  const otherMembers = chat.members.filter(
    (m) => m._id !== localStorage.getItem("userId")
  );

  const name = chat.isGroup ? chat.name : otherMembers[0]?.name;

  return (
    <div
      onClick={() => dispatch(setActiveChat(chat))}
      className={`p-3 flex items-center gap-3 cursor-pointer border-b 
        ${isActive ? "bg-blue-100" : "hover:bg-gray-100"}`}
    >
      <div className="h-10 w-10 rounded-full bg-gray-300 flex items-center justify-center text-xl">
        {name?.[0]}
      </div>

      <div className="flex-1">
        <p className="font-medium text-gray-800">{name}</p>
        {chat.lastMessage && (
          <p className="text-gray-500 text-sm truncate">
            {chat.lastMessage.content || "Attachment"}
          </p>
        )}
      </div>
    </div>
  );
};

export default ChatListItem;
