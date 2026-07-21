import React, { useMemo } from 'react';
import styled from 'styled-components';
import { Transaction, Envelope } from '../services/types';
import { Table, Column, AutoCurrencyCell } from './tables/Table';

const AmountValue = styled.span<{ $isExpense: boolean }>`
  color: ${({ $isExpense }) => $isExpense ? '#dc2626' : '#059669'};
  font-weight: 600;
`;

const SummaryContainer = styled.div`
  margin-top: 1.5rem;
  padding: 1rem;
  background-color: var(--bg-tertiary, #f5f5f5);
  border-radius: 4px;
  display: flex;
  justify-content: space-around;
  gap: 2rem;
  flex-wrap: wrap;

  @media (max-width: 600px) {
    flex-direction: column;
    gap: 1rem;
  }
`;

const SummaryItem = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;

  span:first-child {
    font-size: 0.9rem;
    color: var(--text-secondary, #666);
    margin-bottom: 0.25rem;
  }

  span:last-child {
    font-size: 1.3rem;
    font-weight: 600;
    color: var(--primary-color, #0066cc);
  }
`;

interface TransactionReportListProps {
  transactions: Transaction[];
  envelopes: Envelope[];
  onRowClick?: (transaction: Transaction) => void;
  showSummary?: boolean;
}

/**
 * Component to display transactions in a detailed table format using the app's standard Table component
 */
export const TransactionReportList: React.FC<TransactionReportListProps> = ({
  transactions,
  envelopes,
  onRowClick,
  showSummary = true,
}) => {
  // Create envelope lookup map
  const envelopeMap = useMemo(() => {
    return envelopes.reduce(
      (map, env) => {
        map[env.id] = env.name;
        return map;
      },
      {} as Record<number, string>
    );
  }, [envelopes]);

  // Define table columns (without description)
  const columns: Column<Transaction>[] = useMemo(
    () => [
      {
        key: 'date',
        header: 'Date',
        width: '25%',
        render: (value) =>
          new Date(value).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
      },
      {
        key: 'envelopeId',
        header: 'Envelope',
        width: '35%',
        render: (value) => envelopeMap[value as number] || `Envelope ${value}`,
      },
      {
        key: 'amount',
        header: 'Amount',
        width: '25%',
        align: 'right',
        render: (value, row: Transaction) => (
          <AmountValue $isExpense={row.amount < 0}>
            {row.amount < 0 ? '-' : '+'} ${Math.abs(value as number).toFixed(2)}
          </AmountValue>
        ),
      },
    ],
    [envelopeMap]
  );

  // Calculate totals
  const totalAmount = useMemo(() => {
    return transactions.reduce((sum, tx) => sum + Math.abs(tx.amount), 0);
  }, [transactions]);

  const transactionCount = transactions.length;

  return (
    <>
      <Table
        columns={columns}
        data={transactions}
        rowKey="id"
        hoverable
        empty={<div>No transactions to display</div>}
        onRowClick={onRowClick ? (row) => onRowClick(row) : undefined}
      />

      {showSummary && (
        <SummaryContainer>
          <SummaryItem>
            <span>Total Transactions</span>
            <span>{transactionCount}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Total Amount</span>
            <span>${totalAmount.toFixed(2)}</span>
          </SummaryItem>
          <SummaryItem>
            <span>Average</span>
            <span>
              ${transactionCount > 0 ? (totalAmount / transactionCount).toFixed(2) : '0.00'}
            </span>
          </SummaryItem>
        </SummaryContainer>
      )}
    </>
  );
};
