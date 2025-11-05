# React Query Implementation Guide

This project now uses React Query (TanStack Query) for efficient data fetching, caching, and state management.

## 📁 Project Structure

```
src/
├── services/
│   ├── api.ts                 # Base API client
│   ├── types.ts              # Type definitions
│   ├── index.ts              # Main exports
│   ├── auth/
│   │   ├── authService.ts    # Auth API calls
│   │   ├── hooks.ts          # Auth React Query hooks
│   │   └── index.ts          # Auth exports
│   ├── projects/
│   │   ├── projectsService.ts # Projects API calls
│   │   ├── hooks.ts          # Projects React Query hooks
│   │   └── index.ts          # Projects exports
│   └── colleges/
│       ├── collegesService.ts # Colleges API calls
│       ├── hooks.ts          # Colleges React Query hooks
│       └── index.ts          # Colleges exports
└── components/
    ├── providers/
    │   ├── QueryProvider.tsx  # React Query provider
    │   └── index.ts
    └── examples/
        └── ProjectsList.tsx    # Example usage
```

## 🔧 Configuration

### API Configuration
The API base URL is configured in `src/config/constants.ts`:

```typescript
export const API_CONFIG = {
  BASE_URL: process.env.NODE_ENV === 'production' 
    ? process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'
    : 'http://localhost:3000',
  ENDPOINTS: {
    AUTH: {
      STUDENT_SIGNIN: '/api/auth/student/signin',
      STUDENT_SIGNUP: '/api/auth/student/signup',
      SIGNOUT: '/api/auth/signout',
    },
    STUDENT: {
      PROJECTS: '/api/student/project',
    },
    ACCOUNT_TYPE: '/api/account-type',
    COLLEGE: '/api/college',
  }
};
```

### React Query Provider
The `QueryProvider` is already set up in the root layout with optimal configurations:

- **Stale Time**: 1 minute default
- **Cache Time**: 10 minutes  
- **Retry Logic**: Smart retry based on error types
- **Dev Tools**: Available in development mode

## 🚀 Usage Examples

### 1. Fetching Projects

```typescript
import { useUserProjects } from '@/services';

function ProjectsComponent() {
  const { 
    data: projectsResponse, 
    isLoading, 
    isError, 
    error 
  } = useUserProjects({
    page: '1',
    limit: '10',
    search: 'react',
    includeTeamProjects: 'true'
  });

  const projects = projectsResponse?.data?.projects || [];
  
  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error: {error.message}</div>;
  
  return (
    <div>
      {projects.map(project => (
        <div key={project.id}>{project.title}</div>
      ))}
    </div>
  );
}
```

### 2. Creating a Project

```typescript
import { useCreateProject } from '@/services';
import { toast } from 'sonner';

function CreateProjectForm() {
  const createProject = useCreateProject({
    onSuccess: () => {
      toast.success('Project created successfully!');
    },
    onError: (error) => {
      toast.error(error.message);
    }
  });

  const handleSubmit = (projectData) => {
    createProject.mutate({
      title: 'My New Project',
      description: 'Project description',
      skills: ['React', 'TypeScript'],
      githubUrl: 'https://github.com/user/repo'
    });
  };

  return (
    <button 
      onClick={handleSubmit}
      disabled={createProject.isPending}
    >
      {createProject.isPending ? 'Creating...' : 'Create Project'}
    </button>
  );
}
```

### 3. Authentication

```typescript
import { useSignIn, useSignOut } from '@/services';

function AuthComponent() {
  const signIn = useSignIn();
  const signOut = useSignOut();

  const handleSignIn = () => {
    signIn.mutate({
      email: 'user@example.com',
      password: 'password123'
    });
  };

  return (
    <div>
      <button onClick={handleSignIn}>
        {signIn.isPending ? 'Signing in...' : 'Sign In'}
      </button>
      <button onClick={() => signOut.mutate()}>
        Sign Out
      </button>
    </div>
  );
}
```

## 🎯 Available Hooks

### Projects
- `useUserProjects(params?)` - Fetch user projects with pagination
- `useProject(id)` - Fetch single project
- `useCreateProject(options?)` - Create project mutation
- `useUpdateProject(options?)` - Update project mutation
- `useDeleteProject(options?)` - Delete project mutation

### Authentication
- `useSignIn(options?)` - Sign in mutation
- `useSignUp(options?)` - Sign up mutation
- `useSignOut(options?)` - Sign out mutation

### Colleges
- `useColleges(options?)` - Fetch all colleges
- `useCollege(id, options?)` - Fetch single college

## 💡 Best Practices

### 1. Error Handling
```typescript
const { data, isError, error } = useUserProjects();

if (isError) {
  // Handle different error types
  if (error.status === 401) {
    // Redirect to login
  } else if (error.status === 403) {
    // Show access denied message
  } else {
    // Show generic error
  }
}
```

### 2. Loading States
```typescript
const { isLoading, isFetching, isPending } = useUserProjects();

// isLoading: True for initial load
// isFetching: True when refetching data  
// isPending: True for mutations
```

### 3. Optimistic Updates
```typescript
const updateProject = useUpdateProject({
  onMutate: async (newProject) => {
    // Cancel outgoing refetches
    await queryClient.cancelQueries({ queryKey: ['projects'] });
    
    // Snapshot previous value
    const previousProjects = queryClient.getQueryData(['projects']);
    
    // Optimistically update
    queryClient.setQueryData(['projects'], old => {
      // Update logic here
    });
    
    return { previousProjects };
  },
  onError: (err, newProject, context) => {
    // Rollback on error
    queryClient.setQueryData(['projects'], context.previousProjects);
  },
});
```

## 🔄 Cache Management

React Query automatically handles caching, but you can manually control it:

```typescript
import { useQueryClient } from '@tanstack/react-query';

const queryClient = useQueryClient();

// Invalidate and refetch
queryClient.invalidateQueries({ queryKey: ['projects'] });

// Remove from cache
queryClient.removeQueries({ queryKey: ['projects', 'user'] });

// Clear all cache
queryClient.clear();
```

## 🛠 Extending the System

### Adding New Services

1. Create service directory: `src/services/newFeature/`
2. Add service class: `newFeatureService.ts`
3. Add hooks: `hooks.ts`
4. Export in `index.ts`
5. Add to main services index

### Adding New Endpoints

1. Update `API_CONFIG` in constants
2. Add types in `src/services/types.ts`
3. Add service methods
4. Create corresponding hooks

## 🐛 Debugging

### React Query DevTools
Available in development mode at the bottom-right corner. Shows:
- Active queries and their states
- Cache data
- Query invalidations
- Network requests

### Console Logging
All API errors are logged to console with full context in development mode.

## 📝 Environment Variables

For production, set:
```env
NEXT_PUBLIC_API_URL=https://your-api-domain.com
```