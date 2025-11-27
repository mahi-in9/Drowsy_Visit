// src/components/ChatWindow/MessageInput.jsx
import { useState } from "react";
import { useDispatch } from "react-redux";
import { sendMessageThunk } from "../../redux/thunks/messageThunks";

const MessageInput = ({ chatId }) => {
  const dispatch = useDispatch();
  const [content, setContent] = useState("");

  const sendHandler = () => {
    if (!content.trim()) return;

    dispatch(sendMessageThunk({ chatId, content }));
    setContent("");
  };

  return (
    <div className="p-3 border-t bg-white dark:bg-gray-800 flex items-center gap-2">
      <input
        type="text"
        placeholder="Message..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
        className="flex-1 px-4 py-2 rounded-full bg-gray-100 dark:bg-gray-700 text-sm outline-none"
      />

      <button
        onClick={sendHandler}
        className="px-4 py-2 bg-green-500 text-white rounded-full active:scale-95 transition"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;
