import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);
  const [editingUser, setEditingUser] = useState(null); // 👈 Lưu user đang sửa

  // ✅ Gọi khi thêm hoặc cập nhật user xong
  const handleUserChanged = () => {
    setReload(!reload); // tải lại danh sách user
    setEditingUser(null); // reset form về trạng thái thêm mới
  };

  // ✅ Khi nhấn “Sửa” trong UserList, cập nhật state editingUser
  const handleEditUser = (user) => {
    setEditingUser(user);
  };

  return (
    <div className="App" style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>React User Management</h1>

      {/* Form thêm / sửa người dùng */}
      <AddUser
        onUserAdded={handleUserChanged}
        reload={reload}
        setReload={setReload}
        editingUser={editingUser}     // 👈 truyền user đang sửa
        setEditingUser={setEditingUser} // 👈 cho phép form reset sau khi cập nhật
      />

      {/* Danh sách người dùng */}
      <UserList
        reload={reload}
        onEdit={handleEditUser} // 👈 khi nhấn “Sửa” từ danh sách
      />
    </div>
  );
}
export default App;