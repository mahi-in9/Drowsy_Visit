import { useDispatch } from "react-redux";
import { setSelectedChat } from "../../redux/slices/chatSlice";

const ChatListItem = ({ chat }) => {
  const dispatch = useDispatch();

  const openChat = () => {
    dispatch(setSelectedChat(chat));
  };

  const otherMembers = chat.members?.filter(
    (m) => m._id !== JSON.parse(localStorage.getItem("user"))._id
  );

  return (
    <div className="chat-list-item" onClick={openChat}>
      <div className="chat-avatar">{otherMembers[0]?.name[0]}</div>

      <div className="chat-info">
        <h4>{chat.isGroup ? chat.name : otherMembers[0]?.name}</h4>
        <p>{chat.lastMessage?.content || "Start chatting…"}</p>
      </div>
    </div>
  );
};

export default ChatListItem;
