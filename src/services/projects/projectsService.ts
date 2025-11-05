import { API_CONFIG } from '@/config/constants';
import { apiClient } from '../api';
import {
    ApiResponse,
    CreateProjectRequest,
    GetProjectsParams,
    PaginatedResponse,
    Project
} from '../types';

export class ProjectsService {
  /**
   * Get user projects with pagination and filtering
   */
  async getUserProjects(params?: GetProjectsParams): Promise<PaginatedResponse<{ projects: Project[] }>> {
    return apiClient.get<PaginatedResponse<{ projects: Project[] }>>(
      API_CONFIG.ENDPOINTS.STUDENT.PROJECTS,
      params as Record<string, string>
    );
  }

  /**
   * Create a new project
   */
  async createProject(projectData: CreateProjectRequest): Promise<ApiResponse<{ project: Project }>> {
    return apiClient.post<ApiResponse<{ project: Project }>>(
      API_CONFIG.ENDPOINTS.STUDENT.PROJECTS,
      projectData
    );
  }

  /**
   * Get project by ID
   */
  async getProject(id: string): Promise<ApiResponse<{ project: Project }>> {
    return apiClient.get<ApiResponse<{ project: Project }>>(
      `${API_CONFIG.ENDPOINTS.STUDENT.PROJECTS}/${id}`
    );
  }

  /**
   * Update project
   */
  async updateProject(id: string, projectData: Partial<CreateProjectRequest>): Promise<ApiResponse<{ project: Project }>> {
    return apiClient.put<ApiResponse<{ project: Project }>>(
      `${API_CONFIG.ENDPOINTS.STUDENT.PROJECTS}/${id}`,
      projectData
    );
  }

  /**
   * Delete project
   */
  async deleteProject(id: string): Promise<ApiResponse> {
    return apiClient.delete<ApiResponse>(
      `${API_CONFIG.ENDPOINTS.STUDENT.PROJECTS}/${id}`
    );
  }
}

// Export singleton instance
export const projectsService = new ProjectsService();
export default projectsService;