import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import chatReducer from "./slices/chatSlice";
import messageReducer from "./slices/messageSlice";
// import socketReducer from "./slices/socketSlice";
import userReducer from "./slices/userSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: userReducer,
    chats: chatReducer,
    messages: messageReducer,
    // socket: socketReducer,
  },
});
