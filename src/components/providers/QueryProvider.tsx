'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, type ReactNode } from 'react';

interface QueryProviderProps {
    children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
    const [queryClient] = useState(
        () =>
            new QueryClient({
                defaultOptions: {
                    queries: {
                        // With SSR, we usually want to set some default staleTime
                        // above 0 to avoid refetching immediately on the client
                        staleTime: 60 * 1000, // 1 minute
                        gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
                        retry: (failureCount, error: any) => {
                            // Don't retry on 4xx errors except 429 (rate limit)
                            if (error?.status >= 400 && error?.status < 500 && error?.status !== 429) {
                                return false;
                            }
                            // Retry up to 3 times for other errors
                            return failureCount < 3;
                        },
                        refetchOnWindowFocus: false, // Disable refetch on window focus
                        refetchOnReconnect: true, // Refetch on network reconnect
                    },
                    mutations: {
                        retry: (failureCount, error: any) => {
                            // Don't retry mutations on client errors
                            if (error?.status >= 400 && error?.status < 500) {
                                return false;
                            }
                            // Retry up to 2 times for server errors
                            return failureCount < 2;
                        },
                    },
                },
            })
    );

    return (
        <QueryClientProvider client={queryClient}>
            {children}
            {process.env.NODE_ENV === 'development' && (
                <ReactQueryDevtools
                    initialIsOpen={false}
                    buttonPosition="bottom-right"
                />
            )}
        </QueryClientProvider>
    );
}