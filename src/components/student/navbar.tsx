'use client'

import { ModeToggle } from '@/components/mode-toggle';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { NavItems as navitems } from '@/config/constants';
import { LogOutIcon, MenuIcon, SettingsIcon, UserIcon, XIcon } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';

const Navbar = () => {
    const pathname = usePathname();
    const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
    const [activeIndex, setActiveIndex] = useState<number>(-1);
    const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 });
    const [menuOpen, setMenuOpen] = useState(false);
    const navRef = useRef<HTMLDivElement>(null);
    const itemRefs = useRef<(HTMLAnchorElement | null)[]>([]);
    // refs for icon components which expose startAnimation/stopAnimation via useImperativeHandle
    const iconRefs = useRef<Array<{ startAnimation?: () => void; stopAnimation?: () => void } | null>>([]);

    useEffect(() => {
        const active = navitems.findIndex(item => item.href === pathname);
        setActiveIndex(active);
    }, [pathname]);

    useEffect(() => {
        const index = hoveredIndex !== null ? hoveredIndex : activeIndex;
        if (index >= 0 && itemRefs.current[index] && navRef.current) {
            const item = itemRefs.current[index];
            const container = navRef.current;
            const itemRect = item!.getBoundingClientRect();
            const containerRect = container.getBoundingClientRect();
            setIndicatorStyle({
                left: itemRect.left - containerRect.left,
                width: itemRect.width,
            });
        }
    }, [hoveredIndex, activeIndex]);

    return (
        <header className='sticky top-0 z-50 bg-[#0e172a] backdrop-blur-sm border-b border-border'>
            <div className='flex justify-between items-center px-4 py-2 md:px-6'>
                {/* Logo */}
                <div className='cursor-pointer font-bold text-2xl text-sidebar-accent-foreground'>
                    Campusphere
                </div>

                {/* Desktop Navigation */}
                <div
                    ref={navRef}
                    className="relative hidden md:flex border divide-x rounded-md border-border overflow-hidden"
                >
                    {/* Animated Background Indicator */}
                    <div
                        className="absolute top-0 h-full bg-muted transition-all duration-300 ease-out pointer-events-none"
                        style={{
                            left: `${indicatorStyle.left}px`,
                            width: `${indicatorStyle.width}px`,
                            opacity: hoveredIndex !== null || activeIndex >= 0 ? 1 : 0,
                        }}
                    />

                    {navitems.map((item, index) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        const isHovered = hoveredIndex === index;

                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                ref={(el) => { itemRefs.current[index] = el }}
                                onMouseEnter={() => {
                                    setHoveredIndex(index);
                                    // trigger icon animation if icon exposes controls
                                    iconRefs.current[index]?.startAnimation?.();
                                }}
                                onMouseLeave={() => {
                                    setHoveredIndex(null);
                                    iconRefs.current[index]?.stopAnimation?.();
                                }}
                                className={`
                                    relative flex items-center justify-center w-32 py-2 text-md transition-all duration-300 ease-out
                                    ${isActive
                                        ? 'font-semibold text-foreground'
                                        : 'text-muted-foreground'}
                                    ${isHovered && !isActive ? 'font-bold text-foreground' : ''}
                                `}
                            >
                                {Icon ? (
                                    // attach ref to the icon component so we can start/stop its motion from the parent
                                    <Icon
                                        ref={(el: any) => (iconRefs.current[index] = el)}
                                        size={16}
                                        className={`mr-2 transition-all font-light duration-300 ${isActive || isHovered ? 'scale-110 font-semibold' : 'scale-100'}`}
                                    />
                                ) : null}
                                <span className="relative z-10">{item.name}</span>
                            </Link>
                        );
                    })}
                </div>

                {/* Right section (theme + user + menu) */}
                <div className='flex items-center space-x-3'>
                    <ModeToggle />

                    {/* Mobile Menu Toggle */}
                    <button
                        className='md:hidden p-2 rounded-md border border-border hover:bg-muted transition-all'
                        onClick={() => setMenuOpen(!menuOpen)}
                    >
                        {menuOpen ? <XIcon size={20} /> : <MenuIcon size={20} />}
                    </button>

                    {/* User Menu */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon" className="relative overflow-hidden group hidden md:flex">
                                <UserIcon size={20} className="transition-transform group-hover:scale-110" />
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="w-48">
                            <DropdownMenuLabel>My Account</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem asChild>
                                <Link href="/home/profile">Profile</Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                                <Link href="/home/settings">Settings</Link>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                                onClick={() => {
                                    console.log("Logging out...");
                                }}
                                className="text-destructive focus:text-destructive cursor-pointer"
                            >
                                <LogOutIcon className="mr-2 h-4 w-4" />
                                Logout
                            </DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                </div>
            </div>

            {/* Mobile Menu */}
            {menuOpen && (
                <div className="md:hidden border-t border-border bg-background/90 backdrop-blur-sm animate-in slide-in-from-top duration-200">
                    <div className="flex flex-col p-3 space-y-1">
                        {navitems.map((item) => {
                            const isActive = pathname === item.href;
                            const Icon = item.icon;
                            return (
                                <Link
                                    key={item.name}
                                    href={item.href}
                                    onClick={() => setMenuOpen(false)}
                                    className={`flex items-center gap-2 px-3 py-2 rounded-md transition-all
                                        ${isActive
                                            ? 'font-bold bg-muted text-foreground'
                                            : 'font-medium text-muted-foreground hover:bg-muted hover:text-foreground'}
                                    `}
                                >
                                    {Icon && <Icon size={16} />}
                                    {item.name}
                                </Link>
                            );
                        })}

                        <div className="border-t border-border mt-2 pt-2">
                            <Link href="/home/profile" className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground">
                                <UserIcon size={16} className="mr-2" /> Profile
                            </Link>
                            <Link href="/home/settings" className="flex items-center px-3 py-2 text-muted-foreground hover:text-foreground">
                                <SettingsIcon size={16} className='mr-2' /> Settings
                            </Link>
                            <button
                                onClick={() => console.log("Logging out...")}
                                className="flex items-center px-3 py-2 text-destructive w-full"
                            >
                                <LogOutIcon size={16} className="mr-2" /> Logout
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </header>
    );
};

export default Navbar;
