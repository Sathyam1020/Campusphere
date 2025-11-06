import { API_CONFIG } from '@/config/constants';
import { apiClient } from '../api';
import {
    ApiResponse,
    AuthResponse,
    SignInRequest,
    SignUpRequest
} from '../types';

export class AuthService {
  /**
   * Sign in student
   */
  async signIn(credentials: SignInRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.STUDENT_SIGNIN,
      credentials
    );
  }

  /**
   * Sign up student
   */
  async signUp(userData: SignUpRequest): Promise<AuthResponse> {
    return apiClient.post<AuthResponse>(
      API_CONFIG.ENDPOINTS.AUTH.STUDENT_SIGNUP,
      userData
    );
  }

  /**
   * Sign out
   */
  async signOut(): Promise<ApiResponse> {
    // Clear localStorage token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth-token');
      console.log('💾 Cleared localStorage token');
    }
    
    return apiClient.post<ApiResponse>(
      API_CONFIG.ENDPOINTS.AUTH.SIGNOUT
    );
  }

  /**
   * Check account type
   */
  async getAccountType(): Promise<ApiResponse> {
    return apiClient.get<ApiResponse>(
      API_CONFIG.ENDPOINTS.ACCOUNT_TYPE
    );
  }
}

// Export singleton instance
export const authService = new AuthService();
export default authService;