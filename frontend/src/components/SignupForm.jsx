import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";

export default function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // 👉 Backend trên port 3000
  const BACKEND_URL = "http://192.168.38.166:5000/auth/signup";

 // chỉ là gốc của backend



  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BACKEND_URL, { email, password });
      setMessage("✅ Đăng ký thành công!");
      setTimeout(() => navigate("/login"), 1500);
      setEmail("");
      setPassword("");
    } catch (err) {
      setMessage(
        "❌ Lỗi khi đăng ký: " +
          (err.response?.data?.message || "Không kết nối được server")
      );
    }
  };

  return (
    <div className="container mt-5">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "400px", borderRadius: "12px" }}>
        <h3 className="text-center mb-4">Đăng ký tài khoản</h3>
        <form onSubmit={handleSignup}>
          <div className="mb-3">
            <label className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Mật khẩu</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">Đăng ký</button>
        </form>
        {message && (
          <div className="alert alert-info text-center mt-3 p-2">{message}</div>
        )}
      </div>
    </div>
  );
}