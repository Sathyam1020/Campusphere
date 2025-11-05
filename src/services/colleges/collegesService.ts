import { API_CONFIG } from '@/config/constants';
import { apiClient } from '../api';
import {
    ApiResponse,
    College
} from '../types';

export class CollegesService {
  /**
   * Get all colleges
   */
  async getColleges(): Promise<ApiResponse<{ colleges: College[] }>> {
    return apiClient.get<ApiResponse<{ colleges: College[] }>>(
      API_CONFIG.ENDPOINTS.COLLEGE
    );
  }

  /**
   * Get college by ID
   */
  async getCollege(id: string): Promise<ApiResponse<{ college: College }>> {
    return apiClient.get<ApiResponse<{ college: College }>>(
      `${API_CONFIG.ENDPOINTS.COLLEGE}/${id}`
    );
  }
}

// Export singleton instance
export const collegesService = new CollegesService();
export default collegesService;