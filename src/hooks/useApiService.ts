import { useMsal } from "@azure/msal-react";
import { useMemo } from "react";
import { AuthService } from "../services/authService";
import { ApiService } from "../services/apiService";

/**
 * Custom hook that provides access to the API service
 * This hook creates and returns instances of AuthService and ApiService
 * that are properly configured with the current MSAL instance
 */
export const useApiService = () => {
  const { instance } = useMsal();

  // Create service instances (memoized to prevent recreation on every render)
  const services = useMemo(() => {
    const authService = new AuthService(instance);
    const apiService = new ApiService(authService);

    return {
      authService,
      apiService,
    };
  }, [instance]);

  return services;
};

/**
 * Simplified hook that only returns the API service
 * Use this when you only need to make API calls
 */
export const useApi = () => {
  const { apiService } = useApiService();
  return apiService;
};

/**
 * Hook that provides authentication utilities
 * Use this when you need access to user info or auth status
 */
export const useAuth = () => {
  const { authService } = useApiService();
  
  return {
    authService,
    isAuthenticated: authService.isAuthenticated(),
    getUserInfo: () => authService.getUserInfo(),
    getActiveAccount: () => authService.getActiveAccount(),
  };
};
