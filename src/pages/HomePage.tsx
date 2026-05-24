import React from "react";
import { useNavigate } from "react-router-dom";
import { ActionCard, ActionGrid } from "../components/ActionCard";
import {
  PageContainer as Container,
  commonBreadcrumbs,
} from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";

export const HomePage = () => {
  const navigate = useNavigate();

  const handleAddIncome = () => {
    navigate("/budget/add-income");
  };

  const handleAddExpense = () => {
    navigate("/budget/add-expense");
  };

  const handleTransferMoney = () => {
    navigate("/budget/transaction/new");
  };

  const handleViewPlanner = () => {
    navigate("/budget/planner");
  };

  const handleStyleGuide = () => {
    navigate("/budget/style-guide");
  };

  const handleViewEnvelopes = () => {
    navigate("/budget/envelopes");
  };

  return (
    <Container maxWidth="800px" breadcrumbs={commonBreadcrumbs.home}>
      {/* <PageTitle align='center'>Home</PageTitle> */}

      <DesktopLift>
        <ActionGrid>
        <ActionCard
          title="Add Expense"
          description="Record a new expense transaction and deduct it from the selected envelope balance."
          buttonText="Add Expense"
          onClick={handleAddExpense}
        />
        <ActionCard
          title="Add Income"
          description="Record new income and automatically allocate it to your envelopes through the planner."
          buttonText="Add Income"
          onClick={handleAddIncome}
        />
        <ActionCard
          title="View Envelopes"
          description="See all your budget envelopes, their current balances, and recent transactions."
          buttonText="View Envelopes"
          onClick={handleViewEnvelopes}
        />
        <ActionCard
          title="View Planner"
          description="Manage your monthly budget plans and allocations across your envelopes."
          buttonText="View Planner"
          onClick={handleViewPlanner}
        />
        <ActionCard
          title="Transfer Money"
          description="Move money between two of your envelopes to redistribute your budget allocation."
          buttonText="Transfer Money"
          onClick={handleTransferMoney}
        />
        
      </ActionGrid>
      </DesktopLift>
    </Container>
  );
};

// Small helper to lift the content up on desktop only (fix offset without touching mobile)
import styled from 'styled-components';

const DesktopLift = styled.div`
  @media (min-width: 768px) {
    margin-top: -12px; /* nudge up slightly to counteract extra desktop spacing */
  }
`;
