'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useTranslations } from 'next-intl';
export default function EditAndDelete({ id, user_id }: { id: string; user_id?: string }) {
  const t = useTranslations('button');
  const tMsg = useTranslations('message');
  const supabase = createClient();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      setShow(user?.id == user_id);
    };
    fetchData();
  }, []);
  async function deleteBlog() {
    if (confirm(tMsg('deleteConfirm'))) {
      const result = await supabase.from('posts').delete().eq('id', id);
      if (result.error) {
        alert(result.error.message);
      } else {
        toast.success(t('delete') + tMsg('success'));
        window.location.href = '/';
      }
    }
  }
  return (
    <div className="flex">
      {show && (
        <div>
          <Button asChild variant="link" size="sm">
            <Link href={`/blog/edit/${id}`}> {t('edit')}</Link>
          </Button>
          <Button variant="link" size="sm" onClick={deleteBlog}>
            {t('delete')}
          </Button>
        </div>
      )}
    </div>
  );
}
