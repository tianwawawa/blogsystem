'use client';
import Link from 'next/link';
import BlogPagination from './Pagination';
interface Post {
  id: string;
  title: string;
  content: string;
  creator: string;
  minutes: number;
  cover_image: string;
  tags: string;
  created_at: string;
}
export default function PostList({ posts, heading }: { posts: Post[]; heading: string }) {
  return (
    <div className="p-6">
      <h3 className="text-1xl font-bold mb-4">{heading}</h3>
      <div className="grid grid-cols-4 gap-6 dark:text-white">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.id}`}
            className="block p-6 border rounded-lg hover:shadow-lg transition-shadow dark:text-white"
          >
            <h4 className="text-1xl font-semibold mb-2">{post.title}</h4>
            <p className="text-gray-600 mb-4 line-clamp-2 dark:text-white">
              {post.content.replace(/<[^>]*>/g, '').substring(0, 150)}...
            </p>

            <div className="flex items-center justify-between text-sm text-gray-500 dark:text-white">
              <span>作者: {post.creator}</span>
              <span>阅读时间: {post.minutes}分钟</span>
              {/* <span>{new Date(post.created_at).toLocaleDateString()}</span> */}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
