import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ reload, onEdit }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

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

  // ✏️ Xử lý sự kiện SỬA
  const handleEdit = (user) => {
    if (onEdit) {
      onEdit(user); // gửi user được chọn lên App.js để hiển thị form sửa
    } else {
      console.log("Edit user:", user);
      alert("Chưa cấu hình hàm onEdit trong App.js!");
    }
  };

  return (
    <div>
      <h2>User List</h2>

      {/* Hiển thị lỗi nếu có */}
      {error && <p style={{ color: "red" }}>{error}</p>}

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
