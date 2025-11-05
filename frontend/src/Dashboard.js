import React from "react";
import ProfileForm from "./ProfileForm";

export default function Dashboard({ token, onLogout }) {
  return (
    <div>
      <button className="btn btn-secondary mb-3" onClick={onLogout}>Logout</button>
      <ProfileForm token={token} />
    </div>
  );
}