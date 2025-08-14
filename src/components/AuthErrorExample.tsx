import React, { useState } from 'react';
import { useAuthErrorHandler } from '../hooks/useAuthErrorHandler';
import { useBudgetApi } from '../hooks/useBudgetApi';
import { Button } from './Button';

/**
 * Example component demonstrating how to use auth error handling
 * This can be used as a reference for implementing auth error handling in other components
 */
export const AuthErrorExample: React.FC = () => {
  const { withAuthErrorHandling } = useAuthErrorHandler();
  const budgetApi = useBudgetApi();
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  // Example 1: Using withAuthErrorHandling wrapper
  const handleApiCallWithWrapper = async () => {
    setLoading(true);
    setError(null);

    try {
      // This will automatically redirect to login if auth fails
      const result = await withAuthErrorHandling(
        () => budgetApi.getBudget(),
        'Budget API call'
      );
      
      setData(result.data);
    } catch (error: any) {
      // Only non-auth errors will reach here
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Example 2: Manual error handling
  const handleApiCallManual = async () => {
    setLoading(true);
    setError(null);

    try {
      const result = await budgetApi.getBudget();
      setData(result.data);
    } catch (error: any) {
      // Auth errors are automatically handled by the ApiService and AuthService
      // But you can add additional handling here if needed
      setError(error.message || 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: '20px' }}>
      <h3>Auth Error Handling Examples</h3>
      
      <div style={{ marginBottom: '20px' }}>
        <h4>Method 1: Using withAuthErrorHandling wrapper</h4>
        <Button onClick={handleApiCallWithWrapper} disabled={loading}>
          {loading ? 'Loading...' : 'Test API Call (with wrapper)'}
        </Button>
      </div>

      <div style={{ marginBottom: '20px' }}>
        <h4>Method 2: Automatic handling in services</h4>
        <Button onClick={handleApiCallManual} disabled={loading}>
          {loading ? 'Loading...' : 'Test API Call (automatic)'}
        </Button>
      </div>

      {error && (
        <div style={{ color: 'red', marginTop: '10px' }}>
          Error: {error}
        </div>
      )}

      {data && (
        <div style={{ marginTop: '10px' }}>
          <strong>Success!</strong> Data received: {JSON.stringify(data, null, 2)}
        </div>
      )}
    </div>
  );
};
