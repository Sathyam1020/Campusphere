// hooks/use-account-type.ts
'use client';

import { getAccountType, type AccountTypeError, type AccountTypeResponse } from '@/lib/account';
import { useEffect, useState } from 'react';

export interface UseAccountTypeReturn {
  accountType: 'STUDENT' | 'TEACHER' | 'COLLEGE' | 'RECRUITER' | null;
  userId: string | null;
  email: string | null;
  isLoading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

/**
 * Custom hook to get and manage the current user's account type
 */
export function useAccountType(): UseAccountTypeReturn {
  const [accountType, setAccountType] = useState<'STUDENT' | 'TEACHER' | 'COLLEGE' | 'RECRUITER' | null>(null);
  const [userId, setUserId] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchAccountType = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      const result = await getAccountType();
      
      if ('accountType' in result) {
        const data = result as AccountTypeResponse;
        setAccountType(data.accountType);
        setUserId(data.userId);
        setEmail(data.email);
      } else {
        const errorData = result as AccountTypeError;
        setError(errorData.error);
        setAccountType(null);
        setUserId(null);
        setEmail(null);
      }
    } catch (err) {
      setError('Failed to fetch account type');
      setAccountType(null);
      setUserId(null);
      setEmail(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountType();
  }, []);

  return {
    accountType,
    userId,
    email,
    isLoading,
    error,
    refetch: fetchAccountType,
  };
}

/**
 * Hook that returns boolean values for account type checks
 */
export function useAccountTypeChecks() {
  const { accountType, isLoading } = useAccountType();

  return {
    isStudent: accountType === 'STUDENT',
    isTeacher: accountType === 'TEACHER',
    isCollegeAdmin: accountType === 'COLLEGE',
    isRecruiter: accountType === 'RECRUITER',
    isLoading,
  };
}