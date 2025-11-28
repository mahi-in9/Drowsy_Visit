// server/socketHandler.js (or wherever you define socket handling)
export const socketHandler = (io) => {
  io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    // Setup: join personal room; userId might be sent as string or object - force toString
    socket.on("setup", (userId) => {
      if (!userId) return;
      const room = String(userId);
      socket.join(room);
      socket.emit("connected");
      console.log(`Socket ${socket.id} joined personal room ${room}`);
    });

    socket.on("join_chat", (chatId) => {
      if (!chatId) return;
      socket.join(String(chatId));
      console.log(`Socket ${socket.id} joined chat room ${chatId}`);
    });

    socket.on("new_message", (message) => {
      try {
        const chat = message.chat;
        if (!chat || !Array.isArray(chat.members)) return;

        // Normalize sender id string
        const senderId =
          message.sender && (message.sender._id || message.sender);
        const sIdStr = String(senderId);

        chat.members.forEach((user) => {
          const userIdStr = String(user._id ?? user);
          // don't send back to sender (we assume sender already has it)
          if (userIdStr === sIdStr) return;
          socket.to(userIdStr).emit("message_received", message);
        });
      } catch (e) {
        console.error("socket new_message error:", e);
      }
    });

    // remaining handlers (deliver/read/react/edit/delete/typing) - keep them but ensure string ids
    socket.on("message_delivered", ({ chatId, userId }) => {
      if (!chatId) return;
      io.to(String(chatId)).emit("message_delivered_update", {
        chatId: String(chatId),
        userId: String(userId),
      });
    });

    socket.on("message_read", ({ chatId, userId }) => {
      if (!chatId) return;
      io.to(String(chatId)).emit("message_read_update", {
        chatId: String(chatId),
        userId: String(userId),
      });
    });

    socket.on("react_message", ({ messageId, chatId, emoji, userId }) => {
      if (!chatId) return;
      io.to(String(chatId)).emit("reaction_update", {
        messageId,
        emoji,
        userId: String(userId),
      });
    });

    socket.on("edit_message", ({ messageId, newContent, chatId }) => {
      if (!chatId) return;
      io.to(String(chatId)).emit("message_edited", {
        messageId,
        newContent,
      });
    });

    socket.on("delete_message", ({ messageId, forEveryone, chatId }) => {
      if (!chatId) return;
      io.to(String(chatId)).emit("message_deleted", { messageId, forEveryone });
    });

    socket.on("typing", (chatId) => {
      if (!chatId) return;
      socket.to(String(chatId)).emit("typing");
    });

    socket.on("stop_typing", (chatId) => {
      if (!chatId) return;
      socket.to(String(chatId)).emit("stop_typing");
    });

    socket.on("disconnect", () => {
      console.log("User disconnected:", socket.id);
    });
  });
};
