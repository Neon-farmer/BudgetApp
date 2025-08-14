import { useCallback } from 'react';
import { handleAuthError, isAuthError } from '../utils/authRedirect';

/**
 * Custom hook for handling authentication errors consistently across components
 */
export const useAuthErrorHandler = () => {
  /**
   * Handle an error, redirecting to login if it's an auth error
   * @param error - The error to handle
   * @param context - Optional context for logging
   * @returns boolean - true if the error was handled (auth error), false otherwise
   */
  const handleError = useCallback((error: any, context?: string) => {
    return handleAuthError(error, context);
  }, []);

  /**
   * Check if an error is an authentication error
   */
  const checkIsAuthError = useCallback((error: any) => {
    return isAuthError(error);
  }, []);

  /**
   * Wrapper for async operations that might fail with auth errors
   * This will automatically handle auth errors and redirect to login
   * @param asyncOperation - The async function to execute
   * @param context - Optional context for error logging
   * @returns Promise that resolves to the operation result or throws non-auth errors
   */
  const withAuthErrorHandling = useCallback(async <T>(
    asyncOperation: () => Promise<T>,
    context?: string
  ): Promise<T> => {
    try {
      return await asyncOperation();
    } catch (error) {
      const wasHandled = handleError(error, context);
      if (!wasHandled) {
        // If it wasn't an auth error, re-throw it
        throw error;
      }
      // If it was an auth error, we've redirected, so throw a specific error
      throw new Error('Authentication required - redirecting to login');
    }
  }, [handleError]);

  return {
    handleError,
    checkIsAuthError,
    withAuthErrorHandling
  };
};
