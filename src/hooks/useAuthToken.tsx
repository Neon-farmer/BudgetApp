import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";

export const useAuthToken = () => {
  const { instance } = useMsal();
  const [isMsalReady, setMsalReady] = useState(false);

  // Ensure MSAL is initialized
  useEffect(() => {
    if (instance) {
      setMsalReady(true); // Mark MSAL as ready once the instance is available
    }
  }, [instance]);

  const getToken = async () => {
    if (!isMsalReady) {
      console.error("MSAL is not initialized yet.");
      return;
    }

    try {
      const account = instance.getActiveAccount();
      if (!account) throw new Error("No active account!");
      // MSAL Magic
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      console.log("Access Token:", response.accessToken); // Debugging line
      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition failed:", error);
      throw error;
    }
  };

  return getToken;
};
