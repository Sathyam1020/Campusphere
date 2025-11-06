// Base API configuration and utilities
import { API_CONFIG } from '@/config/constants';

// Base API client
export class ApiClient {
  private baseURL: string;

  constructor() {
    this.baseURL = API_CONFIG.BASE_URL;
    // Debug logging only in development
    if (process.env.NODE_ENV === 'development') {
      console.log('🔍 API Client initialized with baseURL:', this.baseURL);
      console.log('🔍 Environment:', process.env.NODE_ENV);
      console.log('🔍 NEXT_PUBLIC_BASE_URL:', process.env.NEXT_PUBLIC_BASE_URL);
    }
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${this.baseURL}${endpoint}`;
    
    // Don't send Authorization header for auth endpoints (signin, signup)
    const isAuthEndpoint = endpoint.includes('/auth/') && 
                          (endpoint.includes('/signin') || endpoint.includes('/signup'));
    
    // Get token from localStorage as fallback for cookie issues
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        // Only add Authorization header if it's not an auth endpoint and we have a token
        ...(!isAuthEndpoint && token && { 'Authorization': `Bearer ${token}` }),
        ...options.headers,
      },
      credentials: 'include', // Include cookies for authentication
      ...options,
    };

    console.log('🌐 API Request:', { 
      url, 
      hasToken: !!token, 
      isAuthEndpoint,
      willSendAuth: !isAuthEndpoint && !!token 
    });

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error || `HTTP ${response.status}`,
          response.status,
          errorData.code,
          errorData.details
        );
      }

      return await response.json();
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      // Network or parsing error
      throw new ApiError(
        'Network error or invalid response',
        0,
        'NETWORK_ERROR'
      );
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string>): Promise<T> {
    let searchParams = '';
    if (params) {
      // Filter out undefined values before creating URLSearchParams
      const filteredParams = Object.entries(params).reduce((acc, [key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          acc[key] = value;
        }
        return acc;
      }, {} as Record<string, string>);
      
      if (Object.keys(filteredParams).length > 0) {
        searchParams = `?${new URLSearchParams(filteredParams)}`;
      }
    }
    
    return this.request<T>(`${endpoint}${searchParams}`, {
      method: 'GET',
    });
  }

  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async patch<T>(endpoint: string, data?: any): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PATCH',
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'DELETE',
    });
  }
}

// Custom error class for API errors
export class ApiError extends Error {
  constructor(
    message: string,
    public status: number,
    public code?: string,
    public details?: any
  ) {
    super(message);
    this.name = 'ApiError';
  }
}

// Singleton instance
export const apiClient = new ApiClient();

// Export for use in services
export default apiClient;