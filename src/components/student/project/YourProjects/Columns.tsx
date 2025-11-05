"use client"

import { GeneratedAvatar } from "@/components/GeneratedAvatar"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import humanizeDuration from "humanize-duration"
import { CircleCheckIcon, CircleXIcon, ClockFadingIcon, CornerDownRightIcon, LoaderIcon } from "lucide-react"

function formatDuration(seconds: number) {
    return humanizeDuration(seconds * 1000, {
        largest: 1,
        round: true,
        units: ["h", "m", "s"],
    })
}

const statusIconMap = {
    active: LoaderIcon,
    completed: CircleCheckIcon,
    cancelled: CircleXIcon,
}

const statusColorMap = {
    active: "bg-blue-500/20 text-blue-800 border-blue-800/5",
    completed: "bg-emerald-500/20 text-emerald-800 border-emerald-800/5",
    cancelled: "bg-rose-500/20 text-rose-800 border-rose-800/5",
}

export const columns = [
    {
        accessorKey: "name",
        header: "Project Name",
        cell: ({ row }: { row: { original: any } }) => (
            <div className="flex flex-col gap-y-1">
                <span className="font-semibold capitalize">{row.original.name}</span>
                <div className="flex items-center gap-x-2">
                    <div className="flex items-center gap-x-1">
                        <CornerDownRightIcon className="size-3 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground max-w-[200px] truncate">{row.original.bio || 'No description'}</span>
                    </div>
                    <GeneratedAvatar
                        variant="botttsNeutral"
                        seed={row.original.name}
                        className="size-4"
                    />
                    <span className="text-sm text-muted-foreground">{row.original.startedAt ? format(new Date(row.original.startedAt), "MMM d") : ""}</span>
                </div>
            </div>
        )
    },
    {
        accessorKey: "skills",
        header: "Skills",
        cell: ({ row }: { row: { original: any } }) => (
            <div className="flex flex-wrap gap-1 max-w-[200px]">
                {(row.original.skills || []).slice(0, 3).map((skill: string, index: number) => (
                    <Badge
                        key={index}
                        variant="outline"
                        className="text-xs"
                    >
                        {skill}
                    </Badge>
                ))}
                {(row.original.skills || []).length > 3 && (
                    <Badge variant="outline" className="text-xs">
                        +{(row.original.skills || []).length - 3}
                    </Badge>
                )}
            </div>
        )
    },
    {
        accessorKey: "status",
        header: "Status",
        cell: ({ row }: { row: { original: any } }) => {
            const Icon = statusIconMap[row.original.status as keyof typeof statusIconMap] || LoaderIcon;
            return (
                <Badge
                    variant='outline'
                    className={cn(
                        "capitalize [&>svg]:size-4 text-muted-foreground",
                        statusColorMap[row.original.status as keyof typeof statusColorMap] || "bg-gray-500/20 text-gray-800 border-gray-800/5"
                    )}
                >
                    <Icon
                        className={cn(
                            row.original.status === "active" && "animate-spin"
                        )}
                    />
                    {row.original.status || 'Unknown'}
                </Badge>
            )
        }
    },
    {
        accessorKey: "duration",
        header: "Duration",
        cell: ({ row }: { row: { original: any } }) => {
            return (
                <Badge
                    variant='outline'
                    className="capitalize [&>svg]:size-4 flex items-center gap-x-2"
                >
                    <ClockFadingIcon className="text-blue-700" />
                    {row.original.duration ? formatDuration(row.original.duration) : "No duration"}
                </Badge>
            )
        }
    }
] 