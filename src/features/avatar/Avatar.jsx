import { useEffect, useMemo, useState } from 'react';
import { IconDownload, IconUserCheck } from '@tabler/icons-react';
import { Button, toast } from '@/shared/components/ui';
import { FACES, imageUrl } from '@/features/avatar/manifest';
import { EXPORT_SIZE } from '@/features/avatar/config';
import { renderAvatarToBlob } from '@/features/avatar/avatarRendering';
import { preloadImages } from '@/features/avatar/imageLoading';
import AssetPicker from '@/features/avatar/AssetPicker';
import AvatarStage from '@/features/avatar/AvatarStage';
import AvatarToolbar from '@/features/avatar/AvatarToolbar';
import useAvatarEditorState from '@/features/avatar/useAvatarEditorState';
import * as api from '@/shared/library/api';

function useShortcuts(dispatch, selectedId) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const mod = e.ctrlKey || e.metaKey;
      const key = e.key.toLowerCase();
      if (mod && key === 'z') dispatch({ type: e.shiftKey ? 'redo' : 'undo' });
      else if (mod && key === 'y') dispatch({ type: 'redo' });
      else if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) dispatch({ type: 'remove', id: selectedId });
      else if (e.key === 'Escape') dispatch({ type: 'select', id: null });
      else return;
      e.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedId]);
};

export default function Avatar({ onUser }) {
  const { doc, selected, selectedId, canUndo, canRedo, dispatch } = useAvatarEditorState();
  const [tab, setTab] = useState('role');
  const [busy, setBusy] = useState(false);
  useShortcuts(dispatch, selectedId);

  useEffect(() => {
    const t = setTimeout(() => preloadImages(FACES[doc.role].map(imageUrl)), 300);
    return () => clearTimeout(t);
  }, [doc.role]);

  const itemKey = useMemo(() => doc.items.map((i) => i.src).join('|'), [doc.items]);

  const run = async (task) => {
    setBusy(true);
    try {
      await task(await renderAvatarToBlob(doc, EXPORT_SIZE));
    } catch (e) {
      if (e.code === 'UNAUTHORIZED') return;
      toast('Có lỗi xảy ra', 'err');
    } finally {
      setBusy(false);
    };
  };

  const useAsAvatar = () => run(async (blob) => {
    const r = await api.updateAvatar(blob);
    if (r.user) onUser(r.user);
    toast(r.message || 'Đã đổi ảnh đại diện');
  });

  const download = () => run((blob) => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'avatar.png';
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  return (
    <div className='flex h-[calc(100svh-var(--app-header-h)-var(--app-bottom-nav-h)-env(safe-area-inset-bottom))] flex-col overflow-hidden md:h-[calc(100svh-var(--app-header-h))] md:flex-row md:gap-6 md:p-6'>
      <aside className='shrink-0 border-b border-line px-4 py-3 md:max-h-full md:w-90 md:self-start md:overflow-y-auto md:rounded-2xl md:border md:bg-panel md:p-5'>
        <div className='grid grid-cols-[minmax(0,44%)_minmax(0,1fr)] items-stretch gap-3 md:block md:space-y-3'>
          <AvatarStage doc={doc} selectedId={selectedId} dispatch={dispatch} />
          <div className='flex min-w-0 flex-col justify-between gap-2 md:gap-3'>
            <AvatarToolbar selected={selected} canUndo={canUndo} canRedo={canRedo} dispatch={dispatch} />
            <div className='flex gap-2'>
              <Button variant='ghost' size='sm' className='h-9 w-9 shrink-0 px-0' disabled={busy} onClick={download} aria-label='Tải ảnh về máy' title='Tải ảnh về máy'>
                <IconDownload size={16} />
              </Button>
              <Button size='sm' className='h-9 min-w-0 flex-1 px-2' loading={busy} onClick={useAsAvatar}>
                <IconUserCheck size={15} className='hidden md:block' />
                <span className='truncate'>Đặt làm ảnh đại diện</span>
              </Button>
            </div>
          </div>
        </div>
        <p className='mt-3 hidden text-center text-[10px] text-mute md:block'>Kéo để di chuyển · lăn chuột hoặc chụm 2 ngón để phóng/xoay</p>
      </aside>

      <section className='flex min-h-0 flex-1 flex-col px-4 pt-3 md:px-0 md:pt-0'>
        <AssetPicker tab={tab} onTab={setTab} role={doc.role} emoji={doc.emoji} background={doc.background} itemKey={itemKey} dispatch={dispatch} />
      </section>
    </div>
  );
};