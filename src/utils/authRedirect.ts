/**
 * Authentication Redirect Utility
 * Handles redirects to login page when authentication fails
 */

/**
 * Redirect to login page
 * This function can be called from anywhere in the app to redirect to login
 */
export const redirectToLogin = (reason?: string) => {
  console.warn('Redirecting to login page:', reason || 'Authentication required');
  
  // Clear any existing authentication state if needed
  // You could add localStorage cleanup here if you store any auth data
  localStorage.removeItem('authToken'); // Clear any stored tokens
  sessionStorage.clear(); // Clear session data
  
  // Use window.location for reliable redirect that works from anywhere
  // This ensures the redirect works even from service workers or async contexts
  window.location.href = '/login';
};

/**
 * Check if an error is an authentication error that requires redirect
 */
export const isAuthError = (error: any): boolean => {
  // Check for various authentication error indicators
  if (error?.status === 401 || error?.status === 403) {
    return true;
  }
  
  if (error?.message?.includes('No active account')) {
    return true;
  }
  
  if (error?.message?.includes('Failed to acquire access token')) {
    return true;
  }
  
  if (error?.message?.includes('Authentication failed')) {
    return true;
  }
  
  if (error?.message?.includes('MSAL is not initialized')) {
    return true;
  }
  
  // MSAL specific errors
  if (error?.errorCode === 'user_login_error' || 
      error?.errorCode === 'no_account_error' ||
      error?.errorCode === 'interaction_required' ||
      error?.errorCode === 'login_required' ||
      error?.errorCode === 'consent_required') {
    return true;
  }
  
  // Handle MSAL error objects that might be nested
  if (error?.error?.errorCode) {
    return isAuthError(error.error);
  }
  
  return false;
};

/**
 * Handle authentication errors with automatic redirect
 */
export const handleAuthError = (error: any, context?: string) => {
  if (isAuthError(error)) {
    const reason = context ? `${context}: ${error.message}` : error.message;
    redirectToLogin(reason);
    return true; // Indicates we handled the error
  }
  return false; // Indicates we didn't handle the error
};
