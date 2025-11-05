'use client'

import { columns } from '@/components/student/project/YourProjects/Columns';
import { DataTable } from '@/components/student/project/YourProjects/DataTable';
import { YourProjectsHeader } from '@/components/student/project/YourProjects/YourProjectsHeader';
import { GetProjectsParams, useUserProjects } from '@/services';
import { useRouter } from 'next/navigation';
import { useCallback, useState } from 'react';

const YourProjects = () => {
    const [filters, setFilters] = useState({
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
        includeTeamProjects: false,
        page: 1,
        limit: 10
    });

    const router = useRouter();

    // Convert filters to query parameters
    const queryParams: GetProjectsParams = {
        page: filters.page.toString(),
        limit: filters.limit.toString(),
        sortBy: filters.sortBy as 'createdAt' | 'title',
        sortOrder: filters.sortOrder as 'asc' | 'desc',
        includeTeamProjects: filters.includeTeamProjects.toString(),
        ...(filters.search.trim() && { search: filters.search.trim() }),
    };

    // Fetch projects using React Query
    const {
        data: projectsResponse,
        isLoading,
        isError,
        error,
        refetch
    } = useUserProjects(queryParams);

    const projects = projectsResponse?.data?.projects || [];
    const pagination = projectsResponse?.data?.pagination;

    // Debug logging
    console.log('🔍 YourProjects render:', {
        projectsCount: projects.length,
        isLoading,
        isError,
        queryParams
    });

    // Transform projects to match the expected format for the table
    const transformedProjects = projects.map(project => ({
        ...project,
        name: project.title, // Map title to name for the table
        bio: project.description.length > 50
            ? project.description.substring(0, 50) + '...'
            : project.description,
        status: 'completed', // Default status since it's not in API
        duration: 1800, // Default duration
        startedAt: project.createdAt,
    }));

    // Handle search
    const handleSearch = useCallback((searchTerm: string) => {
        setFilters(prev => ({
            ...prev,
            search: searchTerm,
            page: 1 // Reset to first page when searching
        }));
    }, []);

    // Handle sorting
    const handleSort = useCallback((sortBy: string, sortOrder: 'asc' | 'desc') => {
        setFilters(prev => ({
            ...prev,
            sortBy,
            sortOrder,
            page: 1 // Reset to first page when sorting
        }));
    }, []);

    // Handle pagination
    const handlePageChange = useCallback((newPage: number) => {
        setFilters(prev => ({
            ...prev,
            page: newPage
        }));
    }, []);

    // Handle team projects toggle
    const handleToggleTeamProjects = useCallback((includeTeamProjects: boolean) => {
        setFilters(prev => ({
            ...prev,
            includeTeamProjects,
            page: 1 // Reset to first page when toggling
        }));
    }, []);

    const handleRowClick = (project: any) => {
        console.log('Project clicked:', project);
        router.push(`/home/projects/${project.id}`);
    };

    // Retry function for error state
    const handleRetry = () => {
        refetch();
    };

    if (isError) {
        return (
            <div className='w-full'>
                <YourProjectsHeader
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onToggleTeamProjects={handleToggleTeamProjects}
                    filters={filters}
                />
                <div className="px-4 py-8 text-center">
                    <div className="space-y-4">
                        <p className="text-red-600">Error: {error?.message || 'Failed to load projects'}</p>
                        <button
                            onClick={handleRetry}
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Retry
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className='w-full'>
                <YourProjectsHeader
                    onSearch={handleSearch}
                    onSort={handleSort}
                    onToggleTeamProjects={handleToggleTeamProjects}
                    filters={filters}
                />
                <div className="px-4 py-8 text-center">
                    <div className="space-y-4">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-200 rounded-md w-1/4 mx-auto mb-4"></div>
                            <div className="space-y-4">
                                {Array.from({ length: 5 }).map((_, i) => (
                                    <div key={i} className="h-12 bg-gray-200 rounded-md"></div>
                                ))}
                            </div>
                        </div>
                        <p className="text-gray-600">Loading projects...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full'>
            <YourProjectsHeader
                onSearch={handleSearch}
                onSort={handleSort}
                onToggleTeamProjects={handleToggleTeamProjects}
                onProjectCreated={() => {
                    console.log('🔄 Project created, manually refetching...');
                    refetch();
                }}
                filters={filters}
            />
            <div className="px-4">
                {transformedProjects.length === 0 ? (
                    <div className="py-8 text-center">
                        <p className="text-gray-600">
                            {filters.search ? 'No projects found matching your search.' : 'No projects yet. Create your first project!'}
                        </p>
                    </div>
                ) : (
                    <>
                        <DataTable
                            columns={columns}
                            data={transformedProjects}
                            onRowClick={handleRowClick}
                        />

                        {/* Pagination Controls */}
                        {pagination && pagination.totalPages > 1 && (
                            <div className="flex items-center justify-between mt-6 mb-4">
                                <div className="text-sm text-gray-600">
                                    Showing {((pagination.currentPage - 1) * pagination.itemsPerPage) + 1} to{' '}
                                    {Math.min(pagination.currentPage * pagination.itemsPerPage, pagination.totalCount)} of{' '}
                                    {pagination.totalCount} projects
                                </div>
                                <div className="flex items-center space-x-2">
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage - 1)}
                                        disabled={!pagination.hasPreviousPage}
                                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Previous
                                    </button>
                                    <span className="px-3 py-1 text-sm">
                                        Page {pagination.currentPage} of {pagination.totalPages}
                                    </span>
                                    <button
                                        onClick={() => handlePageChange(pagination.currentPage + 1)}
                                        disabled={!pagination.hasNextPage}
                                        className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                                    >
                                        Next
                                    </button>
                                </div>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    )
}

export default YourProjects; 
