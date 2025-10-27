import React, { useState, useEffect } from "react";
import axios from "axios";

const AddUser = ({ reload, setReload, editingUser, setEditingUser }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState({ name: "", email: "" }); // ✅ lưu lỗi form

  const BACKEND_URL = "http://10.10.8.244:3000/users";

  // 🧠 Khi chọn user để sửa → tự điền vào form
  useEffect(() => {
    if (editingUser) {
      setName(editingUser.name);
      setEmail(editingUser.email);
      setErrors({ name: "", email: "" });
    } else {
      setName("");
      setEmail("");
      setErrors({ name: "", email: "" });
    }
  }, [editingUser]);

  // 📝 Gửi form
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validation tự làm (không dùng required)
    const newErrors = { name: "", email: "" };
    if (!name.trim()) newErrors.name = "Tên không được để trống!";
    if (!/\S+@\S+\.\S+/.test(email)) newErrors.email = "Email không hợp lệ!";

    // Nếu có lỗi → dừng lại và hiển thị lỗi
    if (newErrors.name || newErrors.email) {
      setErrors(newErrors);
      return;
    }

    try {
      if (editingUser) {
        // 🧩 Nếu đang sửa → PUT
        await axios.put(`${BACKEND_URL}/${editingUser._id}`, { name, email });
        alert("Cập nhật người dùng thành công!");
      } else {
        // ➕ Nếu thêm mới → POST
        await axios.post(BACKEND_URL, { name, email });
        alert("Thêm người dùng thành công!");
      }

      setReload(!reload);
      setEditingUser(null);
      setName("");
      setEmail("");
      setErrors({ name: "", email: "" });
    } catch (err) {
      console.error("Error saving user:", err);
      alert("Lỗi khi lưu người dùng!");
    }
  };

  return (
    <div>
      <h2>{editingUser ? "Sửa người dùng" : "Thêm người dùng"}</h2>
      <form onSubmit={handleSubmit} noValidate>
        <div style={{ marginBottom: "10px" }}>
          <input
            type="text"
            placeholder="Tên"
            value={name}
            onChange={(e) => setName(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          {errors.name && <p style={{ color: "red", margin: 0 }}>{errors.name}</p>}
        </div>

        <div style={{ marginBottom: "10px" }}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            style={{ marginRight: "10px" }}
          />
          {errors.email && <p style={{ color: "red", margin: 0 }}>{errors.email}</p>}
        </div>

        <button type="submit">{editingUser ? "Cập nhật" : "Thêm"}</button>
        {editingUser && (
          <button
            type="button"
            onClick={() => setEditingUser(null)}
            style={{ marginLeft: "10px" }}
          >
            Hủy
          </button>
        )}
      </form>
    </div>
  );
};

export default AddUser;
