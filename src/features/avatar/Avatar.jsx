import { useEffect, useMemo, useRef, useState } from 'react';
import { IconDownload, IconUserCheck } from '@tabler/icons-react';
import { Button, toast } from '@/shared/components/ui';
import { EXPORT_SIZE } from '@/features/avatar/config';
import { renderAvatarToBlob } from '@/features/avatar/avatarRendering';
import AssetPicker from '@/features/avatar/AssetPicker';
import AvatarStage from '@/features/avatar/AvatarStage';
import AvatarToolbar from '@/features/avatar/AvatarToolbar';
import useAvatarEditorState from '@/features/avatar/useAvatarEditorState';
import * as api from '@/shared/library/api';

function useShortcuts(dispatch, selectedId) {
  useEffect(() => {
    const onKey = (event) => {
      if (event.target.closest?.('input, textarea, select, [contenteditable]')) return;
      const modifier = event.ctrlKey || event.metaKey;
      const key = event.key.toLowerCase();
      if (modifier && !event.ctrlKey && key === 'z') dispatch({ type: event.shiftKey ? 'redo' : 'undo' });
      else if (modifier && !event.ctrlKey && key === 'y') dispatch({ type: 'redo' });
      else if ((event.key === 'Delete' || event.key === 'Backspace') && selectedId) dispatch({ type: 'remove', id: selectedId });
      else if (event.key === 'Escape') dispatch({ type: 'select', id: null });
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedId]);
};

export default function Avatar({ onUser }) {
  const { doc, selected, selectedId, canUndo, canRedo, dispatch } = useAvatarEditorState();
  const [tab, setTab] = useState('role');
  const [tool, setTool] = useState('select');
  const [brush, setBrush] = useState({ size: 16, opacity: 100, color: '#d4ff3a' });
  const [eraserSize, setEraserSize] = useState(32);
  const [busy, setBusy] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const progressRef = useRef({ current: 0, target: 0 });
  useShortcuts(dispatch, selectedId);

  useEffect(() => {
    if (!busy) return;
    const interval = setInterval(() => {
      const state = progressRef.current;
      if (state.current < state.target) {
        state.current = Math.min(state.current + 1, state.target);
        setProgress(state.current);
      };
    }, 40);
    return () => clearInterval(interval);
  }, [busy]);

  const itemKey = useMemo(() => doc.items.map((item) => item.src).join('|'), [doc.items]);

  const waitForProgress = () => new Promise((resolve) => {
    const interval = setInterval(() => {
      if (progressRef.current.current >= 100) {
        clearInterval(interval);
        resolve();
      };
    }, 20);
  });

  const run = async (task) => {
    setBusy(true);
    progressRef.current = { current: 0, target: 0 };
    setProgress(0);
    setProgressMessage('Đang chuẩn bị');
    try {
      await task(await renderAvatarToBlob(doc, EXPORT_SIZE));
    } catch (error) {
      if (error.code !== 'UNAUTHORIZED') toast(error.message || 'Có lỗi xảy ra', 'err');
    } finally {
      setBusy(false);
      setProgress(0);
      setProgressMessage('');
      progressRef.current = { current: 0, target: 0 };
    };
  };

  const useAsAvatar = () => run(async (blob) => {
    const response = await api.updateAvatar(blob, (value, message) => {
      progressRef.current.target = Math.max(progressRef.current.target, Math.min(100, value));
      setProgressMessage(message);
    });
    progressRef.current.target = 100;
    setProgressMessage('Hoàn tất');
    await waitForProgress();
    if (response.user) onUser(response.user);
    toast(response.message || 'Đã đổi ảnh đại diện');
  });

  const download = () => run((blob) => {
    const url = URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `avatar.${Date.now()}.png`;
    anchor.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  });

  const selectTool = (nextTool) => {
    setTool(nextTool);
    if (nextTool !== 'select') dispatch({ type: 'select', id: null });
  };

  return (
    <div className='flex h-[calc(100svh-var(--app-header-h)-var(--app-bottom-nav-h)-env(safe-area-inset-bottom))] flex-col overflow-hidden md:h-[calc(100svh-var(--app-header-h))] md:flex-row md:gap-6 md:p-6'>
      <aside className='max-h-[58svh] shrink-0 overflow-y-auto border-b border-line px-4 py-3 md:max-h-full md:w-90 md:self-start md:rounded-2xl md:border md:bg-panel md:p-5'>
        <div className='grid grid-cols-[minmax(0,44%)_minmax(0,1fr)] items-start gap-3 md:block md:space-y-3'>
          <AvatarStage doc={doc} selectedId={selectedId} dispatch={dispatch} tool={tool} brush={brush} eraserSize={eraserSize} />
          <div className='flex min-w-0 flex-col justify-start gap-2 md:gap-3'>
            <AvatarToolbar
              doc={doc}
              selected={selected}
              canUndo={canUndo}
              canRedo={canRedo}
              dispatch={dispatch}
              tool={tool}
              onTool={selectTool}
              brush={brush}
              onBrush={setBrush}
              eraserSize={eraserSize}
              onEraserSize={setEraserSize}
            />
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
        {busy && (
          <div className='mt-3 space-y-2'>
            <div className='flex items-center justify-between gap-3 text-xs'>
              <span className='truncate text-mute'>{progressMessage}</span>
              <span className='shrink-0 font-semibold tabular-nums text-fg'>{progress}%</span>
            </div>
            <div className='h-2 overflow-hidden rounded-full bg-bg' role='progressbar' aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
              <div className='h-full rounded-full bg-lime transition-[width] duration-300 ease-out' style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </aside>

      <section className='flex min-h-0 flex-1 flex-col px-4 pt-3 md:px-0 md:pt-0'>
        <AssetPicker tab={tab} onTab={setTab} role={doc.role} emoji={doc.emoji} background={doc.background} itemKey={itemKey} dispatch={dispatch} />
      </section>
    </div>
  );
};
