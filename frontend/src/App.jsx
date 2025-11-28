import { useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

import { connectSocket } from "./socket/socket"; // ❗ remove disconnect here
import ChatLayout from "./pages/ChatLayout";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ExploreUsers from "./pages/ExploreUsers";

/* -------------------------------
   PROTECTED ROUTE
-------------------------------- */
const ProtectedRoute = ({ children }) => {
  const user = useSelector((state) => state.auth.user);
  return user ? children : <Navigate to="/login" replace />;
};

/* -------------------------------
   MAIN APP COMPONENT
-------------------------------- */
const App = () => {
  const user = useSelector((state) => state.auth.user);

  /* SOCKET CONNECTION */
  useEffect(() => {
    if (user?._id) {
      connectSocket(user._id);
    }
    // ❗ NO cleanup here; StrictMode causes double-fire and disconnects socket
  }, [user]);

  return (
    <Routes>
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <ChatLayout />
          </ProtectedRoute>
        }
      />

      <Route
        path="/explore"
        element={
          <ProtectedRoute>
            <ExploreUsers />
          </ProtectedRoute>
        }
      />

      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
    </Routes>
  );
};

export default App;
