import { Transaction } from '../services/types';

/**
 * Filter transactions by date range
 * @param transactions Array of transactions to filter
 * @param startDate Start date (ISO format or Date object)
 * @param endDate End date (ISO format or Date object)
 * @returns Filtered transactions within the date range (inclusive)
 */
export const filterTransactionsByDateRange = (
  transactions: Transaction[],
  startDate: string | Date,
  endDate: string | Date
): Transaction[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  
  // Set end date to end of day (23:59:59)
  end.setHours(23, 59, 59, 999);

  return transactions.filter((tx) => {
    const txDate = new Date(tx.date);
    return txDate >= start && txDate <= end;
  });
};

/**
 * Filter transactions by envelope IDs
 * @param transactions Array of transactions to filter
 * @param envelopeIds Array of envelope IDs to include
 * @returns Filtered transactions matching the envelope IDs
 */
export const filterTransactionsByEnvelopes = (
  transactions: Transaction[],
  envelopeIds: number[]
): Transaction[] => {
  if (envelopeIds.length === 0) {
    return transactions;
  }

  return transactions.filter((tx) => envelopeIds.includes(tx.envelopeId));
};

/**
 * Exclude transactions that are transfers (description contains "transfer")
 * @param transactions Array of transactions to filter
 * @returns Transactions excluding transfers
 */
export const excludeTransfers = (transactions: Transaction[]): Transaction[] => {
  return transactions.filter(
    (tx) => !tx.notes.toLowerCase().includes('transfer')
  );
};

/**
 * Apply all filters to transactions
 * @param transactions Array of transactions to filter
 * @param startDate Start date for filtering
 * @param endDate End date for filtering
 * @param envelopeIds Array of envelope IDs to include (empty = all)
 * @param excludeTransfersFlag Whether to exclude transfers
 * @returns Fully filtered transactions
 */
export const applyTransactionFilters = (
  transactions: Transaction[],
  startDate: string | Date,
  endDate: string | Date,
  envelopeIds: number[] = [],
  excludeTransfersFlag: boolean = true
): Transaction[] => {
  let filtered = transactions;

  // Apply date range filter
  filtered = filterTransactionsByDateRange(filtered, startDate, endDate);

  // Apply envelope filter
  if (envelopeIds.length > 0) {
    filtered = filterTransactionsByEnvelopes(filtered, envelopeIds);
  }

  // Apply transfer exclusion
  if (excludeTransfersFlag) {
    filtered = excludeTransfers(filtered);
  }

  return filtered;
};

/**
 * Aggregate transactions by envelope
 * @param transactions Array of transactions to aggregate
 * @returns Object with envelopeId as key and sum of amounts as value
 */
export const aggregateByEnvelope = (
  transactions: Transaction[]
): Record<number, number> => {
  return transactions.reduce(
    (acc, tx) => {
      acc[tx.envelopeId] = (acc[tx.envelopeId] || 0) + Math.abs(tx.amount);
      return acc;
    },
    {} as Record<number, number>
  );
};

/**
 * Aggregate transactions by date
 * @param transactions Array of transactions to aggregate
 * @returns Array of objects with date and sum of amounts
 */
export const aggregateByDate = (
  transactions: Transaction[]
): Array<{ date: string; amount: number }> => {
  const aggregated = transactions.reduce(
    (acc, tx) => {
      const dateKey = new Date(tx.date).toISOString().split('T')[0]; // YYYY-MM-DD
      const existing = acc.find((item) => item.date === dateKey);
      if (existing) {
        existing.amount += Math.abs(tx.amount);
      } else {
        acc.push({ date: dateKey, amount: Math.abs(tx.amount) });
      }
      return acc;
    },
    [] as Array<{ date: string; amount: number }>
  );

  // Sort by date
  return aggregated.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
};
