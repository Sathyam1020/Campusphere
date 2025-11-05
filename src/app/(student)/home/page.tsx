import { AccountInfo } from "@/components/AccountInfo";
import Events from "@/components/student/Events";
import Posts from "@/components/student/Posts";
import TopContributors from "@/components/student/TopContributors";

const page = () => {
  return (
    <div className='p-4 flex justify-center gap-x-6'>
      <div className='w-full md:max-w-[65%] md:min-w-[65%]'>
        <div className='mb-4'>
          <AccountInfo />
        </div>
        <Posts />
      </div>
      <div className='max-w-[35%] min-w-[35%] hidden md:block lg:block'>
        <Events />
        <TopContributors />
      </div>
    </div>
  )
}

export default page; 
