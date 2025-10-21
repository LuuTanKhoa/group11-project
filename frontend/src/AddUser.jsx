import { useState } from "react";
import axios from "axios";

function AddUser() {
  const [name, setName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.post("http://localhost:3000/users", { name })
      .then(() => alert("Thêm thành công!"))
      .catch(err => console.error(err));
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={name} onChange={e => setName(e.target.value)} placeholder="Nhập tên user"/>
      <button type="submit">Thêm User</button>
    </form>
  );
}

export default AddUser;
