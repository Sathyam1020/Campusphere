"use client"

import { useAccountStore } from "@/store/useAccountStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function RouteGuard() {
    const pathname = usePathname();
    const router = useRouter();
    const accountType = useAccountStore((s) => s.accountType);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    useEffect(() => {
        if (!pathname || !isClient) return;

        // Check if user has a token in localStorage
        const token = localStorage.getItem('auth-token');

        // Define auth pages that don't require authentication
        const authPages = ['/', '/sign-in', '/sign-up'];
        const isAuthPage = authPages.includes(pathname);

        console.log(`🛡️ RouteGuard: ${pathname}, hasToken: ${!!token}, isAuthPage: ${isAuthPage}`);

        // If no token and trying to access protected pages, redirect to sign-in
        if (!token && !isAuthPage) {
            console.log(`🔒 No token - redirecting to sign-in from: ${pathname}`);
            router.replace("/sign-in");
            return;
        }

        // If has token and trying to access auth pages, redirect to appropriate dashboard
        if (token && isAuthPage) {
            console.log(`🏠 Has token - redirecting from auth page: ${pathname}`);
            // Default to /home for students, can be enhanced based on account type
            router.replace("/home");
            return;
        }

        // Role-based route protection
        if (accountType) {
            // If the user is not a teacher and they're trying to access teacher pages, redirect them.
            if (pathname.startsWith("/dashboard") && accountType !== "teacher") {
                console.log(`🚫 Non-teacher accessing teacher route: ${pathname}`);
                router.replace("/home");
                return;
            }

            // If the user is not a student and they're trying to access student pages, redirect them.
            if (pathname.startsWith("/home") && accountType !== "student") {
                console.log(`🚫 Non-student accessing student route: ${pathname}`);
                router.replace("/dashboard");
                return;
            }
        }
    }, [pathname, accountType, router, isClient]);

    return null;
}
