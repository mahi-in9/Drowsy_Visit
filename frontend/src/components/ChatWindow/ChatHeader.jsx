import { useSelector } from "react-redux";

const ChatHeader = () => {
  const { selectedChat } = useSelector((state) => state.chats);

  const otherMembers = selectedChat?.members?.filter(
    (m) => m._id !== JSON.parse(localStorage.getItem("user"))._id
  );

  return (
    <div className="chat-header">
      <h3>{selectedChat.isGroup ? selectedChat.name : otherMembers[0].name}</h3>
    </div>
  );
};

export default ChatHeader;
