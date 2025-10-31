import Posts from '@/components/student/Posts'
import React from 'react'

const page = () => {
  return (
    <div className='p-4 flex justify-center gap-x-2'>
      <div className='max-w-[60%] min-w-[60%]'>
        <Posts />
      </div>
      <div className='max-w-[40%] min-w-[40%]'>
        
      </div>
    </div>
  )
}

export default page
