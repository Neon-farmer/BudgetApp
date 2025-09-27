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
        // Check if there are error parameters in the URL
        const urlParams = new URLSearchParams(window.location.hash.substring(1));
        const error = urlParams.get('error');
        const errorDescription = urlParams.get('error_description');

        if (error) {
          console.log("Authentication error:", error);
          if (errorDescription) {
            console.log("Error description:", decodeURIComponent(errorDescription));
          }
          
          // Handle specific error cases
          if (error === 'access_denied') {
            console.log("User cancelled authentication");
          }
          
          // Redirect to login page for all error cases
          navigate("/login");
          return;
        }

        await instance.initialize();
        const response = await instance.handleRedirectPromise();

        if (response) {
          console.log("Logged in user:", response.account);
          instance.setActiveAccount(response.account);
          navigate("/budget/home");
        } else {
          // No response and no error - redirect to login
          navigate("/login");
        }
      } catch (error) {
        console.error("Error during redirect handling:", error);
        navigate("/login");
      }
    };

    handleRedirect();
  }, [instance, navigate]);
};
