import React from 'react';
import UserList from "./components/UserList";




const App = () => {
  return (
    <div>
      <h1>Ứng Dụng Quản Lý Người Dùng</h1>
      <UserList />
    </div>
  );
};
import React, { useState } from "react";
import UserList from "./UserList";
import AddUser from "./AddUser";

function App() {
  const [users, setUsers] = useState([]);

  // Hàm để thêm người dùng vào state
  const handleAddUser = (newUser) => {
    setUsers((prevUsers) => [...prevUsers, newUser]);
  };

  return (
    <div>
      <h1>Quản lý người dùng</h1>
      <AddUser onAddUser={handleAddUser} /> {/* Gửi hàm thêm người dùng */}
      <UserList users={users} /> {/* Hiển thị danh sách người dùng */}
    </div>
  );
}

export default App;
