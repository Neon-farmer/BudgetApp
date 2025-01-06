import React from "react";
import { useLogin } from "../hooks/useLogin";

const LoginButton = () => {
  const { handleLogin } = useLogin();

  return (
    <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h2>Welcome to Budget App</h2>
      <button onClick={handleLogin} style={{ padding: "10px 20px" }}>
        Login
      </button>
    </div>
  );
};

export default LoginButton;
