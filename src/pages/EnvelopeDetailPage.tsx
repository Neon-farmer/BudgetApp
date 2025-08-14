import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Envelope, Transaction, Plan, Budget } from "../services/types";
import { ApiError } from "../services/apiService";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import { Table, Column, AutoCurrencyCell } from "../components/tables/Table";
import { ConfirmationModal } from "../components/ConfirmationModal";
import styled from 'styled-components';

export const EnvelopeDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();

  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Define transaction table columns
  const transactionColumns: Column<Transaction>[] = [
    {
      key: 'date',
      header: 'Date',
      width: '25%',
      render: (value) => new Date(value).toLocaleDateString()
    },
    {
      key: 'notes',
      header: 'Description',
      width: '45%',
      render: (value) => value || 'No description'
    },
    {
      key: 'amount',
      header: 'Amount',
      width: '30%',
      align: 'right',
      render: (value) => <AutoCurrencyCell value={value} />
    }
  ];

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid envelope ID");
      setLoading(false);
      return;
    }

    fetchEnvelopeData(Number(id));
  }, [id]);

  const fetchEnvelopeData = async (envelopeId: number) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch budget first to get system envelope information
      const budgetResponse = await budgetApi.getBudget();
      if (!budgetResponse.data) {
        throw new Error("Failed to load budget information");
      }
      setBudget(budgetResponse.data);

      // Fetch envelope details
      const envelopeResponse = await budgetApi.getEnvelope(envelopeId);
      setEnvelope(envelopeResponse.data);

      // Fetch recent transactions (limit to 10)
      const transactionsResponse = await budgetApi.getTransactions(envelopeId);
      const recentTransactions = transactionsResponse.data
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);
      setTransactions(recentTransactions);

      // Fetch plans for this envelope
      const plansResponse = await budgetApi.getPlansByBudget(budgetResponse.data.id);
      const envelopePlans = plansResponse.data.filter(plan => plan.envelopeId === envelopeId);
      setPlans(envelopePlans);
    } catch (err) {
      console.error("Failed to fetch envelope data:", err);
      if (err instanceof ApiError) {
        setError(`Failed to load envelope: ${err.message}`);
      } else {
        setError("Failed to load envelope");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddTransaction = () => {
    navigate(`/budget/transaction/new/${id}`);
  };

  const handleTransactionClick = (transaction: Transaction) => {
    navigate(`/budget/transaction/${transaction.id}`);
  };

  const canDeleteEnvelope = (): { canDelete: boolean; reason?: string } => {
    if (!envelope || !budget) {
      return { canDelete: false, reason: "Envelope or budget information not loaded" };
    }

    // Check if envelope has a balance
    if (envelope.balance !== 0) {
      return { 
        canDelete: false, 
        reason: `Cannot delete envelope with a balance of ${formatCurrency(envelope.balance)}. Please transfer or spend the balance first.` 
      };
    }

    // Check if it's the tithe envelope
    if (budget.titheEnvelopeId === envelope.id) {
      return { 
        canDelete: false, 
        reason: "Cannot delete the tithe envelope. Please change the tithe envelope in budget settings first." 
      };
    }

    // Check if it's the default envelope
    if (budget.defaultEnvelopeId === envelope.id) {
      return { 
        canDelete: false, 
        reason: "Cannot delete the default envelope. Please change the default envelope in budget settings first." 
      };
    }

    // Check if it's a system envelope
    if (envelope.isSystemEnvelope) {
      return { 
        canDelete: false, 
        reason: "Cannot delete system envelopes." 
      };
    }

    return { canDelete: true };
  };

  const handleDeleteClick = () => {
    const validation = canDeleteEnvelope();
    if (validation.canDelete) {
      setShowDeleteModal(true);
    }
    // No need to set error here anymore - tooltip handles it
  };

  const handleDeleteConfirm = async () => {
    if (!envelope) return;

    setIsDeleting(true);
    try {
      await budgetApi.deleteEnvelope(envelope.id);
      navigate('/budget/envelopes', { 
        replace: true,
        state: { message: `Envelope "${envelope.name}" has been deleted successfully.` }
      });
    } catch (err) {
      console.error("Failed to delete envelope:", err);
      if (err instanceof ApiError) {
        setError(`Failed to delete envelope: ${err.message}`);
      } else {
        setError("Failed to delete envelope");
      }
    } finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleDeleteCancel = () => {
    setShowDeleteModal(false);
  };

  // Calculate planned balance (current balance + total plan balance)
  const calculatePlannedBalance = () => {
    if (!envelope) return 0;
    const totalPlanBalance = plans.reduce((sum, plan) => sum + plan.planBalance, 0);
    return envelope.balance + totalPlanBalance;
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Envelopes', path: '/budget/envelopes' },
        { label: 'Loading...' }
      ]}>
        <Loading message="Loading envelope details..." size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Envelopes', path: '/budget/envelopes' },
        { label: 'Error' }
      ]}>
        <PageTitle align="center">Error</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/envelopes')}>
            Back to Envelopes
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  if (!envelope) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Envelopes', path: '/budget/envelopes' },
        { label: 'Not Found' }
      ]}>
        <PageTitle align="center">Envelope Not Found</PageTitle>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/envelopes')}>
            Back to Envelopes
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <Container breadcrumbs={[
      { label: 'Home', path: '/budget/home' },
      { label: 'Envelopes', path: '/budget/envelopes' },
      { label: envelope.name }
    ]}>
      <PageTitle align="center">{envelope.name}</PageTitle>
      
      <DetailCard>
        <DetailSection>
          <DetailLabel>Current Balance</DetailLabel>
          <DetailValue $isPositive={envelope.balance >= 0}>
            {formatCurrency(envelope.balance)}
          </DetailValue>
        </DetailSection>
        
        <DetailSection>
          <DetailLabel>Planned Balance</DetailLabel>
          <DetailValue2 $isPositive={calculatePlannedBalance() >= 0}>
            {formatCurrency(calculatePlannedBalance())}
          </DetailValue2>
        </DetailSection>
      </DetailCard>

      <ActionButtons>
        <Button onClick={handleAddTransaction}>
          Add Transaction
        </Button>
        <Button 
          color="danger" 
          onClick={handleDeleteClick}
          disabled={!canDeleteEnvelope().canDelete}
          tooltip={!canDeleteEnvelope().canDelete ? canDeleteEnvelope().reason : undefined}
        >
          Delete Envelope
        </Button>
      </ActionButtons>

      <SectionHeader>
        <SectionTitle>Recent Transactions</SectionTitle>
      </SectionHeader>

      {transactions.length === 0 ? (
        <EmptyState>
          <EmptyMessage>No transactions found for this envelope.</EmptyMessage>
          <Button onClick={handleAddTransaction}>
            Add First Transaction
          </Button>
        </EmptyState>
      ) : (
        <Table
          columns={transactionColumns}
          data={transactions}
          onRowClick={handleTransactionClick}
          rowKey="id"
          hoverable
          striped
        />
      )}

      <ConfirmationModal
        isOpen={showDeleteModal}
        onConfirm={handleDeleteConfirm}
        onClose={handleDeleteCancel}
        title="Delete Envelope"
        message={`Are you sure you want to delete the envelope "${envelope?.name}"? This action cannot be undone.`}
        confirmText="Delete Envelope"
        variant="danger"
        isLoading={isDeleting}
      />
    </Container>
  );
};

// Styled Components
const DetailCard = styled.div`
  background: white;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 24px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  border: 1px solid #e5e7eb;
`;

const DetailSection = styled.div`
  text-align: center;
  margin-bottom: 16px;
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  margin-bottom: 8px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const DetailValue = styled.div<{ $isPositive: boolean }>`
  font-size: 2.5rem;
  font-weight: 700;
  color: ${({ $isPositive, theme }) => $isPositive ? theme.colors.success : theme.colors.danger};
  line-height: 1;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const DetailValue2 = styled.div<{ $isPositive: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isPositive, theme }) => $isPositive ? theme.colors.success : theme.colors.danger};
  line-height: 1;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-bottom: 32px;
`;

const SectionHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
`;

const SectionTitle = styled.h2`
  font-size: 1.25rem;
  font-weight: 600;
  color: ${({ theme }) => theme.colors.primary};
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.heading};
`;

const EmptyState = styled.div`
  text-align: center;
  padding: 48px 24px;
  background: #f9fafb;
  border-radius: 8px;
  border: 2px dashed #d1d5db;
`;

const EmptyMessage = styled.p`
  color: #6b7280;
  font-size: 1rem;
  margin-bottom: 16px;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #fecaca;
  text-align: center;
  font-family: ${({ theme }) => theme.fonts.body};
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;
