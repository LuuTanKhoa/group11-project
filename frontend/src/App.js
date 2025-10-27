import React, { useState } from "react";
import AddUser from "./components/AddUser";
import UserList from "./components/UserList";

function App() {
  const [reload, setReload] = useState(false);

  const handleUserAdded = () => setReload(!reload);

  return (
    <div className="App">
      <h1>React User Management</h1>
      <AddUser onUserAdded={handleUserAdded} />
      <UserList reload={reload} />
    </div>
  );
}

export default App;