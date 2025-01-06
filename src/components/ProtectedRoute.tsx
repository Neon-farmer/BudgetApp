import React from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useMsal } from "@azure/msal-react";

interface ProtectedRouteProps {
  element: React.ReactNode;
  path: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ element, path }) => {
  const { accounts } = useMsal();
  const location = useLocation(); // To preserve the location when redirecting

  // If there is no active account, redirect to login page
  if (!accounts || accounts.length === 0) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Return the protected route
  return <Route path={path} element={element} />;
};

export default ProtectedRoute;
