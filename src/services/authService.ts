import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { loginRequest } from "../config/authConfig";
import { handleAuthError } from "../utils/authRedirect";

/**
 * Authentication Service
 * Handles token acquisition and management for API calls
 */
export class AuthService {
  private msalInstance: IPublicClientApplication;

  constructor(msalInstance: IPublicClientApplication) {
    this.msalInstance = msalInstance;
  }

  /**
   * Get a valid access token for API calls
   * @returns Promise<string> - The access token
   * @throws Error if no active account or token acquisition fails
   */
  async getAccessToken(): Promise<string> {
    try {
      const account = this.getActiveAccount();
      if (!account) {
        const error = new Error("No active account found. Please log in.");
        handleAuthError(error, "Token acquisition");
        throw error;
      }

      // Try to get token silently first
      const response = await this.msalInstance.acquireTokenSilent({
        ...loginRequest,
        account,
      });

      return response.accessToken;
    } catch (error) {
      console.error("Token acquisition failed:", error);
      
      // Check if this is an auth error that requires redirect
      const wasHandled = handleAuthError(error, "Token acquisition");
      
      if (!wasHandled) {
        // If it wasn't an auth error, throw a generic error
        throw new Error("Failed to acquire access token");
      } else {
        // Re-throw the original error after handling redirect
        throw error;
      }
    }
  }

  /**
   * Get the currently active account
   * @returns AccountInfo | null
   */
  getActiveAccount(): AccountInfo | null {
    return this.msalInstance.getActiveAccount();
  }

  /**
   * Check if user is authenticated
   * @returns boolean
   */
  isAuthenticated(): boolean {
    const account = this.getActiveAccount();
    return account !== null;
  }

  /**
   * Get user information from the active account
   * @returns object with user info or null
   */
  getUserInfo() {
    const account = this.getActiveAccount();
    if (!account) return null;

    return {
      id: account.homeAccountId,
      username: account.username,
      name: account.name,
      email: account.username,
    };
  }
}
