import { useEffect, useState } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../config/authConfig";
import { handleAuthError } from "../utils/authRedirect";

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
      const error = new Error("MSAL is not initialized yet.");
      console.error(error.message);
      handleAuthError(error, "MSAL initialization");
      throw error;
    }

    try {
      const account = instance.getActiveAccount();
      if (!account) {
        const error = new Error("No active account!");
        handleAuthError(error, "Token acquisition");
        throw error;
      }
      
      // MSAL Magic
      const response = await instance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      console.log("Access Token:", response.accessToken); // Debugging line
      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition failed:", error);
      
      // Handle auth errors with redirect
      handleAuthError(error, "Token acquisition");
      
      throw error;
    }
  };

  return getToken;
};
