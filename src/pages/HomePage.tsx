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

  const handleStyleGuide = () => {
    navigate("/budget/style-guide");
  };

  const handleViewEnvelopes = () => {
    navigate("/budget/envelopes");
  };

  return (
    <Container maxWidth="800px" breadcrumbs={commonBreadcrumbs.home}>
      {/* <PageTitle align='center'>Home</PageTitle> */}

      <ActionGrid>
        <ActionCard
          title="Add Expense"
          description="Record a new expense transaction and deduct it from the selected envelope balance."
          buttonText="Add Expense"
          onClick={handleAddExpense}
        />
        <ActionCard
          title="View Envelopes"
          description="See all your budget envelopes, their current balances, and recent transactions."
          buttonText="View Envelopes"
          onClick={handleViewEnvelopes}
        />
        <ActionCard
          title="Add Income"
          description="Record new income and automatically allocate it to your envelopes through the planner."
          buttonText="Add Income"
          onClick={handleAddIncome}
        />
      </ActionGrid>
    </Container>
  );
};
