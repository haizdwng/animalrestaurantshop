import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconDownload, IconUserCheck, IconX } from '@tabler/icons-react';
import { Button, toast } from '@/shared/components/ui';
import { EXPORT_SIZE } from '@/features/avatar/config';
import { prepareAvatarPhoto } from '@/features/avatar/avatarPhoto';
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
      const key = event.key.toLowerCase();
      if (event.metaKey && !event.altKey && key === 'z') dispatch({ type: event.shiftKey ? 'redo' : 'undo' });
      else if (event.metaKey && !event.altKey && key === 'y') dispatch({ type: 'redo' });
      else if ((key === 'delete' || key === 'backspace') && selectedId && !event.ctrlKey && !event.metaKey) dispatch({ type: 'remove', id: selectedId });
      else return;
      event.preventDefault();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [dispatch, selectedId]);
};

export default function Avatar({ onUser, onClose }) {
  const { doc, selected, selectedId, canUndo, canRedo, dispatch } = useAvatarEditorState();
  const [tab, setTab] = useState(() => doc.photo ? 'itemA' : 'role');
  const [tool, setTool] = useState('select');
  const [brush, setBrush] = useState({ size: 16, opacity: 100, color: '#d4ff3a' });
  const [eraserSize, setEraserSize] = useState(32);
  const [busy, setBusy] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [progressMessage, setProgressMessage] = useState('');
  const progressRef = useRef({ current: 0, target: 0 });
  const closeButton = useRef(null);
  const modalRef = useRef(null);
  const titleId = useId();
  const locked = busy || uploading;
  const lockedRef = useRef(locked);
  const onCloseRef = useRef(onClose);
  lockedRef.current = locked;
  onCloseRef.current = onClose;

  useShortcuts(dispatch, selectedId);

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;
    const focusedBeforeOpen = document.activeElement;
    document.body.style.overflow = 'hidden';
    closeButton.current?.focus();
    const onKey = (event) => {
      if (event.key === 'Escape') {
        event.stopPropagation();
        if (!lockedRef.current) onCloseRef.current();
        return;
      };
      if (event.key !== 'Tab') return;
      const candidates = [...(modalRef.current?.querySelectorAll('button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), a[href], [tabindex]:not([tabindex="-1"])') || [])]
        .filter((element) => element.getClientRects().length > 0);
      if (!candidates.length) return;
      const first = candidates[0];
      const last = candidates[candidates.length - 1];
      const active = document.activeElement;
      if (event.shiftKey && (active === first || !modalRef.current?.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !modalRef.current?.contains(active))) {
        event.preventDefault();
        first.focus();
      };
    };
    document.addEventListener('keydown', onKey, true);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener('keydown', onKey, true);
      focusedBeforeOpen?.focus?.();
    };
  }, []);

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

  const uploadPhoto = async (file) => {
    if (locked) return;
    setUploading(true);
    try {
      const photo = await prepareAvatarPhoto(file);
      dispatch({ type: 'photo', photo });
      setTab('itemA');
      setTool('select');
      toast('Đã chọn ảnh · bạn có thể tiếp tục thêm phụ kiện');
    } catch (error) {
      toast(error.message || 'Không xử lý được ảnh', 'err');
    } finally {
      setUploading(false);
    };
  };

  const waitForProgress = () => new Promise((resolve) => {
    const interval = setInterval(() => {
      if (progressRef.current.current >= 100) {
        clearInterval(interval);
        resolve();
      };
    }, 20);
  });

  const run = async (task) => {
    if (locked) return;
    setBusy(true);
    progressRef.current = { current: 0, target: 0 };
    setProgress(0);
    setProgressMessage('Đang chuẩn bị ảnh');
    try {
      const blob = await renderAvatarToBlob(doc, EXPORT_SIZE);
      await task(blob);
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
    onClose();
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

  const close = () => {
    if (!locked) onClose();
  };

  return createPortal(
    <div className='fixed inset-0 z-50 flex animate-fade items-center justify-center bg-black/75 backdrop-blur-sm sm:p-3' onMouseDown={(event) => event.target === event.currentTarget && close()}>
      <div
        ref={modalRef}
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='flex h-dvh w-full max-w-5xl animate-pop flex-col overflow-hidden border border-line bg-panel shadow-2xl shadow-black/60 sm:h-[min(94dvh,900px)] sm:rounded-2xl'
      >
        <header className='flex shrink-0 items-center justify-between gap-3 border-b border-line px-4 py-3 sm:px-5'>
          <h2 id={titleId} className='min-w-0 text-sm font-extrabold sm:text-base'>Chỉnh sửa ảnh đại diện</h2>
          <button
            type='button'
            ref={closeButton}
            onClick={close}
            disabled={locked}
            aria-label='Đóng trình chỉnh sửa ảnh đại diện'
            className='grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-mute transition hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime disabled:opacity-40'
          >
            <IconX size={19} />
          </button>
        </header>

        <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain lg:overflow-hidden'>
          <div className={`flex min-h-full flex-col gap-4 p-3 sm:p-4 lg:grid lg:h-full lg:min-h-0 lg:grid-cols-[minmax(0,355px)_minmax(0,1fr)] ${locked ? 'pointer-events-none opacity-65' : ''}`}>
            <aside className='min-w-0 space-y-3 rounded-xl border border-line bg-bg p-3 sm:p-4 lg:min-h-0 lg:overflow-y-auto'>
              <div className='mx-auto w-full max-w-[min(52dvh,15rem)] sm:max-w-[min(52dvh,20rem)] lg:max-w-full'>
                <AvatarStage doc={doc} selectedId={selectedId} dispatch={dispatch} tool={tool} brush={brush} eraserSize={eraserSize} />
              </div>
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
            </aside>

            <section className='flex min-h-76 min-w-0 flex-1 flex-col rounded-xl border border-line bg-panel p-3 lg:min-h-0 lg:overflow-hidden'>
              <AssetPicker
                tab={tab}
                onTab={setTab}
                role={doc.role}
                emoji={doc.emoji}
                background={doc.background}
                photo={doc.photo}
                itemKey={itemKey}
                dispatch={dispatch}
                onPhoto={uploadPhoto}
                uploading={uploading}
                disabled={locked}
              />
            </section>
          </div>
        </div>

        <footer className='shrink-0 border-t border-line bg-panel px-4 py-3 pb-[max(.75rem,env(safe-area-inset-bottom))] sm:px-5'>
          {busy && (
            <div className='mb-3 space-y-1.5'>
              <div className='flex items-center justify-between gap-3 text-xs'>
                <span className='truncate text-mute'>{progressMessage}</span>
                <span className='shrink-0 font-semibold tabular-nums'>{progress}%</span>
              </div>
              <div className='h-1.5 overflow-hidden rounded-full bg-bg' role='progressbar' aria-valuenow={progress} aria-valuemin={0} aria-valuemax={100}>
                <div className='h-full rounded-full bg-lime transition-[width] duration-300 ease-out' style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}
          <div className='flex items-center justify-end gap-2'>
            <Button variant='ghost' size='sm' disabled={locked} onClick={close}>Hủy</Button>
            <Button variant='ghost' size='sm' disabled={locked} onClick={download} title='Tải ảnh PNG về máy'>
              <IconDownload size={17} /> <span className='hidden sm:inline'>Tải về</span>
            </Button>
            <Button size='sm' loading={busy} disabled={locked} onClick={useAsAvatar}>
              <IconUserCheck size={17} /> <span className='truncate'>Đặt làm ảnh đại diện</span>
            </Button>
          </div>
        </footer>
      </div>
    </div>,
    document.body
  );
};