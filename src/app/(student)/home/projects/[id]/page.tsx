"use client"

import Link from 'next/link'
import { useParams } from 'next/navigation'

const Page = () => {
    const params = useParams() as { id?: string } | null
    const id = params?.id ?? 'unknown'

    return (
        <div className="p-6">
            <h1 className="text-2xl font-semibold">Project: {id}</h1>
            <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                This is a placeholder page for project <code className="font-mono">{id}</code>.
            </p>

            <div className="mt-4">
                <Link href="/home/projects" className="text-sm text-indigo-600 hover:underline">
                    ← Back to Home
                </Link>
            </div>
        </div>
    )
}

export default Page
