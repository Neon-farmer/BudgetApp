import React, { useEffect, useState, useMemo } from 'react';
import styled from 'styled-components';
import { useReportingData } from '../hooks/useReportingData';
import { TransactionReportChart } from '../components/TransactionReportChart';
import { TransactionReportList } from '../components/TransactionReportList';
import { TransactionDetailModal } from '../components/TransactionDetailModal';
import { applyTransactionFilters } from '../utils/filterTransactions';
import { Loading } from '../components/Loading';
import { PageContainer as Container } from '../components/layout/PageContainer';
import { PageTitle } from '../components/layout/PageTitle';
import { EnvelopeSelector } from '../components/EnvelopeSelector';
import { Label, Input, FormGroup, FormSection, Select } from '../components/Form';
import { Transaction, Envelope } from '../services/types';

const Subtitle = styled.p`
  color: var(--text-secondary, #666);
  font-size: 0.95rem;
  margin-bottom: 1rem;
`;

const ControlsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1.2rem;
  margin-bottom: 1.5rem;
`;

const DateRow = styled.div`
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;

  input {
    margin-bottom: 0;
    padding: 14px 16px;
    border: 2px solid #e5e7eb;
    border-radius: 10px;
    font-size: 1rem;
    font-family: inherit;
    transition: border-color 0.18s ease;
    touch-action: manipulation;
    box-sizing: border-box;
    width: 100%;

    @media (min-width: 768px) {
      padding: 12px 16px;
      border-radius: 8px;
    }
  }

  > div {
    margin-bottom: 0;
    flex: 1;
    min-width: 0;
  }

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 0.8rem;

    > div {
      flex: 1 1 100%;
    }
  }
`;

const EnvelopeFilterContainer = styled.div`
  width: 100%;
`;

const ChartsContainer = styled.div`
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
  margin-bottom: 2rem;
`;

const SummaryContainer = styled.div`
  margin-bottom: 2rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;

  @media (min-width: 900px) {
    grid-template-columns: repeat(4, 1fr);
  }

  @media (max-width: 600px) {
    grid-template-columns: repeat(2, 1fr);
  }
`;

const SummaryItem = styled.div<{ $color: string }>`
  padding: 1.5rem;
  background-color: white;
  border-radius: 8px;
  border-left: 4px solid ${({ $color }) => $color};
  display: flex;
  flex-direction: column;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);

  div:first-child {
    font-size: 0.85rem;
    color: var(--text-secondary, #666);
    margin-bottom: 0.75rem;
    font-weight: 500;
  }
`;

const SummaryValue = styled.span<{ $color: string }>`
  font-size: 1.8rem;
  font-weight: 700;
  color: ${({ $color }) => $color};
`;

const ErrorMessage = styled.div`
  padding: 1rem;
  background-color: #fee;
  border: 1px solid #fcc;
  border-radius: 4px;
  color: #c33;
  margin-bottom: 1.5rem;
`;

const TransactionTypeToggle = styled.button<{ $type: 'expenses' | 'income' }>`
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e5e7eb;
  border-radius: 8px;
  background: white;
  color: ${({ $type }) => ($type === 'expenses' ? '#dc2626' : '#059669')};
  cursor: pointer;
  font-family: inherit;
  font-size: 1rem;
  font-weight: 600;
  transition: all 0.2s ease;
  touch-action: manipulation;

  &:active {
    transform: scale(0.98);
  }

  &:hover {
    border-color: ${({ theme }) => theme.colors.primary};
    background: #f9fafb;
  }

  @media (max-width: 600px) {
    padding: 14px 16px;
  }
`;

/**
 * Transaction Report Page Component
 * Displays transaction analytics with date range filtering, envelope filtering, transaction type filtering, and visualizations
 */
export const ReportingPage: React.FC = () => {
  const { transactions, envelopes, loading, error } = useReportingData();
  const [startDate, setStartDate] = useState<string>('');
  const [endDate, setEndDate] = useState<string>('');
  const [selectedEnvelopeId, setSelectedEnvelopeId] = useState<number | null>(null); // null means all envelopes
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [selectedTransactionEnvelope, setSelectedTransactionEnvelope] = useState<Envelope | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [transactionTypeFilter, setTransactionTypeFilter] = useState<'expenses' | 'income'>('expenses');

  // Set default dates on mount (last 30 days)
  useEffect(() => {
    const today = new Date();
    const thirtyDaysAgo = new Date(today);
    thirtyDaysAgo.setDate(today.getDate() - 30);

    const formatDate = (date: Date): string => {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(thirtyDaysAgo));
    setEndDate(formatDate(today));
  }, []);

  // Filter transactions based on selected criteria
  const filteredTransactions = useMemo(() => {
    if (!startDate || !endDate || transactions.length === 0) {
      return [];
    }

    // If selectedEnvelopeId is null, show all; otherwise filter to single envelope
    const envelopeIds = selectedEnvelopeId !== null ? [selectedEnvelopeId] : [];

    const filtered = applyTransactionFilters(
      transactions,
      startDate,
      endDate,
      envelopeIds,
      true // Always exclude transfers
    );

    // Filter by transaction type
    if (transactionTypeFilter === 'expenses') {
      return filtered.filter((tx) => tx.amount < 0);
    } else {
      return filtered.filter((tx) => tx.amount >= 0);
    }
  }, [transactions, startDate, endDate, selectedEnvelopeId, transactionTypeFilter]);

  const handleEnvelopeChange = (envelopeId: string) => {
    // Empty string means "all envelopes"
    setSelectedEnvelopeId(envelopeId === '' ? null : Number(envelopeId));
  };

  const handleTransactionClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    // Find the corresponding envelope
    const envelope = envelopes.find(e => e.id === transaction.envelopeId);
    setSelectedTransactionEnvelope(envelope || null);
    setIsDetailModalOpen(true);
  };

  const handleCloseDetailModal = () => {
    setIsDetailModalOpen(false);
    setSelectedTransaction(null);
    setSelectedTransactionEnvelope(null);
  };

  // Calculate summary statistics
  const summaryStats = useMemo(() => {
    const totalAmount = filteredTransactions.reduce((sum, tx) => sum + tx.amount, 0);
    const transactionCount = filteredTransactions.length;
    const expenseAmount = filteredTransactions.filter(tx => tx.amount < 0).reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
    const incomeAmount = filteredTransactions.filter(tx => tx.amount >= 0).reduce((sum, tx) => sum + tx.amount, 0);
    
    // Calculate average monthly total
    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      const daysDiff = Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24));
      const monthsDiff = daysDiff / 30; // Approximate months
      const monthlyAverage = monthsDiff > 0 ? totalAmount / monthsDiff : 0;
      
      return {
        totalAmount,
        transactionCount,
        monthlyAverage,
        expenseAmount,
        incomeAmount,
      };
    }
    
    return {
      totalAmount: 0,
      transactionCount: 0,
      monthlyAverage: 0,
      expenseAmount: 0,
      incomeAmount: 0,
    };
  }, [filteredTransactions, startDate, endDate]);

  if (loading) {
    return (
      <Container breadcrumbs={[
        { label: 'Home', path: '/budget/home' },
        { label: 'Transaction Statistics' }
      ]}>
        <PageTitle>Transaction Statistics</PageTitle>
        <Loading />
      </Container>
    );
  }

  return (
    <Container breadcrumbs={[
      { label: 'Home', path: '/budget/home' },
      { label: 'Transaction Statistics' }
    ]}>
      <PageTitle>Transaction Statistics</PageTitle>

      {error && (
        <ErrorMessage>
          Error loading data: {error}
        </ErrorMessage>
      )}

      <ControlsContainer>
        <DateRow>
          <FormGroup>
            <Label htmlFor="start-date">Start Date</Label>
            <Input
              id="start-date"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
          </FormGroup>

          <FormGroup>
            <Label htmlFor="end-date">End Date</Label>
            <Input
              id="end-date"
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </FormGroup>
        </DateRow>

        <EnvelopeFilterContainer>
          <FormGroup>
            <Label htmlFor="envelope-filter">Filter by Envelope</Label>
            {envelopes.length > 0 ? (
              <EnvelopeSelector
                id="envelope-filter"
                envelopes={envelopes}
                value={selectedEnvelopeId === null ? '' : selectedEnvelopeId.toString()}
                onChange={(value) => handleEnvelopeChange(value)}
                placeholder="All Envelopes"
              />
            ) : (
              <div style={{ color: 'var(--text-secondary, #666)' }}>Loading envelopes...</div>
            )}
          </FormGroup>

          <FormGroup>
            <Label>Transaction Type</Label>
            <TransactionTypeToggle
              $type={transactionTypeFilter}
              onClick={() =>
                setTransactionTypeFilter(
                  transactionTypeFilter === 'expenses' ? 'income' : 'expenses'
                )
              }
            >
              {transactionTypeFilter === 'expenses' ? 'Expenses' : 'Income'}
            </TransactionTypeToggle>
          </FormGroup>
        </EnvelopeFilterContainer>
      </ControlsContainer>

      {filteredTransactions.length === 0 ? (
        <ErrorMessage>
          No transactions found for the selected date range and filters.
        </ErrorMessage>
      ) : (
        <>
          <SummaryContainer>
            <SummaryItem $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
              <div>Total Amount</div>
              <SummaryValue $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
                ${Math.abs(summaryStats.totalAmount).toFixed(2)}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
              <div>Average Monthly</div>
              <SummaryValue $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
                ${Math.abs(summaryStats.monthlyAverage).toFixed(2)}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
              <div>Total Transactions</div>
              <SummaryValue $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
                {summaryStats.transactionCount}
              </SummaryValue>
            </SummaryItem>
            <SummaryItem $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
              <div>Average Transaction</div>
              <SummaryValue $color={transactionTypeFilter === 'expenses' ? '#dc2626' : '#059669'}>
                ${summaryStats.transactionCount > 0 ? (Math.abs(summaryStats.totalAmount) / summaryStats.transactionCount).toFixed(2) : '0.00'}
              </SummaryValue>
            </SummaryItem>
          </SummaryContainer>

          <ChartsContainer>
            <TransactionReportChart
              transactions={filteredTransactions}
              envelopes={envelopes}
              chartType="pie"
            />
          </ChartsContainer>

          <TransactionReportList
            transactions={filteredTransactions}
            envelopes={envelopes}
            onRowClick={handleTransactionClick}
            showSummary={false}
          />
        </>
      )}

      <TransactionDetailModal
        isOpen={isDetailModalOpen}
        onClose={handleCloseDetailModal}
        transaction={selectedTransaction}
        envelope={selectedTransactionEnvelope}
      />
    </Container>
  );
};
