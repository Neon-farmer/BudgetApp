import React from "react";
import ReactDOM from "react-dom/client";
import { PublicClientApplication } from "@azure/msal-browser";
import { MsalProvider } from "@azure/msal-react";
import App from "./App";
import { msalConfig } from "./config/authConfig";
import { ThemeProvider } from "styled-components";
import { theme } from "./css/theme";

const msalInstance = new PublicClientApplication(msalConfig);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <MsalProvider instance={msalInstance} /* Authentication */>
      <ThemeProvider theme={theme} /* Global Styles */>
        <App />
      </ThemeProvider>
    </MsalProvider>
  </React.StrictMode>
);
