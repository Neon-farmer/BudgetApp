import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useMsal } from "@azure/msal-react";
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
import { Layout } from "./components/layout/Layout";
import { LoadingProvider, useGlobalLoading } from "./contexts/LoadingContext";
import { SettingsPage } from "./pages/SettingsPage";

const App = () => {
  const { instance } = useMsal();
  const activeAccount = instance.getActiveAccount();

  return (
    <BrowserRouter>
      <LoadingProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LoginPage />} />
          <Route path="/login" element={<LoginPage />} />
          {/* Redirect Handler */}
          <Route path="/redirect" element={<RedirectPage />} />
          {/* Protected Routes */}
          <Route
            path="/budget/*"
            element={
              activeAccount ? (
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
                  <Route path="/transaction/new" element={<AddTransactionPage />} />
                  <Route path="/transaction/new/:envelopeId" element={<AddTransactionPage />} />
                  <Route path="/transaction/:id" element={<TransactionDetailPage />} />
                  <Route path="*" element={<NotFoundPage />} />
                </Routes>
              </Layout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
      </LoadingProvider>
    </BrowserRouter>
  );
};

export default App;
