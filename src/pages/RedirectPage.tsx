import React from "react";
import { useRedirectHandler } from "../hooks/useRedirectHandler"; // Ensure this is the correct path
import { useAccount } from "@azure/msal-react";

const RedirectPage = () => {
  useRedirectHandler(); // Use the custom hook to handle redirect

  return <div>Redirecting...</div>;
};

export default RedirectPage;
