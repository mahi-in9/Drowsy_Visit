// src/components/chat/TypingIndicator.jsx
const TypingIndicator = () => {
  const isTyping = false; // replace with socket state later

  if (!isTyping) return null;

  return <div className="text-gray-500 text-sm italic px-3">Typing...</div>;
};

export default TypingIndicator;
