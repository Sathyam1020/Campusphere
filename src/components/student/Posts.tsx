import { PostCard } from '@/components/student/PostCard'
import { posts, quotes } from '@/config/constants'

const Posts = () => {
    return (
        <div>
            {/* Top  */}
            <div>
                <div className='text-4xl font-semibold mb-1'>
                    Hello Sathyam!
                </div>
                <div className='text-lg font-light text-muted-foreground dark:text-slate-300'>
                    {
                        quotes[Math.floor(Math.random() * quotes.length)]
                    }
                </div>
            </div>

            {/* Posts  */}
            <div>
                <div className="mt-4">
                    {posts.map((post) => (
                        <PostCard key={post.id} post={post} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Posts
