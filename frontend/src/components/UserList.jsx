import React, { useEffect, useState } from "react";
import axios from "axios";
import UserList from "./UserList";


const UserList = ({ reload, onEdit }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [editingUser, setEditingUser] = useState(null); // user đang sửa
  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");

  // 🔗 Địa chỉ backend (chỉnh lại nếu khác)
  const BACKEND_URL = "http://10.10.8.244:3000/users";

  // 🧠 Lấy danh sách user mỗi khi reload thay đổi
  useEffect(() => {
    setError("");
    axios
      .get(BACKEND_URL)
      .then((res) => setUsers(res.data))
      .catch((err) => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Check backend connection.");
      });
  }, [reload]);

  // 🗑️ Xử lý sự kiện XÓA
  const handleDelete = async (id) => {
    if (window.confirm("Bạn có chắc muốn xóa người dùng này không?")) {
      try {
        await axios.delete(`${BACKEND_URL}/${id}`);
        setUsers(users.filter((user) => user._id !== id));
      } catch (err) {
        console.error("Error deleting user:", err);
        alert("Không thể xóa user. Vui lòng thử lại!");
      }
    }
  };

  // ✏️ Bắt đầu chỉnh sửa
  const handleEdit = (user) => {
    setEditingUser(user);
    setEditName(user.name);
    setEditEmail(user.email);
  };

  // 💾 Gửi PUT request để cập nhật user
  const handleUpdate = async () => {
    try {
      const updatedUser = { name: editName, email: editEmail };
      const res = await axios.put(`${BACKEND_URL}/${editingUser._id}`, updatedUser);

      // Cập nhật danh sách trên frontend
      setUsers(users.map((u) => (u._id === editingUser._id ? res.data : u)));
      setEditingUser(null);
      alert("Cập nhật thành công!");
    } catch (err) {
      console.error("Error updating user:", err);
      alert("Không thể cập nhật. Kiểm tra kết nối backend!");
    }
  };

  return (
    <div>
      <h2>User List</h2>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Nếu đang sửa thì hiển thị form sửa */}
      {editingUser && (
        <div style={{ border: "1px solid gray", padding: "10px", marginBottom: "20px" }}>
          <h3>Chỉnh sửa người dùng</h3>
          <label>
            Tên:{" "}
            <input
              type="text"
              value={editName}
              onChange={(e) => setEditName(e.target.value)}
            />
          </label>
          <br />
          <label>
            Email:{" "}
            <input
              type="email"
              value={editEmail}
              onChange={(e) => setEditEmail(e.target.value)}
            />
          </label>
          <br />
          <button onClick={handleUpdate}>Lưu</button>
          <button onClick={() => setEditingUser(null)}>Hủy</button>
        </div>
      )}

      {/* Hiển thị danh sách người dùng */}
      {users.length === 0 ? (
        <p>Không có người dùng nào.</p>
      ) : (
        <ul>
          {users.map((user) => (
            <li key={user._id}>
              {user.name} - {user.email}{" "}
              <button onClick={() => handleEdit(user)}>Sửa</button>
              <button onClick={() => handleDelete(user._id)}>Xóa</button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default UserList;
