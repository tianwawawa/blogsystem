'use client';
import { format, parseISO } from 'date-fns';
import EditAndDelete from '@/app/_components/EditAndDelete';
import CommentsSection from '@/app/_components/CommentsSection';
import type { TableRow } from '@/interfaces/database.types';
export default function BlogDetailPageClient({ post }: { post: TableRow<'posts'> }) {
  return (
    <div className="min-h-screen bg-gray-50 py-8 dark:bg-black">
      <article className="container mx-auto px-4 max-w-4xl">
        {/* 封面图 */}
        {post.picture && (
          <div className="mb-8 rounded-2xl overflow-hidden">
            <img src={post.picture} alt={post.title} className="w-full h-64 md:h-96 object-cover" />
          </div>
        )}

        {/* 文章头部 */}
        <header className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4 leading-tight dark:text-white">
            {post.title}
          </h1>
          <div className="flex items-center justify-center space-x-4 text-gray-600 mb-4 dark:text-white">
            <span>{post.creator || '牛人'}</span>
            <span>•</span>
            <span>{format(parseISO(post.created_at), 'yyyy年MM月dd日 HH:mm')}</span>
            <EditAndDelete id={post.id} user_id={post.user_id} />
          </div>

          {/* 标签 */}
          <div className="flex flex-wrap justify-center gap-2">
            {post.tags &&
              JSON.parse(post.tags).map(({ label, value }: { label: string; value: string }) => (
                <span
                  key={label}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  #{value}
                </span>
              ))}
          </div>
        </header>

        {/* 内容 */}
        <div
          className="prose prose-lg max-w-none mb-12 text-gray-700 leading-relaxed dark:text-white"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* 评论 */}
        <CommentsSection postId={post.id} />
      </article>
    </div>
  );
}
