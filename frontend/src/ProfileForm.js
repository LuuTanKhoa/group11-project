import React, { useEffect, useState } from "react";
import axios from "axios";

export default function ProfileForm({ token }) {
  const [user, setUser] = useState({});
  const [message, setMessage] = useState("");

  // 🔹 Thay bằng IP của backend
  const BACKEND_URL = "http://<IP_BACKEND>:3000/profile";

  // Load thông tin user khi component mount
  useEffect(() => {
    if (!token) return;
    axios.get(BACKEND_URL, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setUser(res.data))
    .catch(err => setMessage(err.response?.data?.message || "Lỗi server"));
  }, [token]);

  // Cập nhật thông tin
  const handleUpdate = (e) => {
    e.preventDefault();
    axios.put(BACKEND_URL, user, {
      headers: { Authorization: `Bearer ${token}` }
    })
    .then(res => setMessage(res.data.message))
    .catch(err => setMessage(err.response?.data?.message || "Lỗi server"));
  };

  return (
    <div style={{ maxWidth: "400px", margin: "auto" }}>
      <h3>Thông tin cá nhân</h3>
      <form onSubmit={handleUpdate}>
        <input
          type="text"
          value={user.name || ""}
          onChange={e => setUser({...user, name: e.target.value})}
          placeholder="Tên"
          className="form-control mb-2"
        />
        <input
          type="email"
          value={user.email || ""}
          onChange={e => setUser({...user, email: e.target.value})}
          placeholder="Email"
          className="form-control mb-2"
        />
        <button type="submit" className="btn btn-primary w-100">Cập nhật</button>
      </form>
      {message && <p className="mt-2 text-center">{message}</p>}
    </div>
  );
}