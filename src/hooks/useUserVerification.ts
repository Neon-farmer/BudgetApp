import { useState, useEffect } from 'react';
import { useMsal } from '@azure/msal-react';
import { UserService, User, UserVerificationResponse } from '../services/userService';
import { useApi } from './useApiService';

export enum UserVerificationStatus {
  LOADING = 'loading',
  VERIFIED = 'verified',
  INACTIVE = 'inactive',
  ERROR = 'error'
}

export interface UseUserVerificationResult {
  status: UserVerificationStatus;
  user: User | null;
  error: string | null;
  isLoading: boolean;
  isVerified: boolean;
  retry: () => void;
}

export const useUserVerification = (): UseUserVerificationResult => {
  const { instance } = useMsal();
  const apiService = useApi();
  const [status, setStatus] = useState<UserVerificationStatus>(UserVerificationStatus.LOADING);
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activeAccount = instance.getActiveAccount();
  const isAuthenticated = activeAccount != null;

  const verifyUser = async () => {
    if (!isAuthenticated) {
      setStatus(UserVerificationStatus.ERROR);
      setError('User not authenticated');
      return;
    }

    try {
      setStatus(UserVerificationStatus.LOADING);
      setError(null);

      const userService = new UserService(apiService);
      const result: UserVerificationResponse = await userService.verifyUser();

      if (result.user.isActive) {
        setUser(result.user);
        setStatus(UserVerificationStatus.VERIFIED);
      } else {
        setUser(result.user);
        setStatus(UserVerificationStatus.INACTIVE);
        setError('Your account has been deactivated. Please contact support.');
      }
    } catch (err: any) {
      console.error('User verification failed:', err);
      
      if (err.message?.includes('Invalid authentication token')) {
        setStatus(UserVerificationStatus.ERROR);
        setError('Authentication token is invalid. Please try signing in again.');
      } else if (err.message?.includes('inactive')) {
        setStatus(UserVerificationStatus.INACTIVE);
        setError('Your account has been deactivated. Please contact support.');
      } else {
        setStatus(UserVerificationStatus.ERROR);
        setError('Failed to verify user. Please try again.');
      }
      
      setUser(null);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      verifyUser();
    } else {
      setStatus(UserVerificationStatus.ERROR);
      setError('User not authenticated');
    }
  }, [isAuthenticated]);

  return {
    status,
    user,
    error,
    isLoading: status === UserVerificationStatus.LOADING,
    isVerified: status === UserVerificationStatus.VERIFIED,
    retry: verifyUser
  };
};
