// src/components/ForgotPassword.jsx
import React, { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  // ✅ Đổi từ /auth/... sang /extra/...
  const BACKEND_URL = "http://192.168.38.166:5000/extra/forgot-password";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(BACKEND_URL, { email });
      setMessage(`✅ ${res.data.message}`);
    } catch (err) {
      console.error("❌ Lỗi forgot password:", err);
      setMessage(
        `❌ ${
          err.response?.data?.message ||
          "Không thể gửi email khôi phục mật khẩu!"
        }`
      );
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "400px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4">📩 Quên mật khẩu</h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Nhập email của bạn</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email để nhận link đặt lại mật khẩu..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-success w-100">
            Gửi yêu cầu
          </button>
        </form>

        <p className="mt-3">
          <Link to="/login" className="text-primary fw-bold">
            ← Quay lại đăng nhập
          </Link>
        </p>

        {message && (
          <div className="alert alert-info text-center mt-3 p-2">{message}</div>
        )}
      </div>
    </div>
  );
}
