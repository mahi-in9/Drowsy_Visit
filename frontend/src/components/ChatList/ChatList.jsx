// src/components/ChatList/ChatList.jsx
import { useSelector, useDispatch } from "react-redux";
import { setActiveChat } from "../../redux/slices/chatSlice";

const ChatList = () => {
  const dispatch = useDispatch();
  const { list } = useSelector((state) => state.chats);

  return (
    <div className="h-full bg-white dark:bg-gray-800 border-r border-gray-300 dark:border-gray-700 overflow-y-auto">
      {/* Header */}
      <div className="p-4 font-bold text-lg border-b bg-gray-50 dark:bg-gray-700">
        Chats
      </div>

      {/* Chat List */}
      {list.map((chat) => (
        <div
          key={chat._id}
          onClick={() => dispatch(setActiveChat(chat))}
          className="p-4 flex items-center gap-3 border-b cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition"
        >
          <img
            src={chat.avatar || "/default-avatar.png"}
            className="w-12 h-12 rounded-full object-cover"
          />

          <div className="flex-1">
            <p className="font-semibold text-gray-800 dark:text-gray-200">
              {chat.name}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 truncate">
              {chat.lastMessage?.content || "Start chatting"}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
