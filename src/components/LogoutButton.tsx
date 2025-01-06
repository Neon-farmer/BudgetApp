import React from "react";
import { useLogout } from "../hooks/useLogout";

const LogoutButton = () => {
  const { handleLogout } = useLogout();

  return (
    <button onClick={handleLogout} style={{ padding: "10px 20px" }}>
      Logout
    </button>
  );
};

export default LogoutButton;
