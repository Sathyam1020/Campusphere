// components/auth/RoleGuard.tsx
'use client';

import { Spinner } from '@/components/ui/spinner';
import { useAccountType } from '@/hooks/use-account-type';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

interface RoleGuardProps {
    children: React.ReactNode;
    allowedRoles: ('STUDENT' | 'TEACHER' | 'COLLEGE' | 'RECRUITER')[];
    fallbackRoute?: string;
    loadingComponent?: React.ComponentType;
}

/**
 * Component that protects routes based on user roles
 * Redirects users to appropriate routes if they don't have access
 */
export function RoleGuard({
    children,
    allowedRoles,
    fallbackRoute,
    loadingComponent: LoadingComponent = DefaultLoadingComponent
}: RoleGuardProps) {
    const { accountType, isLoading, error } = useAccountType();
    const router = useRouter();

    useEffect(() => {
        if (isLoading) return;

        if (error || !accountType) {
            // No valid account type, redirect to sign-in
            router.push('/sign-in');
            return;
        }

        if (!allowedRoles.includes(accountType)) {
            // User doesn't have permission for this route
            if (fallbackRoute) {
                router.push(fallbackRoute);
            } else {
                // Default redirection based on account type
                switch (accountType) {
                    case 'STUDENT':
                        router.push('/home');
                        break;
                    case 'TEACHER':
                    case 'COLLEGE':
                    case 'RECRUITER':
                        router.push('/dashboard');
                        break;
                    default:
                        router.push('/sign-in');
                }
            }
        }
    }, [accountType, isLoading, error, allowedRoles, fallbackRoute, router]);

    if (isLoading) {
        return <LoadingComponent />;
    }

    if (error || !accountType || !allowedRoles.includes(accountType)) {
        return <LoadingComponent />; // Show loading while redirecting
    }

    return <>{children}</>;
}

function DefaultLoadingComponent() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="flex flex-col items-center space-y-4">
                <Spinner className="w-8 h-8" />
                <p className="text-sm text-muted-foreground">Loading...</p>
            </div>
        </div>
    );
}

// Convenience components for specific roles
export function StudentOnly({ children, fallbackRoute }: { children: React.ReactNode; fallbackRoute?: string }) {
    return (
        <RoleGuard allowedRoles={['STUDENT']} fallbackRoute={fallbackRoute}>
            {children}
        </RoleGuard>
    );
}

export function TeacherOnly({ children, fallbackRoute }: { children: React.ReactNode; fallbackRoute?: string }) {
    return (
        <RoleGuard allowedRoles={['TEACHER']} fallbackRoute={fallbackRoute}>
            {children}
        </RoleGuard>
    );
}

export function CollegeOnly({ children, fallbackRoute }: { children: React.ReactNode; fallbackRoute?: string }) {
    return (
        <RoleGuard allowedRoles={['COLLEGE']} fallbackRoute={fallbackRoute}>
            {children}
        </RoleGuard>
    );
}

export function StaffOnly({ children, fallbackRoute }: { children: React.ReactNode; fallbackRoute?: string }) {
    return (
        <RoleGuard allowedRoles={['TEACHER', 'COLLEGE']} fallbackRoute={fallbackRoute}>
            {children}
        </RoleGuard>
    );
}

export function RecruiterOnly({ children, fallbackRoute }: { children: React.ReactNode; fallbackRoute?: string }) {
    return (
        <RoleGuard allowedRoles={['RECRUITER']} fallbackRoute={fallbackRoute}>
            {children}
        </RoleGuard>
    );
}