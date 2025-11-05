import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";
import UserList from "./UserList"; // ✅ thêm nếu cần
import Profile from "./Profile";   // ✅ trang Profile thực
import Dashboard from "./Dashboard"; // ✅ nếu có giao diện tổng hợp

function App() {
  const [token, setToken] = useState(localStorage.getItem("token") || "");

  const handleLogout = () => {
    localStorage.removeItem("token");
    setToken("");
  };

  const handleLoginSuccess = (jwt) => {
    localStorage.setItem("token", jwt);
    setToken(jwt);
  };

  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupForm />} />
        <Route
          path="/login"
          element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
        />

        {/* ✅ Dashboard hiển thị menu */}
        <Route
          path="/dashboard"
          element={
            token ? (
              <Dashboard token={token} onLogout={handleLogout} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Trang Profile thực tế */}
        <Route
          path="/profile"
          element={
            token ? (
              <Profile />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Danh sách người dùng */}
        <Route
          path="/users"
          element={
            token ? (
              <UserList />
            ) : (
              <Navigate to="/login" />
            )
          }
        />

        {/* ✅ Mặc định chuyển về dashboard nếu đã login */}
        <Route
          path="/"
          element={
            token ? <Navigate to="/dashboard" /> : <Navigate to="/login" />
          }
        />

        {/* ✅ Nếu không khớp route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
}

<<<<<<< Updated upstream
export default App;
=======
export default App;
>>>>>>> Stashed changes
