import { Breadcrumb, BreadcrumbItem, BreadcrumbLink, BreadcrumbList, BreadcrumbSeparator } from '@/components/ui/breadcrumb';
import { ChevronRightIcon } from 'lucide-react';
import Link from 'next/link';

interface Props {
    projectId: string;
    projectName: string;
}

const ProjectIdViewHeader = ({
    projectId,
    projectName,
}: Props) => {
    return (
        <div className='flex items-center justify-between'>
            <Breadcrumb>
                <BreadcrumbList>
                    <BreadcrumbItem>
                        <BreadcrumbLink asChild className='font-medium text-xl'>
                            <Link href='/home/projects'>
                                My Projects
                            </Link>
                        </BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className='text-foreground text-xl font-medium [&>svg]:size-4'>
                        <ChevronRightIcon />
                    </BreadcrumbSeparator>
                    <BreadcrumbItem>
                        <Link href={`/home/projects/${projectId}`} className='text-foreground text-xl font-medium'>
                            {projectName}
                        </Link>
                    </BreadcrumbItem>
                </BreadcrumbList>
            </Breadcrumb>
        </div>
    )
}

export default ProjectIdViewHeader; 