"use client"

import { GeneratedAvatar } from '@/components/GeneratedAvatar';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerDescription, DrawerFooter, DrawerHeader, DrawerTitle, DrawerTrigger } from '@/components/ui/drawer';
import { useIsMobile } from '@/hooks/use-mobile';
import { useLogout } from '@/hooks/use-logout';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@radix-ui/react-dropdown-menu';
import { ChevronDownIcon, LogOutIcon, Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';

const DashboardUserButton = () => {
    const router = useRouter();
    const { theme, setTheme } = useTheme();
    const { logout, isLoggingOut } = useLogout();
    const isMobile = useIsMobile();

    const data = {
        user: {
            name: "Sathyam Sahu",
            email: "sathyamrock55@gmail.com",
            image: ""
        }
    }

    if (isMobile) {
        return (
            <Drawer>
                <DrawerTrigger asChild className='rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden transition-all duration-200 cursor-pointer gap-x-2'>
                    <div>
                        {
                            data.user?.image ? (
                                <div>
                                    <Avatar>
                                        <AvatarImage src={data.user?.image} />
                                    </Avatar>
                                </div>
                            ) : (
                                <GeneratedAvatar
                                    seed={data.user.name}
                                    variant='initials'
                                    className='size-9 mr-3'
                                />
                            )
                        }
                        <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                            <p className='text-sm truncate w-full'>
                                {data.user.name}
                            </p>
                            <p className='text-xs truncate w-full'>
                                {data.user.email}
                            </p>
                        </div>
                    </div>
                </DrawerTrigger>
                <DrawerContent>
                    <DrawerHeader>
                        <DrawerTitle>{data.user.name}</DrawerTitle>
                        <DrawerDescription>{data.user.email}</DrawerDescription>
                    </DrawerHeader>
                    <DrawerFooter className="flex gap-2 border-t border-zinc-200 dark:border-zinc-700 mt-4 pt-4">
                        <Button
                            variant="ghost"
                            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-zinc-700 dark:text-zinc-300 
                            hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200"
                        >
                            {theme === 'dark' ? (
                                <Sun className="size-4 text-zinc-500 dark:text-zinc-400" />
                            ) : (
                                <Moon className="size-4 text-zinc-500 dark:text-zinc-400" />
                            )}
                            Theme
                        </Button>
                        <Button
                            variant="ghost"
                            onClick={logout}
                            disabled={isLoggingOut}
                            className="flex items-center gap-2 px-4 py-2 text-sm text-red-600 
                            hover:bg-red-50 dark:hover:bg-red-900 transition-colors duration-200"
                        >
                            <LogOutIcon className="size-4 text-red-500" />
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </Button>
                    </DrawerFooter>
                </DrawerContent>
            </Drawer>
        )
    }

    return (
        <div>
            <DropdownMenu>
                <DropdownMenuTrigger className='rounded-lg border border-border/10 p-3 w-full flex items-center justify-between bg-white/5 hover:bg-white/10 overflow-hidden transition-all duration-200 cursor-pointer gap-x-2'>
                    {
                        data.user.image ? (
                            <div>
                                <Avatar>
                                    <AvatarImage src={data.user.image} />
                                </Avatar>
                            </div>
                        ) : (
                            <GeneratedAvatar
                                seed={data.user.name}
                                variant='initials'
                                className='size-9 mr-3'
                            />
                        )
                    }
                    <div className='flex flex-col gap-0.5 text-left overflow-hidden flex-1 min-w-0'>
                        <p className='text-sm truncate w-full'>
                            {data.user.name}
                        </p>
                        <p className='text-xs truncate w-full'>
                            {data.user.email}
                        </p>
                    </div>
                    <ChevronDownIcon className='size-4 shrink-0' />
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    side="right"
                    className="w-72 bg-white dark:bg-zinc-900 rounded-xl shadow-xl p-2 ml-1 border border-zinc-200 dark:border-zinc-800"
                >
                    {/* User Info */}
                    <DropdownMenuLabel asChild>
                        <div className="flex flex-col px-3 py-2">
                            <span className="font-semibold text-sm truncate text-zinc-900 dark:text-zinc-100">
                                {data.user.name}
                            </span>
                            <span className="text-xs font-normal text-zinc-500 dark:text-zinc-400 truncate">
                                {data.user.email}
                            </span>
                        </div>
                    </DropdownMenuLabel>

                    <DropdownMenuSeparator className="my-2 h-px bg-zinc-200 dark:bg-zinc-700" />

                    {/* Theme Item */}
                    <DropdownMenuItem
                        onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                        className="group flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-zinc-600 dark:text-zinc-300
                        hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors duration-200
                        outline-none focus:outline-none border-0 cursor-pointer"
                    >
                        <span className="transition-all duration-200 group-hover:translate-x-1">
                            Theme
                        </span>
                        {theme === 'dark' ? (
                            <Moon className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                        ) : (
                            <Sun className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                        )}
                    </DropdownMenuItem>

                    {/* Logout Item */}
                    <DropdownMenuItem
                        onClick={logout}
                        disabled={isLoggingOut}
                        className="group flex items-center justify-between gap-2 px-3 py-2 rounded-md text-sm text-zinc-600 dark:text-zinc-300
                        hover:bg-red-100 dark:hover:bg-red-900 hover:text-red-600
                        transition-colors duration-200 outline-none focus:outline-none border-0 cursor-pointer"
                    >
                        <span className="transition-all duration-200 group-hover:translate-x-1">
                            {isLoggingOut ? 'Logging out...' : 'Logout'}
                        </span>
                        <LogOutIcon className="size-4 opacity-70 group-hover:opacity-100 transition-opacity duration-200" />
                    </DropdownMenuItem>
                </DropdownMenuContent>

            </DropdownMenu>
        </div>
    )
}

export default DashboardUserButton; 