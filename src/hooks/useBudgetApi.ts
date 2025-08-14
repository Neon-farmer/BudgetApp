import { useMemo } from "react";
import { useApiService } from "./useApiService";
import { BudgetApiService } from "../services/budgetApiService";

/**
 * Custom hook that provides access to the Budget API service
 * This hook creates a BudgetApiService instance with the configured ApiService
 */
export const useBudgetApi = () => {
  const { apiService } = useApiService();

  // Create BudgetApiService instance (memoized to prevent recreation)
  const budgetApiService = useMemo(() => {
    return new BudgetApiService(apiService);
  }, [apiService]);

  return budgetApiService;
};
