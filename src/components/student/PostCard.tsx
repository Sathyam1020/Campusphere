'use client';
import { useState } from 'react';
import { Heart, MessageCircle, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Comment {
  id: number;
  username: string;
  text: string;
}

interface Post {
  id: number;
  username: string;
  profileIcon: string;
  content: string;
  image?: { height: number; width: number };
  likes: number;
  timeAgo: string;
  comments: Comment[];
}

export const PostCard = ({ post }: { post: Post }) => {
  const [liked, setLiked] = useState(false);
  const [showAllComments, setShowAllComments] = useState(false);

  const handleLike = () => setLiked(!liked);

  const visibleComments = showAllComments
    ? post.comments
    : post.comments.slice(0, 1);

  return (
    <div className="border border-border rounded-xl p-4 bg-card hover:shadow-md transition-all duration-300 mb-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-muted flex items-center justify-center">
          <User size={20} className="text-muted-foreground" />
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">
            {post.username}
          </h3>
          <p className="text-xs text-muted-foreground">{post.timeAgo}</p>
        </div>
      </div>

      {/* Content */}
      <p className="text-foreground mb-3 leading-relaxed">{post.content}</p>

      {/* Image placeholder */}
      {post.image && (
        <div
          className="rounded-xl bg-muted mb-3"
          style={{
            height: post.image.height,
            width: '100%',
            maxWidth: post.image.width,
          }}
        />
      )}

      {/* Like & Comment Buttons */}
      <div className="flex items-center gap-6 mb-3">
        <button
          onClick={handleLike}
          className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <Heart
            size={18}
            className={`transition-transform ${
              liked ? 'fill-red-500 text-red-500 scale-110' : 'scale-100'
            }`}
          />
          {liked ? post.likes + 1 : post.likes}
        </button>

        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <MessageCircle size={18} />
          {post.comments.length}
        </div>
      </div>

      {/* Comments */}
      <div className="space-y-2">
        {visibleComments.map((comment) => (
          <div key={comment.id} className="flex items-start gap-2">
            <div className="w-7 h-7 rounded-full bg-muted flex items-center justify-center">
              <User size={14} className="text-muted-foreground" />
            </div>
            <div className="bg-muted/40 px-3 py-2 rounded-xl">
              <span className="font-medium text-sm">{comment.username}</span>
              <p className="text-sm text-muted-foreground">{comment.text}</p>
            </div>
          </div>
        ))}

        {post.comments.length > 1 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowAllComments(!showAllComments)}
            className="text-xs text-muted-foreground hover:text-foreground"
          >
            {showAllComments
              ? 'Hide comments'
              : `Show ${post.comments.length - 1} more comments`}
          </Button>
        )}
      </div>
    </div>
  );
};
