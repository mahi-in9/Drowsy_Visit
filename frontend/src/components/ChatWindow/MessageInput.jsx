// src/components/ChatWindow/MessageInput.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessageThunk } from "../../redux/thunks/messageThunks";
import { getSocket } from "../../socket/socket";

const MessageInput = ({ chatId }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState("");

  const send = async () => {
    const trimmed = text.trim();
    if (!trimmed || !chatId) return;

    // optimistic UI: create a temporary message object
    const tempMsg = {
      _id: `temp-${Date.now()}`,
      chat: { _id: chatId },
      sender: localStorage.getItem("userId"),
      content: trimmed,
      isEdited: false,
      createdAt: new Date().toISOString(),
      reactions: [],
    };

    // emit via socket immediately (if you want realtime)
    const socket = getSocket();
    if (socket && socket.connected) {
      socket.emit("new_message", tempMsg);
    }

    // dispatch actual API send
    try {
      await dispatch(sendMessageThunk({ chatId, content: trimmed })).unwrap();
    } catch (err) {
      // handle send error (toast/log). For now console.warn
      console.warn("send message failed:", err);
    }

    setText("");
  };

  return (
    <div className="p-3 bg-white flex items-center gap-2 border-t">
      <input
        placeholder="Type a message"
        className="flex-1 bg-gray-100 rounded-full px-4 py-2 outline-none"
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && send()}
        aria-label="Message input"
      />

      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 py-2 rounded-full"
        aria-label="Send message"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
