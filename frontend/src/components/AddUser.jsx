import React, { useState } from "react";
import axios from "axios";

const AddUser = ({ onUserAdded }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState(""); // lưu lỗi nếu có

  // Thay URL backend nếu cần
  // Thay URL backend bằng IP máy backend
const BACKEND_URL = "http://10.10.8.244:3000/users"; // nếu backend ở máy khác, thay bằng IP

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(""); // reset lỗi trước khi gửi
    axios.post(BACKEND_URL, { name, email })
      .then(res => {
        console.log("User added:", res.data); // log để kiểm tra
        setName("");
        setEmail("");
        onUserAdded(); // thông báo App reload danh sách
      })
      .catch(err => {
        console.error("Error adding user:", err);
        setError("Failed to add user. Check backend connection.");
      });
  };

  return (
    <div>
      <h2>Add User</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />
        <button type="submit">Add User</button>
      </form>
      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
};

export default AddUser;