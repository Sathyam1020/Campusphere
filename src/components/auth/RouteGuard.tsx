"use client"

import { useAccountStore } from "@/store/useAccountStore";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RouteGuard() {
    const pathname = usePathname();
    const router = useRouter();
    const accountType = useAccountStore((s) => s.accountType);

    useEffect(() => {
        if (!pathname) return;

        // If the user is not a teacher and they're trying to access teacher pages, redirect them.
        if (pathname.startsWith("/dashboard") && accountType !== "teacher") {
            // replace so back button doesn't take them to forbidden page
            router.replace("/home");
        }
    }, [pathname, accountType, router]);

    return null;
}
