import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // 👈 Thêm state lưu user đang sửa

  // Gọi khi thêm hoặc cập nhật user xong
  const handleUserChanged = () => {
    setReload(!reload); // tải lại danh sách
    setEditingUser(null); // reset form
  };

  return (
    <div className="App" style={{ padding: "20px" }}>
      <h1>React User Management</h1>

      {/* Form thêm / sửa người dùng */}
      <AddUser
        onUserAdded={handleUserChanged}
        reload={reload}
        setReload={setReload}
        editingUser={editingUser}
        setEditingUser={setEditingUser}
      />

      {/* Danh sách người dùng */}
      <UserList
        reload={reload}
        onEdit={setEditingUser} // 👈 Khi nhấn “Sửa” trong UserList
      />
    </div>
  );
}

export default App;
