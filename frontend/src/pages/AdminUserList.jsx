// src/pages/AdminUserList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

export default function AdminUserList() {
  const [users, setUsers] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  // ✅ Backend API URL (chỉ còn "extra" vì bạn đã xóa "auth")
  const BACKEND_URL = "http://192.168.38.166:5000/extra";

  // ✅ Hàm load danh sách user
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem("jwtToken"); // 👈 phải trùng với key lưu ở login
      console.log("🔑 Token gửi đi:", token);

      // 🔹 Gọi đúng route theo backend hiện tại
      const res = await axios.get(`${BACKEND_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setUsers(res.data.users || res.data); // phòng trường hợp backend trả { users: [...] }
      setLoading(false);
    } catch (err) {
      console.error("❌ Lỗi khi tải danh sách user:", err);
      setLoading(false);
      setMessage(err.response?.data?.message || "Không thể tải danh sách người dùng!");
    }
  };

  // ✅ Hàm xóa user (cũng phải sửa URL)
  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc muốn xóa người dùng này không?")) return;

    try {
      const token = localStorage.getItem("jwtToken");
      const res = await axios.delete(`${BACKEND_URL}/users/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage(res.data.message || "✅ Đã xóa người dùng!");
      fetchUsers(); // reload danh sách
    } catch (err) {
      console.error("❌ Lỗi khi xóa user:", err);
      setMessage(err.response?.data?.message || "Không thể xóa người dùng!");
    }
  };

  // ✅ Load danh sách khi mở trang
  useEffect(() => {
    fetchUsers();
  }, []);

  if (loading) return <div className="text-center mt-5">⏳ Đang tải...</div>;

  return (
    <div className="container mt-5">
      <h2 className="text-center mb-4 text-primary">👑 Quản lý Người Dùng (Admin)</h2>

      {message && (
        <div className="alert alert-info text-center p-2">{message}</div>
      )}

      {users.length === 0 ? (
        <div className="text-center">Không có người dùng nào.</div>
      ) : (
        <table className="table table-bordered table-hover shadow-sm">
          <thead className="table-light">
            <tr>
              <th>#</th>
              <th>Tên</th>
              <th>Email</th>
              <th>Quyền</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u, index) => (
              <tr key={u._id}>
                <td>{index + 1}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>
                  {u.role === "admin" ? (
                    <span className="badge bg-danger">Admin</span>
                  ) : (
                    <span className="badge bg-secondary">User</span>
                  )}
                </td>
                <td>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(u._id)}
                  >
                    ❌ Xóa
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}
