// src/components/LoginForm.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";

export default function LoginForm({ onLoginSuccess }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const BACKEND_URL = "http://192.168.38.166:5000/auth/login";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BACKEND_URL, { email, password });
      const token = res.data.token;

      localStorage.setItem("jwtToken", token);

      if (onLoginSuccess) onLoginSuccess(token);

      setMessage("✅ Đăng nhập thành công!");
      setTimeout(() => navigate("/dashboard"), 800);
    } catch (err) {
      setMessage(
        "❌ Lỗi khi đăng nhập: " +
          (err.response?.data?.message || "Không kết nối được server")
      );
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "400px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4">🔐 Đăng nhập</h3>

        <form onSubmit={handleLogin}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-2 text-start">
            <label className="form-label fw-semibold">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* 🔹 Thêm nút Quên mật khẩu */}
          <div className="text-end mb-3">
            <Link to="/forgot-password" className="text-decoration-none text-success fw-semibold">
              Quên mật khẩu?
            </Link>
          </div>

          <button type="submit" className="btn btn-success w-100">
            Đăng nhập
          </button>
        </form>

        <p className="mt-3">
          Chưa có tài khoản?{" "}
          <Link to="/signup" className="text-primary fw-bold">
            Đăng ký ngay
          </Link>
        </p>

        {message && (
          <div className="alert alert-info text-center mt-3 p-2">{message}</div>
        )}
      </div>
    </div>
  );
}
