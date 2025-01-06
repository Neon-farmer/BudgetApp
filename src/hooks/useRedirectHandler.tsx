import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

// Redirects the user from the redirect URI after authenticating

export const useRedirectHandler = () => {
  const { instance } = useMsal();
  const navigate = useNavigate();

  useEffect(() => {
    const handleRedirect = async () => {
      try {
        // Wait for the PCA instance to initialize
        await instance.initialize();

        // Handle the MSAL redirect response
        const response = await instance.handleRedirectPromise();

        if (response) {
          // Successfully logged in, set the active account
          console.log("Logged in user:", response.account);
          instance.setActiveAccount(response.account);
          navigate("/budget/home"); // Redirect to the protected route
        } else {
          // No response, navigate to login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during redirect handling:", error);
        navigate("/login"); // Redirect to login on error
      }
    };

    handleRedirect();
  }, [instance, navigate]);
};
