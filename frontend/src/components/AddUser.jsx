// src/components/AddUser.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

export default function AddUser({ reload, setReload, editingUser, setEditingUser }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");

<<<<<<< Updated upstream
  const BACKEND_URL = "http://10.10.8.244:3000/users";
=======
  // ✅ URL backend (đổi IP cho đúng backend thật)
  const BACKEND_URL = "http://192.168.38.166:5000/users";
  const token = localStorage.getItem("jwtToken");
>>>>>>> Stashed changes

  // ✅ Nếu đang sửa, tự động đổ dữ liệu lên form
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name || "");
      setEmail(editingUser.email || "");
      setRole(editingUser.role || "user");
    } else {
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    }
  }, [editingUser]);

  // ✅ Hàm thêm mới hoặc cập nhật user
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!token) {
      alert("Bạn chưa đăng nhập!");
      return;
    }

    const userData = { name, email, password, role };

    try {
      if (editingUser) {
        // 🔹 Cập nhật user
        await axios.put(`${BACKEND_URL}/${editingUser._id}`, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Cập nhật người dùng thành công!");
      } else {
        // 🔹 Thêm user mới
        await axios.post(BACKEND_URL, userData, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMessage("✅ Thêm người dùng thành công!");
      }

      // Dọn form & reload danh sách
      setEditingUser(null);
      setReload(!reload);
      setName("");
      setEmail("");
      setPassword("");
      setRole("user");
    } catch (err) {
      console.error("❌ Lỗi khi lưu người dùng:", err);
      setMessage(err.response?.data?.message || "Lỗi khi lưu người dùng!");
    }
  };

  return (
    <div className="container mt-4">
      <div
        className="card shadow p-4"
        style={{ maxWidth: "500px", margin: "0 auto", borderRadius: "14px" }}
      >
        <h3 className="text-center mb-3">
          {editingUser ? "✏️ Sửa thông tin người dùng" : "➕ Thêm người dùng"}
        </h3>

        <form onSubmit={handleSubmit}>
          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Họ và tên</label>
            <input
              type="text"
              className="form-control"
              placeholder="Nhập họ tên..."
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Email</label>
            <input
              type="email"
              className="form-control"
              placeholder="Nhập email..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              readOnly={!!editingUser} // Không cho sửa email nếu đang edit
            />
          </div>

          {!editingUser && (
            <div className="mb-3 text-start">
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
          )}

          <div className="mb-3 text-start">
            <label className="form-label fw-semibold">Quyền</label>
            <select
              className="form-select"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="user">👤 User</option>
              <option value="admin">👑 Admin</option>
            </select>
          </div>

          <div className="d-flex justify-content-between">
            <button type="submit" className="btn btn-success w-50 me-2">
              {editingUser ? "💾 Lưu" : "➕ Thêm"}
            </button>
            {editingUser && (
              <button
                type="button"
                className="btn btn-secondary w-50"
                onClick={() => setEditingUser(null)}
              >
                ❌ Hủy
              </button>
            )}
          </div>
        </form>

        {message && (
          <div className="alert alert-info text-center mt-3 p-2">{message}</div>
        )}
      </div>
    </div>
  );
}
