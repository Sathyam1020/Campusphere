import FindProjects from "@/components/student/project/FindProjects/FindProjects"
import YourProjects from "@/components/student/project/YourProjects/YourProjects"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"

export function Projects() {

  return (
    <div className="flex w-full flex-col gap-6">
      <Tabs defaultValue="your-projects">
        <TabsList className="bg-card border border-border rounded-xl p-1.5 h-auto">
          <TabsTrigger
            value="your-projects"
            className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:bg-muted"
          >
            Your Projects
          </TabsTrigger>
          <TabsTrigger
            value="find-projects"
            className="cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm px-3 py-1.5 rounded-md font-medium transition-all duration-200 hover:bg-muted"
          >
            Find Projects
          </TabsTrigger>
        </TabsList>
        <TabsContent value="your-projects">
          <YourProjects />
        </TabsContent>
        <TabsContent value="find-projects">
          <FindProjects />
        </TabsContent>
      </Tabs>
    </div>
  )
}