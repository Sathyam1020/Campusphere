'use client'

import { columns } from '@/components/student/project/YourProjects/Columns';
import { DataTable } from '@/components/student/project/YourProjects/DataTable';
import { YourProjectsHeader } from '@/components/student/project/YourProjects/YourProjectsHeader';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

const YourProjects = () => {
    const [projects, setProjects] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Load projects from localStorage
        const loadProjects = () => {
            try {
                const storedProjects = localStorage.getItem('projects');
                if (storedProjects) {
                    const parsedProjects = JSON.parse(storedProjects);
                    setProjects(parsedProjects);
                } else {
                    // No projects exist, start with empty list
                    setProjects([]);
                }
            } catch (error) {
                console.error('Error loading projects:', error);
                setProjects([]);
            } finally {
                setIsLoading(false);
            }
        };

        loadProjects();

        // Listen for storage changes (when projects are added/updated)
        const handleStorageChange = () => {
            loadProjects();
        };

        window.addEventListener('storage', handleStorageChange);

        // Custom event for when projects are updated in the same tab
        window.addEventListener('projectsUpdated', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
            window.removeEventListener('projectsUpdated', handleStorageChange);
        };
    }, []);

    const handleRowClick = (project: any) => {
        console.log('Project clicked:', project);
        router.push(`/home/projects/${project.id}`);
    };

    if (isLoading) {
        return (
            <div className='w-full'>
                <YourProjectsHeader />
                <div className="px-4 py-8 text-center">
                    <p>Loading projects...</p>
                </div>
            </div>
        );
    }

    return (
        <div className='w-full'>
            <YourProjectsHeader />
            <div className="px-4">
                <DataTable
                    columns={columns}
                    data={projects}
                    onRowClick={handleRowClick}
                />
            </div>
        </div>
    )
}

export default YourProjects; 
