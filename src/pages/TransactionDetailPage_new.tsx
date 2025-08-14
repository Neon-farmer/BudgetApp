import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useBudgetApi } from "../hooks/useBudgetApi";
import { Transaction, Envelope } from "../services/types";
import { ApiError } from "../services/apiService";
import { PageContainer as Container } from "../components/layout/PageContainer";
import { PageTitle } from "../components/layout/PageTitle";
import { Button } from "../components/Button";
import { Loading } from "../components/Loading";
import styled from "styled-components";

export const TransactionDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const budgetApi = useBudgetApi();

  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const [envelope, setEnvelope] = useState<Envelope | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id || isNaN(Number(id))) {
      setError("Invalid transaction ID");
      setLoading(false);
      return;
    }

    fetchTransactionData(Number(id));
  }, [id]);

  const fetchTransactionData = async (transactionId: number) => {
    setLoading(true);
    setError(null);

    try {
      // Fetch transaction details
      const transactionResponse = await budgetApi.getTransaction(transactionId);
      const transactionData = transactionResponse.data;
      setTransaction(transactionData);

      // Fetch envelope details
      if (transactionData.envelopeId) {
        const envelopeResponse = await budgetApi.getEnvelope(transactionData.envelopeId);
        setEnvelope(envelopeResponse.data);
      }
    } catch (err) {
      console.error("Failed to fetch transaction data:", err);
      if (err instanceof ApiError) {
        setError(`Failed to load transaction: ${err.message}`);
      } else {
        setError("Failed to load transaction");
      }
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const getTransactionType = (amount: number) => {
    return amount >= 0 ? 'Income' : 'Expense';
  };

  const handleBackToEnvelope = () => {
    if (envelope) {
      navigate(`/budget/envelope/${envelope.id}`);
    } else {
      navigate('/budget/envelopes');
    }
  };

  if (loading) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Transactions', path: '/budget/transactions' },
        { label: 'Loading...' }
      ]}>
        <Loading message="Loading transaction details..." size="lg" />
      </Container>
    );
  }

  if (error) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Transactions', path: '/budget/transactions' },
        { label: 'Error' }
      ]}>
        <PageTitle align="center">Error</PageTitle>
        <ErrorMessage>{error}</ErrorMessage>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/transactions')}>
            Back to Transactions
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  if (!transaction) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Transactions', path: '/budget/transactions' },
        { label: 'Not Found' }
      ]}>
        <PageTitle align="center">Transaction Not Found</PageTitle>
        <ButtonGroup>
          <Button onClick={() => navigate('/budget/transactions')}>
            Back to Transactions
          </Button>
        </ButtonGroup>
      </Container>
    );
  }

  return (
    <Container breadcrumbs={[
      { label: 'Home', path: '/budget/home' },
      { label: 'Transactions', path: '/budget/transactions' },
      { label: `Transaction #${transaction.id}` }
    ]}>
      <PageTitle align="center">Transaction Details</PageTitle>
      
      <DetailCard>
        <DetailRow>
          <DetailLabel>Amount</DetailLabel>
          <DetailValue $isPositive={transaction.amount >= 0}>
            {formatCurrency(Math.abs(transaction.amount))}
          </DetailValue>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Type</DetailLabel>
          <TransactionType $isPositive={transaction.amount >= 0}>
            {getTransactionType(transaction.amount)}
          </TransactionType>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Date</DetailLabel>
          <DetailText>{formatDate(transaction.date)}</DetailText>
        </DetailRow>

        <DetailRow>
          <DetailLabel>Envelope</DetailLabel>
          <EnvelopeLink onClick={handleBackToEnvelope}>
            {envelope ? envelope.name : 'Loading...'}
          </EnvelopeLink>
        </DetailRow>

        {transaction.notes && (
          <DetailRow>
            <DetailLabel>Description</DetailLabel>
            <DetailText>{transaction.notes}</DetailText>
          </DetailRow>
        )}
      </DetailCard>

      <ActionButtons>
        <Button onClick={handleBackToEnvelope}>
          View Envelope
        </Button>
        <Button onClick={() => navigate('/budget/transactions')}>
          All Transactions
        </Button>
      </ActionButtons>
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

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 0;
  border-bottom: 1px solid #f3f4f6;

  &:last-child {
    border-bottom: none;
  }
`;

const DetailLabel = styled.div`
  font-size: 0.875rem;
  color: #6b7280;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const DetailValue = styled.div<{ $isPositive: boolean }>`
  font-size: 1.5rem;
  font-weight: 700;
  color: ${({ $isPositive }) => $isPositive ? '#059669' : '#dc2626'};
`;

const DetailText = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: #374151;
`;

const TransactionType = styled.div<{ $isPositive: boolean }>`
  font-size: 1rem;
  font-weight: 600;
  color: ${({ $isPositive }) => $isPositive ? '#059669' : '#dc2626'};
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ $isPositive }) => $isPositive ? '#ecfdf5' : '#fef2f2'};
`;

const EnvelopeLink = styled.button`
  background: none;
  border: none;
  color: ${({ theme }) => theme.colors.primary};
  font-weight: 500;
  cursor: pointer;
  font-size: 1rem;
  
  &:hover {
    text-decoration: underline;
  }
`;

const ActionButtons = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;

const ErrorMessage = styled.div`
  background: #fef2f2;
  color: #dc2626;
  padding: 16px;
  border-radius: 8px;
  margin-bottom: 16px;
  border: 1px solid #fecaca;
  text-align: center;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 12px;
  justify-content: center;
`;
