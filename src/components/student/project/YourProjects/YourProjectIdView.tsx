import ProjectIdViewHeader from '@/components/student/project/YourProjects/ProjectIdViewHeader';
import { Badge } from '@/components/ui/badge';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { BookOpenIcon, CheckCircleIcon, HeartIcon } from 'lucide-react';

interface Props {
    projectId: string;
    projectName: string;
}

const YourProjectIdView = ({ projectId, projectName }: Props) => {
    return (
        <div className="flex w-full flex-col gap-6 p-4 sm:p-6">
            <ProjectIdViewHeader
                projectId={projectId}
                projectName={projectName}
            />

            <div className="flex flex-col gap-y-4">
                <Tabs defaultValue="overview">
                    <div className="bg-white dark:bg-card rounded-lg border px-3">
                        <ScrollArea>
                            <TabsList className="p-0 bg-background justify-start rounded-none h-13">
                                <TabsTrigger
                                    value="overview"
                                    className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                                >
                                    <BookOpenIcon />
                                    Overview
                                </TabsTrigger>
                                <TabsTrigger
                                    value="likes"
                                    className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                                >
                                    <HeartIcon />
                                    Likes
                                </TabsTrigger>
                                <TabsTrigger
                                    value="accepted"
                                    className="text-muted-foreground rounded-none bg-background data-[state=active]:shadow-none border-b-2 border-transparent data-[state=active]:border-b-primary data-[state=active]:text-accent-foreground h-full hover:text-accent-foreground"
                                >
                                    <CheckCircleIcon />
                                    Accepted
                                </TabsTrigger>
                            </TabsList>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    <TabsContent value="overview">
                        <div className="bg-white dark:bg-card rounded-lg border">
                            <div className="px-4 py-5 gap-y-5 flex flex-col">
                                <h2 className="text-2xl font-medium capitalize">{projectName}</h2>
                                <div className="flex gap-x-2 items-center">
                                    <Badge variant="outline" className="flex items-center gap-x-2">
                                        <BookOpenIcon className="size-4" />
                                        Project Details
                                    </Badge>
                                </div>
                                <div>
                                    <p className="mb-6 leading-relaxed text-muted-foreground">
                                        Project overview, description, technologies used, and other project information will be displayed here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="likes">
                        <div className="bg-white dark:bg-card rounded-lg border">
                            <div className="px-4 py-5 gap-y-5 flex flex-col">
                                <h2 className="text-2xl font-medium">Project Likes</h2>
                                <div className="flex gap-x-2 items-center">
                                    <Badge variant="outline" className="flex items-center gap-x-2">
                                        <HeartIcon className="size-4 text-red-500" />
                                        0 Likes
                                    </Badge>
                                </div>
                                <div>
                                    <p className="mb-6 leading-relaxed text-muted-foreground">
                                        Students who have liked this project will be displayed here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>

                    <TabsContent value="accepted">
                        <div className="bg-white dark:bg-card rounded-lg border">
                            <div className="px-4 py-5 gap-y-5 flex flex-col">
                                <h2 className="text-2xl font-medium">Accepted Members</h2>
                                <div className="flex gap-x-2 items-center">
                                    <Badge variant="outline" className="flex items-center gap-x-2">
                                        <CheckCircleIcon className="size-4 text-green-500" />
                                        0 Accepted
                                    </Badge>
                                </div>
                                <div>
                                    <p className="mb-6 leading-relaxed text-muted-foreground">
                                        Team members who have been accepted to join this project will be displayed here.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </TabsContent>
                </Tabs>
            </div>
        </div>
    )
}

export default YourProjectIdView; 
