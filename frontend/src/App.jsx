<<<<<<< Updated upstream
import React from 'react';
import UserList from "./components/UserList";




const App = () => {
  return (
    <div>
      <h1>Ứng Dụng Quản Lý Người Dùng</h1>
      <UserList />
    </div>
=======
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";
import UserList from "./components/UserList";
import AdminUserList from "./pages/AdminUserList";
import ForgotPassword from "./components/ForgotPassword";
import ResetPassword from "./components/ResetPassword";
import React, { useState, useEffect } from "react";


function App() {
  const [token, setToken] = useState(localStorage.getItem("jwtToken") || "");

useEffect(() => {
  localStorage.removeItem("jwtToken"); // Xóa token khi app khởi động
  setToken(""); // Cập nhật lại state
}, []);

  const handleLoginSuccess = (jwt) => {
    localStorage.setItem("jwtToken", jwt);
    setToken(jwt);
  };

  const handleLogout = () => {
    localStorage.removeItem("jwtToken");
    setToken("");
  };

  return (
    <Router>
      <Routes>
        {/* ✅ Trang đầu tiên luôn chuyển về login */}
        <Route path="/" element={<Navigate to="/login" replace />} />

        {/* 🟢 Trang cho người CHƯA đăng nhập */}
        {!token ? (
          <>
            <Route
              path="/login"
              element={<LoginForm onLoginSuccess={handleLoginSuccess} />}
            />
            <Route path="/signup" element={<SignupForm />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:token" element={<ResetPassword />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            {/* 🟢 Trang cho người ĐÃ đăng nhập */}
            <Route
              path="/dashboard"
              element={<Dashboard onLogout={handleLogout} />}
            />
            <Route path="/profile" element={<Profile />} />
            <Route path="/users" element={<UserList />} />
            <Route path="/admin/users" element={<AdminUserList />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
    </Router>
>>>>>>> Stashed changes
  );
};

export default App;
