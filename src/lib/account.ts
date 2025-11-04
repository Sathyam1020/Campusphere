// lib/account.ts
export interface AccountTypeResponse {
  success: boolean;
  accountType: 'STUDENT' | 'TEACHER' | 'COLLEGE' | 'RECRUITER';
  userId: string;
  email: string;
}

export interface AccountTypeError {
  error: string;
  code: string;
}

/**
 * Fetches the current user's account type from the API
 * @returns Promise<AccountTypeResponse | AccountTypeError>
 */
export async function getAccountType(): Promise<AccountTypeResponse | AccountTypeError> {
  try {
    const response = await fetch('/api/account-type', {
      method: 'GET',
      credentials: 'include', // Include cookies
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();

    if (!response.ok) {
      return data as AccountTypeError;
    }

    return data as AccountTypeResponse;
  } catch (error) {
    return {
      error: 'Failed to fetch account type',
      code: 'NETWORK_ERROR',
    };
  }
}

/**
 * Checks if the current user is a student
 */
export async function isStudent(): Promise<boolean> {
  const result = await getAccountType();
  return 'accountType' in result && result.accountType === 'STUDENT';
}

/**
 * Checks if the current user is a teacher
 */
export async function isTeacher(): Promise<boolean> {
  const result = await getAccountType();
  return 'accountType' in result && result.accountType === 'TEACHER';
}

/**
 * Checks if the current user is a college admin
 */
export async function isCollegeAdmin(): Promise<boolean> {
  const result = await getAccountType();
  return 'accountType' in result && result.accountType === 'COLLEGE';
}

/**
 * Checks if the current user is a recruiter
 */
export async function isRecruiter(): Promise<boolean> {
  const result = await getAccountType();
  return 'accountType' in result && result.accountType === 'RECRUITER';
}

/**
 * Redirects user to appropriate route based on account type
 */
export async function redirectToUserRoute(): Promise<void> {
  const result = await getAccountType();
  
  if ('accountType' in result) {
    switch (result.accountType) {
      case 'STUDENT':
        window.location.href = '/home';
        break;
      case 'TEACHER':
      case 'COLLEGE':
        window.location.href = '/dashboard';
        break;
      case 'RECRUITER':
        window.location.href = '/dashboard'; // Or a specific recruiter dashboard
        break;
      default:
        window.location.href = '/sign-in';
    }
  } else {
    window.location.href = '/sign-in';
  }
}