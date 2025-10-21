import { useEffect, useState } from "react";
import axios from "axios";

function UserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:3000/users")
      .then(res => setUsers(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>Danh sách User</h2>
      <ul>
        {users.map((u, idx) => <li key={idx}>{u.name}</li>)}
      </ul>
    </div>
  );
}

export default UserList;
