import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import RedirectPage from "./pages/RedirectPage"; // Import the RedirectPage component

const App = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<LoginPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* Redirect Handler */}
        <Route path="/redirect" element={<RedirectPage />} />{" "}
        {/* Protected Routes */}
        <Route
          path="/budget/*"
          element={
            activeAccount ? (
              <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/home" element={<HomePage />} />
                <Route path="*" element={<NotFoundPage />} />
              </Routes>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
