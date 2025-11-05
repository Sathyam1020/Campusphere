"use client"

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"

interface Column {
    accessorKey: string
    header: string
    cell?: ({ row }: { row: { original: any } }) => React.ReactNode
}

interface DataTableProps<TData> {
    columns: Column[]
    data: TData[]
    onRowClick?: (row: TData) => void
}

export function DataTable<TData>({
    columns,
    data,
    onRowClick,
}: DataTableProps<TData>) {
    return (
        <div className="rounded-lg border bg-background overflow-hidden">
            <Table>
                <TableHeader>
                    <TableRow>
                        {columns.map((column) => (
                            <TableHead key={column.accessorKey} className="font-semibold p-4">
                                {column.header}
                            </TableHead>
                        ))}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.length ? (
                        data.map((row, index) => (
                            <TableRow
                                onClick={() => onRowClick?.(row)}
                                key={index}
                                className="cursor-pointer hover:bg-muted/50"
                            >
                                {columns.map((column) => (
                                    <TableCell key={column.accessorKey} className="text-sm p-4">
                                        {column.cell
                                            ? column.cell({ row: { original: row } })
                                            : (row as any)[column.accessorKey]
                                        }
                                    </TableCell>
                                ))}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={columns.length} className="h-19 text-center">
                                No results.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    )
}