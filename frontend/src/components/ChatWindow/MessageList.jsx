// src/components/ChatWindow/MessageList.jsx
import { useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchMessagesThunk } from "../../redux/thunks/messageThunks";
import { getSocket } from "../../socket/socket";
import { addIncomingMessage } from "../../redux/slices/messageSlice";
import MessageBubble from "./MessageBubble";

const MessageList = ({ chatId }) => {
  const dispatch = useDispatch();
  const messagesMap = useSelector((s) => s.messages.data || {});
  const messages = chatId ? messagesMap[chatId] || [] : [];
  const socket = getSocket();
  const endRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    dispatch(fetchMessagesThunk({ chatId, page: 1, limit: 50 }));
  }, [chatId, dispatch]);

  useEffect(() => {
    if (!socket || !chatId) return;

    const handler = (msg) => {
      // ensure message belongs to current chat
      if (msg?.chat?._id === chatId || msg?.chat === chatId) {
        dispatch(addIncomingMessage(msg));
      }
    };

    socket.on("message_received", handler);
    return () => socket.off("message_received", handler);
  }, [socket, chatId, dispatch]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages.length]);

  return (
    <div className="message-list">
      {messages.map((m) => (
        <MessageBubble key={m._id} msg={m} />
      ))}
      <div ref={endRef} />
    </div>
  );
};

export default MessageList;
