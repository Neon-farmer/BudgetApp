import { useMsal } from "@azure/msal-react";

export const useLogout = () => {
  const { instance } = useMsal();

  const handleLogout = () => {
    instance.logoutRedirect().catch((error) => {
      console.error("Logout failed:", error);
    });
  };

  return { handleLogout };
};
