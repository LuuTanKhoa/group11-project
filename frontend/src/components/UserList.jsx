import React, { useEffect, useState } from "react";
import axios from "axios";
import UserList from "./UserList";


const BACKEND_URL = "http://192.168.38.166:5000/users";

export default function UserList() {
  const [users, setUsers] = useState([]);
  const token = localStorage.getItem("jwtToken");

<<<<<<< Updated upstream
  // 🔗 Địa chỉ backend (chỉnh lại nếu khác)
  const BACKEND_URL = "http://10.10.8.244:3000/users";

  // 🧠 Lấy danh sách user mỗi khi reload thay đổi
=======
>>>>>>> Stashed changes
  useEffect(() => {
    axios
      .get(BACKEND_URL, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log("📦 Dữ liệu từ backend:", res.data);
        setUsers(res.data);
      })
      .catch((err) => console.error("❌ Lỗi khi tải người dùng:", err));
  }, [token]);

  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`${BACKEND_URL}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        alert("🗑️ Xóa thành công!");
        setUsers(users.filter((u) => u._id !== id));
      } catch (err) {
        console.error("❌ Lỗi khi xóa:", err);
      }
    }
  };

  return (
    <div className="container mt-5 text-center">
      <div className="card shadow p-4 mx-auto" style={{ maxWidth: "800px", borderRadius: "16px" }}>
        <h2 className="mb-4 text-primary fw-bold">📋 Danh sách người dùng</h2>
        <div className="table-responsive">
          <table className="table table-bordered align-middle text-center">
            <thead className="table-dark">
              <tr>
                <th>STT</th>
                <th>Email</th>
                <th>Tên</th>
                <th>Hành động</th>
              </tr>
            </thead>
            <tbody>
              {users.length > 0 ? (
                users.map((user, index) => (
                  <tr key={user._id}>
                    <td>{index + 1}</td>
                    <td>{user.email}</td>
                    <td>{user.name || "—"}</td>
                    <td>
                      <div className="d-flex justify-content-center gap-2">
                        <button className="btn btn-sm btn-primary">✏️ Sửa</button>
                        <button
                          className="btn btn-sm btn-danger"
                          onClick={() => handleDelete(user._id)}
                        >
                          🗑️ Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="4" className="text-muted">Không có người dùng nào.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <button className="btn btn-success mt-3 px-4 py-2">➕ Thêm người dùng</button>
      </div>
    </div>
  );
}
