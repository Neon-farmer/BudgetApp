import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";

export const useLogin = () => {
  const { instance } = useMsal();

  const handleLogin = () => {
    instance.loginRedirect(loginRequest).catch((error) => {
      console.error("Login failed:", error);
    });
  };

  return { handleLogin };
};
