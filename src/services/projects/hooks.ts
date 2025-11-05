import {
    useMutation,
    UseMutationOptions,
    useQuery,
    useQueryClient,
    UseQueryOptions
} from '@tanstack/react-query';
import {
    ApiResponse,
    CreateProjectRequest,
    GetProjectsParams,
    MUTATION_KEYS,
    PaginatedResponse,
    Project,
    QUERY_KEYS
} from '../types';
import { projectsService } from './projectsService';

/**
 * Hook to get user projects
 */
export const useUserProjects = (
  params?: GetProjectsParams,
  options?: UseQueryOptions<PaginatedResponse<{ projects: Project[] }>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.USER_PROJECTS(params),
    queryFn: () => projectsService.getUserProjects(params),
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to get a single project
 */
export const useProject = (
  id: string,
  options?: UseQueryOptions<ApiResponse<{ project: Project }>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.PROJECT(id),
    queryFn: () => projectsService.getProject(id),
    enabled: !!id,
    staleTime: 5 * 60 * 1000, // 5 minutes
    ...options,
  });
};

/**
 * Hook to create a project
 */
export const useCreateProject = (
  options?: UseMutationOptions<
    ApiResponse<{ project: Project }>,
    Error,
    CreateProjectRequest
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.CREATE_PROJECT],
    mutationFn: (projectData: CreateProjectRequest) => 
      projectsService.createProject(projectData),
    onSuccess: (data, variables) => {
      console.log('🎉 Project created successfully, invalidating cache...');
      
      // Invalidate all project-related queries
      queryClient.invalidateQueries({ 
        queryKey: QUERY_KEYS.PROJECTS,
        exact: false 
      });
      
      // Force refetch of user projects queries specifically
      queryClient.refetchQueries({ 
        queryKey: ['projects', 'user'],
        exact: false 
      });
      
      console.log('✅ Cache invalidated and refetch triggered, new project should appear in list');
      
      // Add the new project to the cache
      if (data.data?.project) {
        queryClient.setQueryData(
          QUERY_KEYS.PROJECT(data.data.project.id), 
          data
        );
      }
    },
    ...options,
  });
};

/**
 * Hook to update a project
 */
export const useUpdateProject = (
  options?: UseMutationOptions<
    ApiResponse<{ project: Project }>,
    Error,
    { id: string; projectData: Partial<CreateProjectRequest> }
  >
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.UPDATE_PROJECT],
    mutationFn: ({ id, projectData }) => 
      projectsService.updateProject(id, projectData),
    onSuccess: (data, variables) => {
      // Invalidate all user project queries (with any params)
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'user'],
        exact: false 
      });
      
      // Also invalidate the general projects queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      
      // Update the specific project in cache
      if (data.data?.project) {
        queryClient.setQueryData(
          QUERY_KEYS.PROJECT(variables.id), 
          data
        );
      }
    },
    ...options,
  });
};

/**
 * Hook to delete a project
 */
export const useDeleteProject = (
  options?: UseMutationOptions<ApiResponse, Error, string>
) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.DELETE_PROJECT],
    mutationFn: (id: string) => projectsService.deleteProject(id),
    onSuccess: (data, projectId) => {
      // Invalidate all user project queries (with any params)
      queryClient.invalidateQueries({ 
        queryKey: ['projects', 'user'],
        exact: false 
      });
      
      // Also invalidate the general projects queries
      queryClient.invalidateQueries({ queryKey: QUERY_KEYS.PROJECTS });
      
      // Remove the project from cache
      queryClient.removeQueries({ queryKey: QUERY_KEYS.PROJECT(projectId) });
    },
    ...options,
  });
};