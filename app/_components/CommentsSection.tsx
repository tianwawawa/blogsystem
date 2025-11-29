import { useState, useEffect } from 'react';
import { useTranslations } from 'next-intl';
import { createClient } from '@/lib/supabase/client';
import { count } from 'console';

interface Comment {
  id: string;
  content: string;
  created_at: string;
}

export default function CommentsSection({ postId }: { postId: string | undefined }) {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const supabase = createClient();
  const t = useTranslations('blogDetails');
  useEffect(() => {
    fetchComments();
  }, [postId]);

  async function fetchComments() {
    const { data } = await supabase
      .from('comments')
      .select('*') // 只查评论表的所有字段
      .eq('post_id', postId)
      .order('created_at', { ascending: false });
    if (data) setComments(data);
  }

  async function handleSubmitComment(e: React.FormEvent) {
    e.preventDefault();
    if (!newComment.trim()) return;

    setIsSubmitting(true);

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        alert('请先登录');
        return;
      }

      const { error } = await supabase.from('comments').insert({
        post_id: postId,
        content: newComment.trim(),
        author_id: user.id,
      });

      if (error) throw error;

      setNewComment('');
      fetchComments(); // 刷新评论列表
    } catch (error) {
      console.error('发表评论失败:', error);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="border-t pt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-white">
        {' '}
        {t('count', { count: comments.length })}
      </h2>

      {/* 评论表单 */}
      <form onSubmit={handleSubmitComment} className="mb-8">
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder={t('placeholder')}
          className="w-full px-4 py-3 border border-gray-300 dark:text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <div className="flex justify-end mt-3">
          <button
            type="submit"
            disabled={isSubmitting || !newComment.trim()}
            className="px-6 py-2 bg-blue-600 dark:text-white text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSubmitting ? t('sending') : t('comments')}
          </button>
        </div>
      </form>

      {/* 评论列表 */}
      <div className="space-y-6">
        {comments.map((comment) => (
          <div key={comment.id} className="flex space-x-4">
            {/* <img
              src={comment.author.avatar}
              alt={comment.author.name}
              className="w-10 h-10 rounded-full flex-shrink-0"
            /> */}
            <div className="flex-1">
              <div className="flex items-center space-x-2 mb-2">
                {/* <span className="font-semibold text-gray-900">{comment.author.name}</span> */}
                <span className="text-gray-500 text-sm dark:text-white">
                  {new Date(comment.created_at).toLocaleString('zh-CN')}
                </span>
              </div>
              <p className="text-gray-700 dark:text-white whitespace-pre-wrap">{comment.content}</p>
            </div>
          </div>
        ))}

        {comments.length === 0 && (
          <div className="text-center dark:text-white text-gray-500 py-8">{t('tip')}~</div>
        )}
      </div>
    </section>
  );
}
