import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessages } from "../../redux/thunks/messageThunks";
import { addMessageRealtime } from "../../redux/slices/messageSlice";
import { useSocket } from "../../hooks/useSocket";
import MessageBubble from "./MessageBubble";

const MessageList = () => {
  const { selectedChat } = useSelector((state) => state.chats);
  const { list } = useSelector((state) => state.messages);
  const dispatch = useDispatch();
  const socket = useSocket();
  const messagesEndRef = useRef(null);

  // Fetch messages
  useEffect(() => {
    dispatch(fetchMessages(selectedChat._id));
  }, [selectedChat]);

  // Receive new messages
  useEffect(() => {
    if (!socket) return;

    socket.on("message_received", (msg) => {
      dispatch(addMessageRealtime(msg));
    });

    return () => socket.off("message_received");
  }, [socket]);

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [list]);

  return (
    <div className="message-list">
      {list.map((msg) => (
        <MessageBubble key={msg._id} message={msg} />
      ))}

      <div ref={messagesEndRef} />
    </div>
  );
};

export default MessageList;
