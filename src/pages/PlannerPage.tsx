import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { ConfirmationModal } from "../components/ConfirmationModal";
import { DraggableTable, DraggableTableColumn } from "../components/tables/DraggableTable";
import { PageContainer as Container, commonBreadcrumbs } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Plan, Budget, Envelope, PlanPrioritiesUpdateDto, MonthlyUpdateRequest } from "../services/types";

export const PlannerPage = () => {
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();
  const [plans, setPlans] = useState<Plan[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [updatingBalances, setUpdatingBalances] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log("Loading budget and plans data...");

      // First get the budget to get the budget ID
      const budgetResponse = await budgetApi.getBudget();
      if (!budgetResponse.data) {
        throw new Error("Failed to load budget");
      } 

      setBudget(budgetResponse.data);

      // Get envelopes using the dedicated endpoint
      const envelopesResponse = await budgetApi.getEnvelopes(budgetResponse.data.id);
      if (envelopesResponse.data) {
        setEnvelopes(envelopesResponse.data);
      } else {
        setEnvelopes([]);
      }

      // Then get all plans for this budget
      const plansResponse = await budgetApi.getPlansByBudget(budgetResponse.data.id);
      setPlans(plansResponse.data || []);

    } catch (err) {
      console.error("Error loading data:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred while loading data");
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePlanClick = (plan: Plan) => {
    navigate(`/budget/planner/${plan.id}`);
  };

  const handleCreatePlan = () => {
    navigate("/budget/planner/new");
  };

  const handleUpdateBalancesClick = () => {
    setShowUpdateModal(true);
  };

  const handleUpdateBalances = async () => {
    if (!budget) return;

    try {
      setUpdatingBalances(true);
      setError(null);
      setSuccessMessage(null);

      const request: MonthlyUpdateRequest = {
        increase: true
      };

      const response = await budgetApi.updatePlanBalancesMonthly(request);
      if (response.data) {
        setPlans(response.data);
        setSuccessMessage("Plan balances updated successfully! All monthly amounts have been added to plan balances.");
        
        // Auto-hide success message after 5 seconds
        setTimeout(() => {
          setSuccessMessage(null);
        }, 5000);
      }
    } catch (err) {
      console.error("Error updating plan balances:", err);
      if (err instanceof Error) {
        setError(`Failed to update plan balances: ${err.message}`);
      } else {
        setError("An error occurred while updating plan balances");
      }
    } finally {
      setUpdatingBalances(false);
      setShowUpdateModal(false);
    }
  };

  const handleUpdateCancel = () => {
    setShowUpdateModal(false);
  };

  const handleReorder = async (newOrder: Plan[]) => {
    // Update priorities based on new order (1-based indexing)
    const updatedPriorities: PlanPrioritiesUpdateDto = {
      planPriorities: newOrder.map((plan, index) => ({
        id: plan.id,
        priority: index + 1
      }))
    };

    try {
      const response = await budgetApi.updatePlanPriorities(updatedPriorities);
      if (response.data) {
        // Update local state with the response
        setPlans(response.data);
      }
    } catch (error) {
      console.error('Error updating priorities:', error);
      // Revert the optimistic update by reloading data
      loadData();
      throw error; // Re-throw to let the table know the operation failed
    }
  };

  const getEnvelopeName = (envelopeId: number): string => {
    const envelope = envelopes.find(e => e.id === envelopeId);
    return envelope?.name || `Envelope #${envelopeId}`;
  };

  const formatAmount = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  // Define table columns
  const columns: DraggableTableColumn<Plan>[] = [
    {
      key: 'envelopeId',
      header: 'Envelope Name',
      render: (value, plan) => (
        <PlanInfo>
          <PlanName>{getEnvelopeName(plan.envelopeId)}</PlanName>
        </PlanInfo>
      )
    },
    {
      key: 'monthlyAmount',
      header: 'Monthly Amount', // Shorter header for mobile
      render: (value) => <AmountText>{formatAmount(value)}</AmountText>
    },
    {
      key: 'planBalance',
      header: 'Balance',
      hideOnMobile: true,
      render: (value) => <BalanceText>{formatAmount(value)}</BalanceText>,
    }
  ];

  const sortedPlans = [...plans].sort((a, b) => a.priority - b.priority);

  if (loading) {
    return (
      <Container breadcrumbs={commonBreadcrumbs.planner}>
        <Loading message="Loading plans..." size="lg" />
      </Container>
    );
  }

  return (
    <Container breadcrumbs={commonBreadcrumbs.planner}>
      <Header>
        <PageTitle align="center">Budget Planner</PageTitle>
        <HeaderActions>
          <Button onClick={handleCreatePlan}>
            Create New Plan
          </Button>
          <Button 
            onClick={handleUpdateBalancesClick}
            disabled={updatingBalances || !budget || plans.length === 0}
          >
            {updatingBalances ? 'Updating...' : 'Update Plan Balances'}
          </Button>
        </HeaderActions>
      </Header>

      {error && (
        <ErrorMessage>
          <strong>Error:</strong> {error}
        </ErrorMessage>
      )}

      {successMessage && (
        <SuccessMessage>
          <strong>Success:</strong> {successMessage}
        </SuccessMessage>
      )}

      {!error && plans.length === 0 ? (
        <EmptyState>
          <h3>No Plans Yet</h3>
          <p>
            You haven't created any budget plans yet. Plans help you organize your 
            savings and spending goals over time.
          </p>
          <Button onClick={handleCreatePlan}>
            Create Your First Plan
          </Button>
        </EmptyState>
      ) : (
        <DraggableTable
          data={sortedPlans}
          columns={columns}
          onReorder={handleReorder}
          onRowClick={handlePlanClick}
          getRowKey={(plan) => plan.id}
          empty={
            <EmptyState>
              <h3>No Plans Yet</h3>
              <p>
                You haven't created any budget plans yet. Plans help you organize your 
                savings and spending goals over time.
              </p>
              <Button onClick={handleCreatePlan}>
                Create Your First Plan
              </Button>
            </EmptyState>
          }
        />
      )}

      <ConfirmationModal
        isOpen={showUpdateModal}
        onClose={handleUpdateCancel}
        onConfirm={handleUpdateBalances}
        title="Update Plan Balances"
        message={`This will add each plan's monthly amount to their current balance. This action is typically done once per month to reflect the planned savings/spending. Are you sure you want to proceed?`}
        confirmText="Update Balances"
        cancelText="Cancel"
        isLoading={updatingBalances}
        variant="info"
      />
    </Container>
  );
};

// Styled Components
const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 15px;
    align-items: stretch;
  }
`;

const HeaderActions = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: row;
    justify-content: space-between;
    gap: 10px;
  }
`;

const PlanInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`;

const PlanName = styled.div`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1rem;
  font-family: ${({ theme }) => theme.fonts.body};

  @media (max-width: 768px) {
    font-size: 0.875rem;
    line-height: 1.2;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    max-width: 150px; // Limit width on mobile
  }
`;

const AmountText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.success};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.body};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const BalanceText = styled.span`
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  font-size: 1.1rem;
  font-family: ${({ theme }) => theme.fonts.body};

  @media (max-width: 768px) {
    font-size: 1rem;
  }
`;

const ErrorMessage = styled.div`
  background: hsl(0, 100%, 95%);
  color: ${({ theme }) => theme.colors.danger};
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid hsl(0, 100%, 90%);
  font-family: ${({ theme }) => theme.fonts.body};
`;

const SuccessMessage = styled.div`
  background: hsl(158, 64%, 95%);
  color: ${({ theme }) => theme.colors.success};
  padding: 15px;
  border-radius: 8px;
  margin: 20px 0;
  border: 1px solid hsl(158, 64%, 90%);
  font-family: ${({ theme }) => theme.fonts.body};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 60px 20px;
  color: #6b7280;

  h3 {
    color: ${({ theme }) => theme.colors.primary};
    margin-bottom: 10px;
    font-family: ${({ theme }) => theme.fonts.heading || theme.fonts.body};
  }

  p {
    margin-bottom: 20px;
    line-height: 1.6;
    font-family: ${({ theme }) => theme.fonts.body};
  }

  @media (max-width: 768px) {
    padding: 40px 20px;
  }
`;
