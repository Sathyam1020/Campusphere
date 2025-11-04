import { StaffOnly } from "@/components/auth/RoleGuard";

export default function TeacherLayout({ children }: { children: React.ReactNode }) {
    return (
        <StaffOnly>
            <main className="min-h-screen bg-background">
                {children}
            </main>
        </StaffOnly>
    );
}