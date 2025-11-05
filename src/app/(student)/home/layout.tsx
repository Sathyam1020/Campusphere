import { StudentOnly } from "@/components/auth/RoleGuard";
import DashboardSidebar from "@/components/student/Sidebar/DashboardSidebar";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <StudentOnly>
            <main>
                <SidebarProvider>
                    <DashboardSidebar />
                    <div className="w-full">
                        <SidebarTrigger />
                        {children}
                    </div>
                </SidebarProvider>
            </main>
        </StudentOnly>
    )
}