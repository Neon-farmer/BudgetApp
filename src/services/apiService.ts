import { API_BASE_URL } from "../config/apiConfig";
import { AuthService } from "./authService";
import { handleAuthError } from "../utils/authRedirect";

/**
 * API Response wrapper
 */
export interface ApiResponse<T = any> {
  data: T;
  status: number;
  message?: string;
}

/**
 * API Error class for better error handling
 */
export class ApiError extends Error {
  public status: number;
  public response?: any;

  constructor(message: string, status: number, response?: any) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.response = response;
  }
}

/**
 * HTTP Methods enum
 */
export enum HttpMethod {
  GET = "GET",
  POST = "POST",
  PUT = "PUT",
  DELETE = "DELETE",
  PATCH = "PATCH",
}

/**
 * API Request options
 */
export interface ApiRequestOptions extends Omit<RequestInit, 'method'> {
  method?: HttpMethod;
  requiresAuth?: boolean;
}

/**
 * API Service
 * Centralized service for making HTTP requests with authentication
 */
export class ApiService {
  private authService: AuthService;
  private baseUrl: string;

  constructor(authService: AuthService, baseUrl: string = API_BASE_URL) {
    this.authService = authService;
    this.baseUrl = baseUrl;
  }

  /**
   * Make an authenticated API request
   * @param endpoint - API endpoint (without base URL)
   * @param options - Request options
   * @returns Promise<ApiResponse<T>>
   */
  async request<T = any>(
    endpoint: string,
    options: ApiRequestOptions = {}
  ): Promise<ApiResponse<T>> {
    const {
      method = HttpMethod.GET,
      requiresAuth = true,
      headers = {},
      ...restOptions
    } = options;

    // Prepare headers
    const requestHeaders: Record<string, string> = {
      "Content-Type": "application/json",
      ...(headers as Record<string, string>),
    };

    // Add authorization header if required
    if (requiresAuth) {
      try {
        const token = await this.authService.getAccessToken();
        requestHeaders.Authorization = `Bearer ${token}`;
      } catch (error) {
        // handleAuthError will redirect if it's an auth error
        const wasHandled = handleAuthError(error, "API authentication");
        
        if (wasHandled) {
          // If we're redirecting, still throw the error so the calling code knows
          throw new ApiError("Authentication failed - redirecting to login", 401, error);
        } else {
          // If it's not an auth error, throw generic auth error
          throw new ApiError("Authentication failed", 401, error);
        }
      }
    }

    // Prepare full URL
    const url = endpoint.startsWith('http') ? endpoint : `${this.baseUrl}${endpoint}`;

    try {
      console.log(`Making ${method} request to: ${url}`);
      
      const response = await fetch(url, {
        method,
        headers: requestHeaders,
        ...restOptions,
      });

      // Handle non-JSON responses
      let data: any;
      const contentType = response.headers.get("content-type");
      
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        data = await response.text();
      }

      if (!response.ok) {
        const apiError = new ApiError(
          data?.message || `Request failed with status ${response.status}`,
          response.status,
          data
        );
        
        // Check if this is an auth error from the server (401/403)
        if (response.status === 401 || response.status === 403) {
          handleAuthError(apiError, "API request");
        }
        
        throw apiError;
      }

      console.log(`API request successful:`, data);

      return {
        data,
        status: response.status,
        message: data?.message,
      };
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      console.error("API request failed:", error);
      throw new ApiError(
        "Network error or request failed",
        0,
        error
      );
    }
  }

  /**
   * GET request helper
   */
  async get<T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.GET });
  }

  /**
   * POST request helper
   */
  async post<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: HttpMethod.POST,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * PUT request helper
   */
  async put<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: HttpMethod.PUT,
      body: body ? JSON.stringify(body) : undefined,
    });
  }

  /**
   * DELETE request helper
   */
  async delete<T = any>(endpoint: string, options?: Omit<ApiRequestOptions, 'method'>): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, { ...options, method: HttpMethod.DELETE });
  }

  /**
   * PATCH request helper
   */
  async patch<T = any>(
    endpoint: string,
    body?: any,
    options?: Omit<ApiRequestOptions, 'method' | 'body'>
  ): Promise<ApiResponse<T>> {
    return this.request<T>(endpoint, {
      ...options,
      method: HttpMethod.PATCH,
      body: body ? JSON.stringify(body) : undefined,
    });
  }
}
