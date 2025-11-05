import {
    useMutation,
    useQueryClient
} from '@tanstack/react-query';
import {
    MUTATION_KEYS,
    QUERY_KEYS,
    SignInRequest,
    SignUpRequest
} from '../types';
import { authService } from './authService';

/**
 * Hook for signing in
 */
export const useSignIn = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.SIGN_IN],
    mutationFn: (credentials: SignInRequest) => authService.signIn(credentials),
    onSuccess: (data) => {
      // Cache user data on successful sign in
      queryClient.setQueryData(QUERY_KEYS.AUTH, data.student);
    },
    onError: (error) => {
      console.error('Sign in error:', error);
    },
  });
};

/**
 * Hook for signing up
 */
export const useSignUp = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.SIGN_UP],
    mutationFn: (userData: SignUpRequest) => authService.signUp(userData),
    onSuccess: (data) => {
      // Cache user data on successful sign up
      queryClient.setQueryData(QUERY_KEYS.AUTH, data.student);
    },
    onError: (error) => {
      console.error('Sign up error:', error);
    },
  });
};

/**
 * Hook for signing out
 */
export const useSignOut = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: [MUTATION_KEYS.SIGN_OUT],
    mutationFn: () => authService.signOut(),
    onSuccess: () => {
      // Clear all cached data on sign out
      queryClient.clear();
    },
    onError: (error) => {
      console.error('Sign out error:', error);
    },
  });
};