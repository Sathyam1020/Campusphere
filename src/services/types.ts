// Type definitions for API responses and data structures

// Common types
export interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
  error?: string;
  code?: string;
  details?: any;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  totalCount: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
  itemsPerPage: number;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: {
    [K in keyof T]: T[K];
  } & {
    pagination: PaginationMeta;
    filters?: Record<string, any>;
  };
}

// User types
export interface Student {
  id: string;
  email: string;
  name: string;
  bio?: string;
  githubUsername?: string;
  linkedin?: string;
  interests: string[];
  hobbies: string[];
  cgpa?: number;
  college: College;
  createdAt: string;
}

export interface College {
  id: string;
  name: string;
  location: string;
}

// Project types
export interface Project {
  id: string;
  title: string;
  description: string;
  githubUrl?: string;
  skills: string[];
  createdAt: string;
  addedBy: Student;
  teamMembers: ProjectMember[];
  userRole?: string;
  isUserCreator?: boolean;
  teamMemberCount: number;
}

export interface ProjectMember {
  id: string;
  role: string;
  addedAt: string;
  student: Pick<Student, 'id' | 'name' | 'email'>;
}

export interface CreateProjectRequest {
  title: string;
  description: string;
  githubUrl?: string;
  skills: string[];
  teamMembers?: {
    studentId: string;
    role?: string;
  }[];
}

export interface GetProjectsParams {
  page?: string;
  limit?: string;
  search?: string;
  sortBy?: 'createdAt' | 'title';
  sortOrder?: 'asc' | 'desc';
  includeTeamProjects?: string;
}

// Auth types
export interface SignInRequest {
  email: string;
  password: string;
}

export interface SignUpRequest {
  email: string;
  password: string;
  name: string;
  collegeId: string;
  bio?: string;
  githubUsername?: string;
  linkedin?: string;
  interests?: string[];
  hobbies?: string[];
  cgpa?: number;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  student: Student;
  token?: string; // TEMPORARY: For debugging cookie issues
}

// Query keys for React Query
export const QUERY_KEYS = {
  // Auth
  AUTH: ['auth'] as const,
  
  // Projects
  PROJECTS: ['projects'] as const,
  PROJECT: (id: string) => ['projects', id] as const,
  USER_PROJECTS: (params?: GetProjectsParams) => ['projects', 'user', params] as const,
  
  // Students
  STUDENTS: ['students'] as const,
  STUDENT: (id: string) => ['students', id] as const,
  
  // Colleges
  COLLEGES: ['colleges'] as const,
  COLLEGE: (id: string) => ['colleges', id] as const,
  
  // Account Type
  ACCOUNT_TYPE: ['account-type'] as const,
} as const;

// Mutation keys for consistency
export const MUTATION_KEYS = {
  // Auth
  SIGN_IN: 'signIn',
  SIGN_UP: 'signUp',
  SIGN_OUT: 'signOut',
  
  // Projects
  CREATE_PROJECT: 'createProject',
  UPDATE_PROJECT: 'updateProject',
  DELETE_PROJECT: 'deleteProject',
} as const;