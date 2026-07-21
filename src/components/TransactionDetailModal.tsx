import React from 'react';
import styled from 'styled-components';
import { Modal } from './Modal';
import { Transaction, Envelope } from '../services/types';

interface TransactionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  envelope: Envelope | null;
}

export const TransactionDetailModal: React.FC<TransactionDetailModalProps> = ({
  isOpen,
  onClose,
  transaction,
  envelope,
}) => {
  if (!transaction) return null;

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

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Transaction Details"
      size="md"
    >
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
          <DetailText>{envelope ? envelope.name : 'Loading...'}</DetailText>
        </DetailRow>

        {transaction.notes && (
          <DetailRow>
            <DetailLabel>Description</DetailLabel>
            <DetailText>{transaction.notes}</DetailText>
          </DetailRow>
        )}
      </DetailCard>
    </Modal>
  );
};

// Styled Components
const DetailCard = styled.div`
  padding: 0;
`;

const DetailRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 0;
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
  font-size: 0.875rem;
  font-weight: 600;
  color: ${({ $isPositive }) => $isPositive ? '#059669' : '#dc2626'};
  padding: 4px 12px;
  border-radius: 20px;
  background: ${({ $isPositive }) => $isPositive ? '#ecfdf5' : '#fef2f2'};
`;
