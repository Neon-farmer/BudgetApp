import { useEffect, useState } from 'react';
import { Transaction, Envelope } from '../services/types';
import { useBudgetApi } from './useBudgetApi';
import { ApiError } from '../services/apiService';

interface ReportingData {
  transactions: Transaction[];
  envelopes: Envelope[];
  loading: boolean;
  error: string | null;
}

const extractErrorMessage = (err: any): string => {
  if (err instanceof ApiError) {
    // Check if it's a 403 (permission denied)
    if (err.status === 403) {
      return 'You do not have permission to access transaction data. Please contact your administrator.';
    }
    // Check if it's a 401 (unauthorized)
    if (err.status === 401) {
      return 'Your session has expired. Please log in again.';
    }
    return err.message || `API Error (${err.status})`;
  }
  if (err instanceof Error) {
    return err.message;
  }
  return 'An unexpected error occurred while loading data';
};

/**
 * Hook to fetch all transactions and envelopes for reporting
 * Fetches transactions for each envelope individually since the API requires envelopeId
 * @returns Object containing transactions, envelopes, loading state, and any error
 */
export const useReportingData = (): ReportingData => {
  const budgetApi = useBudgetApi();
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [envelopes, setEnvelopes] = useState<Envelope[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get budget info first to get the budget ID
        console.log('Fetching budget data...');
        const budgetResponse = await budgetApi.getBudget();
        if (!budgetResponse.data) {
          throw new Error('Failed to load budget data');
        }

        // Fetch envelopes using the dedicated endpoint
        console.log('Fetching envelopes...');
        const envelopesResponse = await budgetApi.getEnvelopes(budgetResponse.data.id);
        const budgetEnvelopes = envelopesResponse.data || [];
        setEnvelopes(budgetEnvelopes);

        // Fetch transactions for each envelope and combine them
        console.log(`Fetching transactions for ${budgetEnvelopes.length} envelopes...`);
        const allTransactions: Transaction[] = [];

        for (const envelope of budgetEnvelopes) {
          try {
            const transactionsResponse = await budgetApi.getTransactions(envelope.id);
            if (transactionsResponse.data && Array.isArray(transactionsResponse.data)) {
              allTransactions.push(...transactionsResponse.data);
            }
          } catch (envelopeErr) {
            console.warn(`Failed to fetch transactions for envelope ${envelope.id}:`, envelopeErr);
            // Continue with other envelopes if one fails
          }
        }

        setTransactions(allTransactions);
      } catch (err) {
        const errorMessage = extractErrorMessage(err);
        console.error('Error fetching reporting data:', err);
        setError(errorMessage);
        setTransactions([]);
        setEnvelopes([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [budgetApi]);

  return { transactions, envelopes, loading, error };
};
