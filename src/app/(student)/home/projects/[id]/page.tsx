"use client"

import YourProjectIdView from '@/components/student/project/YourProjects/YourProjectIdView'
import { useProject } from '@/services/projects/hooks'
import { useParams } from 'next/navigation'

const Page = () => {
    const params = useParams() as { id?: string } | null
    const projectId = params?.id ?? ''

    const {
        data: projectResponse,
        isLoading,
        isError,
        error
    } = useProject(projectId)
    console.log(projectResponse, "-----")
    if (isLoading) {
        return (
            <div className="p-6">
                <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-1/4 mb-4"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2"></div>
                </div>
            </div>
        )
    }

    if (isError) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold text-red-600">Error loading project</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    {error?.message || 'Failed to load project details'}
                </p>
            </div>
        )
    }

    if (!projectResponse?.data?.project) {
        return (
            <div className="p-6">
                <h1 className="text-2xl font-semibold">Project not found</h1>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                    The project you're looking for doesn't exist or you don't have access to it.
                </p>
            </div>
        )
    }

    const project = projectResponse.data.project

    return (
        <YourProjectIdView
            projectId={projectId}
            projectName={project.title}
        />
    )
}

export default Page
