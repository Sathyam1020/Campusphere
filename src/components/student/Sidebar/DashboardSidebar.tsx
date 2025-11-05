'use client'

import DashboardUserButton from '@/components/student/Sidebar/DashboardUserButton';
import { Separator } from '@/components/ui/separator';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem
} from '@/components/ui/sidebar';
import { NavItems } from '@/config/constants';
import { cn } from '@/lib/utils';
// import { useHasActiveSubscription } from '@/features/subscriptions/use-subscriptions';
// import { authClient } from '@/lib/auth-client';
import Link from "next/link";
import { usePathname, useRouter } from 'next/navigation';
import { useRef } from 'react';

const Dashboardsidebar = () => {

    const router = useRouter();
    const pathname = usePathname();
    // const { hasActiveSubscription, isLoading, } = useHasActiveSubscription();

    // refs for icon components which expose startAnimation/stopAnimation via useImperativeHandle
    const iconRefs = useRef<Array<{ startAnimation?: () => void; stopAnimation?: () => void } | null>>([]);

    return (
        <Sidebar collapsible='icon'>
            <SidebarHeader className="text-sidebar-accent-foreground">
                <SidebarMenuItem>
                    <SidebarMenuButton
                        asChild
                        className='gap-x-4 h-10 px-4'
                    >
                        <Link href='/home' className="flex items-center gap-2 px-2 pt-2">
                            {/* <Image src={Logo} height={36} width={36} alt="Reverie" /> */}
                            <p className="text-2xl font-semibold">Campushphere</p>
                        </Link>
                    </SidebarMenuButton>
                </SidebarMenuItem>
            </SidebarHeader>
            <div className="px-4 py-2">
                <Separator className="opacity-10 text-[#5d6b68]" />
            </div>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {
                                NavItems.map((item, index) => (
                                    <SidebarMenuItem key={item.name} >
                                        <SidebarMenuButton
                                            asChild
                                            className={cn(
                                                "group relative h-10 px-4 flex items-center gap-3 rounded-md font-medium text-sm transition-colors duration-200",
                                                pathname === item.href
                                                    ? "bg-[#0ba5e9]/10 text-[#0ba5e9] before:content-[''] before:absolute before:left-0 before:top-1 before:bottom-1 before:w-1 before:rounded-r-md before:bg-[#0ba5e9]"
                                                    : "text-slate-400 hover:text-white hover:bg-white/5"
                                            )}
                                            isActive={pathname === item.href}
                                            tooltip={item.name}
                                        >
                                            <Link
                                                href={item.href}
                                                prefetch
                                                onMouseEnter={() => {
                                                    // trigger icon animation when hovering over the entire nav item
                                                    iconRefs.current[index]?.startAnimation?.();
                                                }}
                                                onMouseLeave={() => {
                                                    iconRefs.current[index]?.stopAnimation?.();
                                                }}
                                            >
                                                <item.icon
                                                    ref={(el: any) => (iconRefs.current[index] = el)}
                                                    className='size-4'
                                                />
                                                <span>{item.name}</span>
                                            </Link>
                                        </SidebarMenuButton>
                                    </SidebarMenuItem>
                                ))
                            }
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
            </SidebarContent>
            <SidebarFooter>
                <DashboardUserButton />
            </SidebarFooter>
        </Sidebar>
    )
}

export default Dashboardsidebar; 
