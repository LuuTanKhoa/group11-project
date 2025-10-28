import React, { useEffect, useState } from "react";
import axios from "axios";

const UserList = ({ reload }) => {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");

  // Thay URL backend nếu cần (nếu backend chạy trên máy khác)
  const BACKEND_URL = "http://10.10.8.244:3000/users";

  useEffect(() => {
    setError(""); // reset lỗi trước khi gọi API
    axios.get(BACKEND_URL)
      .then(res => setUsers(res.data))
      .catch(err => {
        console.error("Error fetching users:", err);
        setError("Failed to fetch users. Check backend connection.");
      });
  }, [reload]);

  return (
    <div>
      <h2>User List</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {users.map(user => (
          <li key={user._id}>{user.name} - {user.email}</li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;