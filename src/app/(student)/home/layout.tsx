import Navbar from "@/components/student/navbar"


export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main>
            <Navbar />
            <div className="max-w-7xl mx-auto">
                {children}
            </div>
        </main>
    )
}