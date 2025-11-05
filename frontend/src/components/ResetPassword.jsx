// src/components/ResetPassword.jsx
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Lock } from "lucide-react";

const BACKEND_URL = "http://192.168.38.166:5000"; // đổi IP nếu cần

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();
  const { token } = useParams(); // 🔹 Lấy token từ URL

  console.log("🔑 Token từ URL:", token);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Gửi đúng endpoint có :token
      const response = await axios.post(
        `${BACKEND_URL}/extra/reset-password/${token}`,
        { password } // backend nhận field "password"
      );

      setMessage(response.data.message || "✅ Mật khẩu đã được đặt lại thành công!");
      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.error("❌ Lỗi reset mật khẩu:", error);
      setMessage(
        error.response?.data?.message || "❌ Token không hợp lệ hoặc đã hết hạn!"
      );
    }
  };

  return (
    <div className="d-flex align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 text-center"
        style={{
          maxWidth: "420px",
          width: "100%",
          borderRadius: "15px",
          border: "none",
        }}
      >
        <div className="mb-3 text-success">
          <Lock size={48} />
        </div>
        <h3 className="fw-bold mb-3 text-success">Đặt lại mật khẩu</h3>
        <p className="text-muted mb-4">
          🔑 Nhập mật khẩu mới để khôi phục tài khoản của bạn
        </p>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Mật khẩu mới</label>
            <input
              type="password"
              className="form-control"
              placeholder="Nhập mật khẩu mới..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-success w-100 py-2 fw-semibold"
          >
            ✅ Đặt lại mật khẩu
          </button>
        </form>

        {message && (
          <p className="mt-3 text-center fw-semibold text-primary">{message}</p>
        )}

        <button
          onClick={() => navigate("/login")}
          className="btn btn-outline-secondary mt-3 w-100 fw-semibold"
        >
          ← Quay lại đăng nhập
        </button>
      </div>
    </div>
  );
}
