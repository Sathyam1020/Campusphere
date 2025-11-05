'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Spinner } from '@/components/ui/spinner';
import { Textarea } from '@/components/ui/textarea';
import {
    CreateProjectRequest,
    GetProjectsParams,
    useCreateProject,
    useUserProjects
} from '@/services';
import { useState } from 'react';
import { toast } from 'sonner';

export function ProjectsList() {
    const [page, setPage] = useState(1);
    const [search, setSearch] = useState('');
    const [showCreateForm, setShowCreateForm] = useState(false);

    // Query parameters
    const queryParams: GetProjectsParams = {
        page: page.toString(),
        limit: '10',
        search: search || undefined,
        sortBy: 'createdAt',
        sortOrder: 'desc',
        includeTeamProjects: 'true',
    };

    // Fetch projects
    const {
        data: projectsResponse,
        isLoading,
        isError,
        error,
        refetch
    } = useUserProjects(queryParams);

    // Create project mutation
    const createProjectMutation = useCreateProject({
        onSuccess: () => {
            toast.success('Project created successfully!');
            setShowCreateForm(false);
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to create project');
        },
    });

    const projects = projectsResponse?.data?.projects || [];
    const pagination = projectsResponse?.data?.pagination;

    // Create project form
    const handleCreateProject = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const projectData: CreateProjectRequest = {
            title: formData.get('title') as string,
            description: formData.get('description') as string,
            githubUrl: formData.get('githubUrl') as string || undefined,
            skills: (formData.get('skills') as string).split(',').map(s => s.trim()).filter(Boolean),
        };

        createProjectMutation.mutate(projectData);
    };

    if (isLoading) {
        return (
            <div className="flex items-center justify-center p-8">
                <Spinner className="h-8 w-8" />
                <span className="ml-2">Loading projects...</span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="text-center p-8">
                <p className="text-red-600 mb-4">
                    Error loading projects: {error?.message}
                </p>
                <Button onClick={() => refetch()}>
                    Try Again
                </Button>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold">My Projects</h1>
                <Button onClick={() => setShowCreateForm(true)}>
                    Create Project
                </Button>
            </div>

            {/* Search */}
            <div className="flex gap-4">
                <Input
                    placeholder="Search projects..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="max-w-md"
                />
            </div>

            {/* Create Form */}
            {showCreateForm && (
                <Card>
                    <CardHeader>
                        <CardTitle>Create New Project</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleCreateProject} className="space-y-4">
                            <Input
                                name="title"
                                placeholder="Project Title"
                                required
                            />
                            <Textarea
                                name="description"
                                placeholder="Project Description"
                                required
                            />
                            <Input
                                name="githubUrl"
                                placeholder="GitHub URL (optional)"
                                type="url"
                            />
                            <Input
                                name="skills"
                                placeholder="Skills (comma-separated)"
                                required
                            />
                            <div className="flex gap-2">
                                <Button
                                    type="submit"
                                    disabled={createProjectMutation.isPending}
                                >
                                    {createProjectMutation.isPending ? 'Creating...' : 'Create'}
                                </Button>
                                <Button
                                    type="button"
                                    variant="outline"
                                    onClick={() => setShowCreateForm(false)}
                                >
                                    Cancel
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            )}

            {/* Projects List */}
            <div className="space-y-4">
                {projects.length === 0 ? (
                    <Card>
                        <CardContent className="text-center py-8">
                            <p className="text-gray-500">No projects found</p>
                        </CardContent>
                    </Card>
                ) : (
                    projects.map((project) => (
                        <Card key={project.id}>
                            <CardHeader>
                                <div className="flex justify-between items-start">
                                    <CardTitle className="text-lg">{project.title}</CardTitle>
                                    <Badge variant={project.isUserCreator ? "default" : "secondary"}>
                                        {project.userRole}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <p className="text-gray-600 mb-4">{project.description}</p>

                                {/* Skills */}
                                <div className="flex flex-wrap gap-2 mb-4">
                                    {project.skills.map((skill) => (
                                        <Badge key={skill} variant="outline">
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>

                                {/* Meta info */}
                                <div className="text-sm text-gray-500 space-y-1">
                                    <p>Created by: {project.addedBy.name}</p>
                                    <p>Team members: {project.teamMemberCount}</p>
                                    <p>Created: {new Date(project.createdAt).toLocaleDateString()}</p>
                                    {project.githubUrl && (
                                        <a
                                            href={project.githubUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-600 hover:underline"
                                        >
                                            View on GitHub
                                        </a>
                                    )}
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>

            {/* Pagination */}
            {pagination && pagination.totalPages > 1 && (
                <div className="flex justify-center gap-2">
                    <Button
                        variant="outline"
                        disabled={!pagination.hasPreviousPage}
                        onClick={() => setPage(page - 1)}
                    >
                        Previous
                    </Button>
                    <span className="flex items-center px-4">
                        Page {pagination.currentPage} of {pagination.totalPages}
                    </span>
                    <Button
                        variant="outline"
                        disabled={!pagination.hasNextPage}
                        onClick={() => setPage(page + 1)}
                    >
                        Next
                    </Button>
                </div>
            )}
        </div>
    );
}