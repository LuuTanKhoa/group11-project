import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [token, setToken] = useState(""); // ✅ thêm state để lưu JWT token
  const navigate = useNavigate();

  const BACKEND_URL = "http://172.21.14.97:3000/login";

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(BACKEND_URL, { email, password });

      // ✅ Lưu token vào state và localStorage
      const receivedToken = res.data.token;
      setToken(receivedToken);
      localStorage.setItem("jwtToken", receivedToken);

      setMessage("✅ Đăng nhập thành công!");
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setMessage(
        "❌ Lỗi khi đăng nhập: " +
          (err.response?.data?.message || "Không kết nối được server")
      );
      setToken(""); // Xóa token nếu đăng nhập lỗi
    }
  };

  return (
    <div className="container mt-5">
      <div
        className="card shadow p-4 mx-auto"
        style={{ maxWidth: "400px", borderRadius: "12px" }}
      >
        <h3 className="text-center mb-4">Đăng nhập</h3>

        <form onSubmit={handleLogin}>
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

          <button type="submit" className="btn btn-success w-100">
            Đăng nhập
          </button>
        </form>

        {/* ✅ Thông báo kết quả */}
        {message && (
          <div className="alert alert-info text-center mt-3 p-2">{message}</div>
        )}

        {/* ✅ Hiển thị JWT token nếu có */}
        {token && (
          <div className="alert alert-success mt-3 text-break">
            <strong>JWT Token:</strong>
            <textarea
              className="form-control mt-2"
              value={token}
              readOnly
              rows={3}
            />
          </div>
        )}
      </div>
    </div>
  );
}
