# Role-Based Access Control (RBAC) Documentation

This document explains the role-based access control system implemented in the Campusphere application.

## Overview

The RBAC system consists of:
1. Account Type API endpoint
2. Middleware for server-side route protection
3. Client-side hooks and components for role management
4. Role guards for protecting React components

## Account Types

The system supports four account types:
- `STUDENT` - Student users
- `TEACHER` - Teacher users  
- `COLLEGE` - College admin users
- `RECRUITER` - Recruiter users

## API Endpoint

### GET /api/account-type

Returns the current user's account type based on their authentication token.

**Response:**
```json
{
  "success": true,
  "accountType": "STUDENT",
  "userId": "user_123",
  "email": "user@example.com"
}
```

**Error Response:**
```json
{
  "error": "Authentication required",
  "code": "UNAUTHORIZED"
}
```

## Middleware Protection

The middleware automatically redirects users based on their account type:

### Route Protection Rules:
- **Student routes** (`/(student)/*`, `/home/*`): Only accessible by users with `STUDENT` account type
- **Teacher routes** (`/(teacher)/*`, `/dashboard/*`): Only accessible by users with `COLLEGE` account type (teachers/admins)
- **API routes** (`/api/*`): Require valid authentication token

### Automatic Redirects:
- Students trying to access teacher routes → redirected to `/home`
- Teachers/admins trying to access student routes → redirected to `/dashboard`
- Unauthenticated users → redirected to `/sign-in`

## Client-Side Usage

### 1. Using the Account Type Hook

```tsx
import { useAccountType } from '@/hooks/use-account-type';

function MyComponent() {
  const { accountType, userId, email, isLoading, error, refetch } = useAccountType();
  
  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  
  return (
    <div>
      <p>Account Type: {accountType}</p>
      <p>Email: {email}</p>
    </div>
  );
}
```

### 2. Using Account Type Checks

```tsx
import { useAccountTypeChecks } from '@/hooks/use-account-type';

function MyComponent() {
  const { isStudent, isTeacher, isCollegeAdmin, isRecruiter } = useAccountTypeChecks();
  
  return (
    <div>
      {isStudent && <StudentContent />}
      {isTeacher && <TeacherContent />}
      {isCollegeAdmin && <AdminContent />}
      {isRecruiter && <RecruiterContent />}
    </div>
  );
}
```

### 3. Using Role Guards

Role guards protect entire components or pages from unauthorized access:

```tsx
import { RoleGuard, StudentOnly, TeacherOnly, StaffOnly } from '@/components/auth/RoleGuard';

// Generic role guard
function ProtectedComponent() {
  return (
    <RoleGuard allowedRoles={['STUDENT', 'TEACHER']}>
      <SomeComponent />
    </RoleGuard>
  );
}

// Student-only component
function StudentComponent() {
  return (
    <StudentOnly>
      <StudentDashboard />
    </StudentOnly>
  );
}

// Teacher-only component
function TeacherComponent() {
  return (
    <TeacherOnly>
      <TeacherDashboard />
    </TeacherOnly>
  );
}

// Staff (teacher + admin) only
function StaffComponent() {
  return (
    <StaffOnly>
      <StaffPanel />
    </StaffOnly>
  );
}
```

### 4. Using Utility Functions

```tsx
import { getAccountType, isStudent, redirectToUserRoute } from '@/lib/account';

// Get account type programmatically
const accountInfo = await getAccountType();
if ('accountType' in accountInfo) {
  console.log('User is:', accountInfo.accountType);
}

// Check if user is a student
const userIsStudent = await isStudent();

// Redirect to appropriate route based on account type
await redirectToUserRoute();
```

## Layout Protection

To protect entire route groups, add role guards to layout components:

### Student Layout Protection
```tsx
// app/(student)/home/layout.tsx
import { StudentOnly } from '@/components/auth/RoleGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StudentOnly>
      {/* Layout content */}
      {children}
    </StudentOnly>
  );
}
```

### Teacher Layout Protection
```tsx
// app/(teacher)/layout.tsx
import { StaffOnly } from '@/components/auth/RoleGuard';

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <StaffOnly>
      {/* Layout content */}
      {children}
    </StaffOnly>
  );
}
```

## Example Implementation

The `AccountInfo` component demonstrates how to use the account type system:

```tsx
import { AccountInfo } from '@/components/AccountInfo';

function HomePage() {
  return (
    <div>
      <h1>Dashboard</h1>
      <AccountInfo />
    </div>
  );
}
```

## Security Notes

1. **Server-side protection is primary** - The middleware provides the main security layer
2. **Client-side guards are UX enhancement** - They improve user experience but don't replace server-side security
3. **Token validation** - All requests are validated against JWT tokens
4. **Automatic cleanup** - Invalid tokens are automatically cleared from cookies

## Migration Guide

If you have existing routes that need protection:

1. **Add middleware protection** by updating the `matcher` in `middleware.ts`
2. **Wrap layouts** with appropriate role guards
3. **Replace manual auth checks** with the provided hooks
4. **Test thoroughly** to ensure all routes work as expected

## Troubleshooting

### Common Issues:

1. **Infinite redirects**: Check that account types match the expected values in your database
2. **Access denied**: Verify the user's account type in the database matches their role
3. **Token issues**: Check JWT_SECRET environment variable and token expiration

### Debug Tools:

Use the `AccountInfo` component to verify the current user's account type and debug authentication issues.