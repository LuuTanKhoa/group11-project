import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUser = ({ reload, setReload, editingUser, setEditingUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const BACKEND_URL = "http://10.10.8.244:3000/users";

  // 🧠 Khi chọn user để sửa → tự điền vào form
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
    }
  }, [editingUser]);

  // 📝 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (editingUser) {
        // 🧩 Nếu đang sửa → gọi PUT API
        await axios.put(`${BACKEND_URL}/${editingUser._id}`, { name, email });
        alert("Cập nhật người dùng thành công!");
      } else {
        // ➕ Nếu đang thêm mới → gọi POST API
        await axios.post(BACKEND_URL, { name, email });
        alert("Thêm người dùng thành công!");
      }

      setReload(!reload); // load lại danh sách
      setEditingUser(null); // reset form
      setName("");
      setEmail("");
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Lỗi khi lưu người dùng!");
    }
  };

  return (
    <div>
      <h2>{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Tên"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <button type="submit">{editingUser ? "Cập nhật" : "Thêm"}</button>
        {editingUser && (
          <button type="button" onClick={() => setEditingUser(null)}>
            Hủy
          </button>
        )}
      </form>
    </div>
  );
};

export default AddUser;
