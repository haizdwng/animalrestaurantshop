import { useEffect, useId } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';

export default function Dialog({ open, title, onClose, children }) {
  const titleId = useId();
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === 'Escape' && onClose();
    const previousOverflow = document.body.style.overflow;
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = previousOverflow;
    };
  }, [open, onClose]);
  if (!open) return null;
  return createPortal(
    <div className='fixed inset-0 z-50 flex animate-fade items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4' onClick={onClose}>
      <div
        role='dialog'
        aria-modal='true'
        aria-labelledby={titleId}
        className='flex max-h-[92dvh] w-full animate-pop flex-col rounded-t-2xl border border-line bg-panel shadow-2xl shadow-black/60 supports-backdrop-filter:bg-panel/90 supports-backdrop-filter:backdrop-blur-xl sm:max-w-md sm:rounded-2xl'
        onClick={(e) => e.stopPropagation()}
      >
        <div className='mx-auto mt-2 h-1 w-10 rounded-full bg-line sm:hidden' />
        <div className='flex shrink-0 items-center justify-between px-5 pt-4 pb-2'>
          <h3 id={titleId} className='text-sm font-bold'>{title}</h3>
          <button onClick={onClose} className='-mr-2 grid size-8 cursor-pointer place-items-center rounded-lg text-mute hover:bg-raise hover:text-fg' aria-label='Đóng'>
            <IconX size={18} />
          </button>
        </div>
        <div className='space-y-4 overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>{children}</div>
      </div>
    </div>,
    document.body
  );
};