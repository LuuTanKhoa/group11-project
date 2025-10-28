// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from "react-router-dom";
import SignupForm from "./components/SignupForm";
import LoginForm from "./components/LoginForm";
import UserList from "./components/UserList";
import "bootstrap/dist/css/bootstrap.min.css";

function App() {
  return (
    <Router>
      <div className="container text-center mt-4">
        <h1 className="mb-4">Ứng dụng Authentication</h1>

        <nav className="mb-4">
          <Link to="/signup" className="btn btn-outline-primary mx-2">
            Đăng ký
          </Link>
          <Link to="/login" className="btn btn-outline-success mx-2">
            Đăng nhập
          </Link>
          <Link to="/users" className="btn btn-outline-dark mx-2">
            Danh sách người dùng
          </Link>
        </nav>

        <Routes>
          <Route path="/" element={<Navigate to="/signup" />} />
          <Route path="/signup" element={<SignupForm />} />
          <Route path="/login" element={<LoginForm />} />
          <Route path="/users" element={<UserList />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
