'use client';
import NewProjectDialog from "@/components/student/project/YourProjects/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { PlusIcon, XCircleIcon } from "lucide-react";
import { useState } from "react";
// import { useMeetingsFilters } from "../../hooks/use-meetings-filters";
// import AgentIdFilter from "./AgentIdFilter";
// import MeetingsSearchFilter from "./MeetingsSearchFilter";
// import NewMeetingDialog from "./NewMeetingDialog";
// import { StatusFilter } from "./StatusFilter";

export const YourProjectsHeader = () => {
    // const [filters, setFilters] = useMeetingsFilters();
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const filters = {
        status: null,
        search: "",
        agentId: "",
    };

    const isAnyFilterModified = !!filters.status || !!filters.search || !!filters.agentId;
    // const onClearFilters = () => {
    //     setFilters({
    //         search: "",
    //         status: null,
    //         agentId: "",
    //         page: 1,
    //     })
    // }

    return (
        <>
            <NewProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
            />
            <div className="py-2 flex flex-col gap-y-4 px-2">
                <div className="flex items-center justify-between">
                    <h5 className="font-medium text-xl">My Projects</h5>
                    <Button onClick={() => setIsDialogOpen(true)} className="rounded-lg flex items-center gap-x-2">
                        <PlusIcon />
                        New Project
                    </Button>
                </div>
                <ScrollArea>
                    <div className="flex items-center gap-x-2 p-1">
                        {/* <MeetingsSearchFilter />
                        <StatusFilter />
                        <AgentIdFilter /> */}
                        {
                            isAnyFilterModified && (
                                <Button
                                    variant='outline'
                                    className="rounded-xl"
                                // onClick={onClearFilters}
                                >
                                    <XCircleIcon className="size-4" />
                                    Clear
                                </Button>
                            )
                        }
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    )
} 