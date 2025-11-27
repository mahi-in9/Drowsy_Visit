import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/userSlice";
import chatReducer from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice";
// import socketReducer from "./slices/socketSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    chats: chatReducer,
    messages: messageReducer,
    // socket: socketReducer,
  },
});
