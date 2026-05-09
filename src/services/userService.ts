import { ApiService } from './apiService';

export interface User {
  id: number;
  azureADUserId: string;
  username: string;
  email: string;
  budgetId?: number | null;
  // keep isActive optional because API may not send it
  isActive?: boolean;
  // ...other fields...
}

export interface UserVerificationResponse {
  user: User;
  isAuthorized: boolean;
  budget?: any;
}

// Standalone helper functions. Use these from React where you have an ApiService
// instance (use the `useApi` hook to get one).

export async function getOrCreateUser(apiService: ApiService): Promise<User> {
  const res = await apiService.post('/user');
  const user = (res.data as unknown) as User;

  const normalized: User = {
    ...user,
    isActive: typeof user.isActive === 'boolean' ? user.isActive : true,
  };

  return normalized;
}

export async function verifyUser(apiService: ApiService): Promise<UserVerificationResponse> {
  const user = await getOrCreateUser(apiService);
  return {
    user,
    isAuthorized: typeof user.isActive === 'boolean' ? user.isActive : true,
    budget: undefined,
  };
}

export async function getCurrentUser(apiService: ApiService): Promise<User> {
  const response = await apiService.get('/user/profile');
  return (response.data as unknown) as User;
}

export async function createUser(apiService: ApiService): Promise<User> {
  const response = await apiService.post('/user/create');
  return (response.data as unknown) as User;
}
