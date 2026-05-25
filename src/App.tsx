import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
import { useEffect } from "react";
import { NotFoundPage } from "./pages/NotFoundPage";
import { HomePage } from "./pages/HomePage";
import { LoginPage } from "./pages/LoginPage";
import RedirectPage from "./pages/RedirectPage";
import { EnvelopesPage } from "./pages/EnvelopesPage";
import { AddEnvelopePage } from "./pages/AddEnvelopePage";
import { AddIncomePage } from "./pages/AddIncomePage";
import { AddExpensePage } from "./pages/AddExpensePage";
import { AddTransactionPage } from "./pages/AddTransactionPage";
import { StyleGuidePage } from "./pages/StyleGuidePage";
import { OrbitalSpinnerDemo } from "./pages/OrbitalSpinnerDemo";
import { AddPlanPage } from "./pages/AddPlanPage";
import { EditPlanPage } from "./pages/EditPlanPage";
import { PlannerPage } from "./pages/PlannerPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { EnvelopeDetailPage } from "./pages/EnvelopeDetailPage";
import { PlanDetailPage } from "./pages/PlanDetailPage";
import { TransactionDetailPage } from "./pages/TransactionDetailPage";
import { HelpPage } from "./pages/HelpPage";
import { Layout } from "./components/layout/Layout";
import { LoadingProvider, useGlobalLoading } from "./contexts/LoadingContext";
import { SettingsPage } from "./pages/SettingsPage";
import { UserVerificationWrapper } from "./components/UserVerificationWrapper";

const App = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();
  
  const isAuthenticated = activeAccount != null;

  // Force layout recalculation on app load to ensure safe-area-inset values are applied
  // This is especially important for iOS PWA standalone mode
  useEffect(() => {
    // Trigger a reflow/repaint to ensure safe-area-inset environment variables are calculated
    const root = document.getElementById('root');
    if (!root) return;

    // Initially hide to prevent glitch
    root.classList.remove('ready');
    
    // Trigger multiple reflows to ensure safe-area-inset is calculated
    root.style.display = 'block';
    void root.offsetHeight; // Trigger reflow 1
    
    // Wait for iOS to calculate safe-area-inset values
    const showApp = () => {
      root.classList.add('ready');
    };

    if ((navigator as any).standalone === true) {
      // App is running in PWA standalone mode - give it more time
      setTimeout(() => {
        window.dispatchEvent(new Event('resize'));
        setTimeout(showApp, 150);
      }, 50);
    } else {
      // Regular browser - show immediately
      showApp();
    }
  }, []);

  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={isAuthenticated ? <Navigate to="/budget/home" replace /> : <LoginPage />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/budget/home" replace /> : <LoginPage />} />
          
          {/* Redirect Handler - Always accessible */}
          <Route path="/redirect" element={<RedirectPage />} />
          
          {/* Protected Routes */}
          <Route
            path="/budget/*"
            element={
              isAuthenticated ? (
                <UserVerificationWrapper>
                  <Layout>
                    <Routes>
                      <Route path="/" element={<HomePage />} />
                      <Route path="/home" element={<HomePage />} />
                      <Route path="/add-income" element={<AddIncomePage />} />
                      <Route path="/add-expense" element={<AddExpensePage />} />
                      <Route path='/settings' element={<SettingsPage />} />
                      {/* Envelope Routes */}
                      <Route path="/envelopes" element={<EnvelopesPage />} />
                      <Route path="/envelope/new" element={<AddEnvelopePage />} />
                      <Route path="/envelope/:id" element={<EnvelopeDetailPage />} />
                      {/* Planner Routes */}
                      <Route path="/planner" element={<PlannerPage />} />
                      <Route path="/planner/new" element={<AddPlanPage />} />
                      <Route path="/planner/new/:envelopeId" element={<AddPlanPage />} />
                      <Route path="/planner/:id/edit" element={<EditPlanPage />} />
                      <Route path="/planner/:id" element={<PlanDetailPage />} />
                      {/* Transaction Routes */}
                      <Route path="/transactions" element={<TransactionsPage />} />
                      <Route path="/help" element={<HelpPage />} />
                      <Route path="/transaction/new" element={<AddTransactionPage />} />
                      <Route path="/transaction/new/:envelopeId" element={<AddTransactionPage />} />
                      <Route path="/transaction/:id" element={<TransactionDetailPage />} />
                      <Route path="*" element={<NotFoundPage />} />
                    </Routes>
                  </Layout>
                </UserVerificationWrapper>
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          
          {/* Catch all - redirect to appropriate page */}
          <Route path="*" element={isAuthenticated ? <Navigate to="/budget/home" replace /> : <Navigate to="/login" replace />} />
        </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
