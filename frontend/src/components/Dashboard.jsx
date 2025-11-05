import React from "react";
import { useNavigate } from "react-router-dom";
import { Users, User, LogOut, Target } from "lucide-react";

export default function Dashboard({ onLogout }) {
  const navigate = useNavigate();

  return (
    <div className="container d-flex flex-column align-items-center justify-content-center vh-100 bg-light">
      <div
        className="card shadow-lg p-4 text-center"
        style={{ maxWidth: "420px", borderRadius: "15px" }}
      >
        {/* Tiêu đề */}
        <div className="d-flex align-items-center justify-content-center mb-3">
          <Target size={40} className="text-success me-2" />
          <h2 className="fw-bold mb-0">Dashboard</h2>
        </div>

        {/* Dòng chào */}
        <p className="text-muted mb-4">
          Chào mừng bạn đến với hệ thống quản lý người dùng!
        </p>

        {/* Nút điều hướng */}
        <div className="d-grid gap-3 mb-3">
          <button
            onClick={() => navigate("/admin/users")}
            className="btn btn-success d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <Users size={18} /> Danh sách người dùng
          </button>

          <button
            onClick={() => navigate("/profile")}
            className="btn btn-outline-success d-flex align-items-center justify-content-center gap-2 py-2"
          >
            <User size={18} /> Hồ sơ cá nhân
          </button>
        </div>

        {/* Nút đăng xuất */}
        <button
          onClick={() => {
            onLogout();
            navigate("/login");
          }}
          className="btn btn-danger w-100 d-flex align-items-center justify-content-center gap-2 py-2"
        >
          <LogOut size={18} /> Đăng xuất
        </button>
      </div>
    </div>
  );
}
