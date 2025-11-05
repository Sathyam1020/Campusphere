"use client";

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export const useLogout = () => {
    const router = useRouter();
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const logout = async () => {
        try {
            setIsLoggingOut(true);
            
            const response = await fetch('/api/auth/signout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                // Clear any client-side storage if needed
                localStorage.clear();
                sessionStorage.clear();
                
                // Redirect to sign-in page
                router.push('/sign-in');
                router.refresh();
            } else {
                console.error('Logout failed');
            }
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setIsLoggingOut(false);
        }
    };

    return { logout, isLoggingOut };
};