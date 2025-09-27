import { ApiService } from './apiService';

export interface User {
  id: string;
  email: string;
  name: string;
  isActive: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface UserVerificationResponse {
  user: User;
  isAuthorized: boolean;
  budget?: any; // Will contain budget data if user exists
}

export class UserService {
  constructor(private apiService: ApiService) {}

  /**
   * Get or create user in the database - calls your backend POST endpoint
   * This will automatically create the user if they don't exist
   * @returns Promise<User>
   */
  async getOrCreateUser(): Promise<User> {
    try {
      const response = await this.apiService.post<User>('/user');
      return response.data;
    } catch (error: any) {
      // If there's a token issue (400)
      if (error.status === 400) {
        throw new Error('Invalid authentication token');
      }
      
      // If user exists but is inactive (403)
      if (error.status === 403) {
        throw new Error('User account is inactive');
      }
      
      // Other errors
      throw error;
    }
  }

  /**
   * Verify if the current user exists in the database and is authorized
   * @returns Promise<UserVerificationResponse>
   */
  async verifyUser(): Promise<UserVerificationResponse> {
    try {
      // Call the get-or-create endpoint
      const user = await this.getOrCreateUser();
      
      // Return successful verification response
      return {
        user,
        isAuthorized: user.isActive,
        budget: undefined // Budget data can be loaded separately if needed
      };
    } catch (error: any) {
      // Re-throw with appropriate error messages
      throw error;
    }
  }

  /**
   * Get current user profile
   * @returns Promise<User>
   */
  async getCurrentUser(): Promise<User> {
    const response = await this.apiService.get<User>('/user/profile');
    return response.data;
  }

  /**
   * Create a new user account (if auto-registration is enabled)
   * @returns Promise<User>
   */
  async createUser(): Promise<User> {
    const response = await this.apiService.post<User>('/user/create');
    return response.data;
  }
}
