import { useQuery, UseQueryOptions } from '@tanstack/react-query';
import {
    ApiResponse,
    College,
    QUERY_KEYS
} from '../types';
import { collegesService } from './collegesService';

/**
 * Hook to get all colleges
 */
export const useColleges = (
  options?: UseQueryOptions<ApiResponse<{ colleges: College[] }>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.COLLEGES,
    queryFn: () => collegesService.getColleges(),
    staleTime: 10 * 60 * 1000, // 10 minutes - colleges don't change often
    ...options,
  });
};

/**
 * Hook to get a single college
 */
export const useCollege = (
  id: string,
  options?: UseQueryOptions<ApiResponse<{ college: College }>>
) => {
  return useQuery({
    queryKey: QUERY_KEYS.COLLEGE(id),
    queryFn: () => collegesService.getCollege(id),
    enabled: !!id,
    staleTime: 10 * 60 * 1000, // 10 minutes
    ...options,
  });
};