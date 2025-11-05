import { AccountInfo } from "@/components/AccountInfo";

const TeacherDashboard = () => {
  return (
    <div className="container mx-auto p-6">
      <div className="mb-6">
        <AccountInfo />
      </div>
      <h1 className="text-3xl font-bold mb-6">Teacher Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Students</h2>
          <p className="text-muted-foreground">Manage your students and view their progress</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Hackathons</h2>
          <p className="text-muted-foreground">Create and manage hackathons</p>
        </div>
        <div className="bg-card p-6 rounded-lg border">
          <h2 className="text-xl font-semibold mb-2">Certificates</h2>
          <p className="text-muted-foreground">Issue certificates to students</p>
        </div>
      </div>
    </div>
  )
}

export default TeacherDashboard; 
