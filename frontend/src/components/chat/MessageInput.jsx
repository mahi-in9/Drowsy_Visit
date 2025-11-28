// src/components/chat/MessageInput.jsx
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { sendMessageThunk } from "../../redux/thunks/messageThunks";

const MessageInput = () => {
  const dispatch = useDispatch();
  const chat = useSelector((s) => s.chats.activeChat);

  const [text, setText] = useState("");

  const send = () => {
    if (!text.trim()) return;

    dispatch(
      sendMessageThunk({
        chatId: chat._id,
        content: text,
      })
    );

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
      />

      <button
        onClick={send}
        className="bg-blue-600 text-white px-4 py-2 rounded-full"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
