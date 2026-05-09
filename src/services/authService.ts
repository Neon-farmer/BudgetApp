import { IPublicClientApplication, AccountInfo } from "@azure/msal-browser";
import { loginRequest, apiRequest } from "../config/authConfig";
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
  async getAccessToken(): Promise<string | null> {
    const accounts = this.msalInstance.getAllAccounts();
    if (!accounts.length) return null;

    try {
      const resp = await this.msalInstance.acquireTokenSilent({
        account: accounts[0],
        scopes: apiRequest.scopes,
      });
      console.log("TOKEN AUD:", this.parseJwt(resp.accessToken)?.aud);
      return resp.accessToken;
    } catch (e) {
      console.log("acquireTokenSilent failed, fallback to popup", e);
      const resp = await this.msalInstance.acquireTokenPopup({
        account: accounts[0],
        scopes: apiRequest.scopes,
      });
      console.log("TOKEN AUD:", this.parseJwt(resp.accessToken)?.aud);
      return resp.accessToken;
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

  /**
   * Helper method to parse JWT token
   * @param token - The JWT token string
   * @returns Parsed token payload or null if invalid token
   */
  private parseJwt(token: string): any {
    try {
      const payload = token.split(".")[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (error) {
      console.error("Failed to parse JWT token:", error);
      return null;
    }
  }
}
