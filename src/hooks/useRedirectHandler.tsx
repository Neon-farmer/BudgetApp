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
        await instance.initialize();

        const response = await instance.handleRedirectPromise();

        if (response) {
          console.log("Logged in user:", response.account);
          instance.setActiveAccount(response.account);
          navigate("/budget/home");
        } else {
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
