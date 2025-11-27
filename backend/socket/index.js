export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    /* ==============================
       JOIN PERSONAL USER SESSION
       For status updates (delivered / read)
    =============================== */
    socket.on("setup", (userId) => {
      socket.join(userId);
      socket.emit("connected");
    });

    /* ==============================
       JOIN CHAT ROOM
       For DM or Group Chats
    =============================== */
    socket.on("join_chat", (chatId) => {
      socket.join(chatId);
      console.log(`User joined chat: ${chatId}`);
    });

    /* ==============================
       SEND MESSAGE
    =============================== */
    socket.on("new_message", (message) => {
      const chat = message.chat;

      if (!chat.members) return;

      chat.members.forEach((user) => {
        if (user._id === message.sender._id) return;

        // Send message to each member
        socket.to(user._id).emit("message_received", message);
      });
    });

    /* ==============================
       MESSAGE DELIVERED (when socket joins)
    =============================== */
    socket.on("message_delivered", ({ chatId, userId }) => {
      io.to(chatId).emit("message_delivered_update", { chatId, userId });
    });

    /* ==============================
       MESSAGE READ (when chat opened)
    =============================== */
    socket.on("message_read", ({ chatId, userId }) => {
      io.to(chatId).emit("message_read_update", { chatId, userId });
    });

    /* ==============================
       MESSAGE REACTION
    =============================== */
    socket.on("react_message", ({ messageId, chatId, emoji, userId }) => {
      io.to(chatId).emit("reaction_update", {
        messageId,
        emoji,
        userId,
      });
    });

    /* ==============================
       EDIT MESSAGE
    =============================== */
    socket.on("edit_message", ({ messageId, newContent, chatId }) => {
      io.to(chatId).emit("message_edited", {
        messageId,
        newContent,
      });
    });

    /* ==============================
       DELETE MESSAGE
    =============================== */
    socket.on("delete_message", ({ messageId, forEveryone, chatId }) => {
      io.to(chatId).emit("message_deleted", {
        messageId,
        forEveryone,
      });
    });

    /* ==============================
       TYPING INDICATOR
    =============================== */
    socket.on("typing", (chatId) => socket.to(chatId).emit("typing"));

    socket.on("stop_typing", (chatId) => socket.to(chatId).emit("stop_typing"));

    /* ==============================
       DISCONNECT
    =============================== */
    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
