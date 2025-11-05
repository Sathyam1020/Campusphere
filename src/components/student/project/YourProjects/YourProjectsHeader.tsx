'use client';
import NewProjectDialog from "@/components/student/project/YourProjects/NewProjectDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area";
import { Switch } from "@/components/ui/switch";
import { PlusIcon, SearchIcon, XCircleIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface YourProjectsHeaderProps {
    onSearch?: (searchTerm: string) => void;
    onSort?: (sortBy: string, sortOrder: 'asc' | 'desc') => void;
    onToggleTeamProjects?: (includeTeamProjects: boolean) => void;
    onProjectCreated?: () => void;
    filters?: {
        search: string;
        sortBy: string;
        sortOrder: string;
        includeTeamProjects: boolean;
    };
}

export const YourProjectsHeader = ({
    onSearch,
    onSort,
    onToggleTeamProjects,
    onProjectCreated,
    filters
}: YourProjectsHeaderProps) => {
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const [searchTerm, setSearchTerm] = useState(filters?.search || '');
    const [includeTeamProjects, setIncludeTeamProjects] = useState(filters?.includeTeamProjects || false);

    // Debounced search
    useEffect(() => {
        const timeoutId = setTimeout(() => {
            if (onSearch) {
                onSearch(searchTerm);
            }
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchTerm, onSearch]);

    // Update local state when filters change
    useEffect(() => {
        if (filters) {
            setSearchTerm(filters.search);
            setIncludeTeamProjects(filters.includeTeamProjects);
        }
    }, [filters]);

    const handleTeamProjectsToggle = (checked: boolean) => {
        setIncludeTeamProjects(checked);
        if (onToggleTeamProjects) {
            onToggleTeamProjects(checked);
        }
    };

    const handleClearFilters = () => {
        setSearchTerm('');
        setIncludeTeamProjects(false);
        if (onSearch) {
            onSearch('');
        }
        if (onToggleTeamProjects) {
            onToggleTeamProjects(false);
        }
    };

    const isAnyFilterModified = !!searchTerm || includeTeamProjects;

    return (
        <>
            <NewProjectDialog
                open={isDialogOpen}
                onOpenChange={setIsDialogOpen}
                onProjectCreated={onProjectCreated}
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
                        {/* Search Input */}
                        <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search projects..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-64"
                            />
                        </div>

                        {/* Team Projects Toggle */}
                        <div className="flex items-center space-x-2">
                            <Switch
                                id="team-projects"
                                checked={includeTeamProjects}
                                onCheckedChange={handleTeamProjectsToggle}
                            />
                            <Label htmlFor="team-projects" className="text-sm">
                                Include team projects
                            </Label>
                        </div>

                        {/* Clear Filters Button */}
                        {isAnyFilterModified && (
                            <Button
                                variant='outline'
                                className="rounded-xl"
                                onClick={handleClearFilters}
                            >
                                <XCircleIcon className="size-4" />
                                Clear
                            </Button>
                        )}
                    </div>
                    <ScrollBar orientation="horizontal" />
                </ScrollArea>
            </div>
        </>
    )
} 