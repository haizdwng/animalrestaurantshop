import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';

const FOCUSABLE = 'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function Dialog({ open, title, onClose, children }) {
  const titleId = useId();
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    const previouslyFocused = document.activeElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    panelRef.current?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (event.key === 'Escape' && panelRef.current?.contains(document.activeElement)) {
        event.preventDefault();
        closeRef.current?.();
      };
      if (event.key !== 'Tab' || !panelRef.current?.contains(document.activeElement)) return;
      const focusables = [...panelRef.current.querySelectorAll(FOCUSABLE)].filter((element) => element.getClientRects().length > 0);
      if (!focusables.length) return event.preventDefault();
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      };
    };
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = previousOverflow;
      if (previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className='fixed inset-0 z-50 flex animate-fade items-end justify-center bg-black/70 backdrop-blur-sm sm:items-center sm:p-4'
      onClick={(event) => { if (event.target === event.currentTarget) closeRef.current?.(); }}>
      <div ref={panelRef} tabIndex={-1} role='dialog' aria-modal='true' aria-labelledby={titleId}
        className='flex max-h-[92dvh] w-full animate-pop flex-col rounded-t-2xl border border-line bg-panel shadow-2xl shadow-black/60 outline-none supports-backdrop-filter:bg-panel/90 supports-backdrop-filter:backdrop-blur-xl sm:max-w-md sm:rounded-2xl'>
        <div className='mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden' />
        <div className='flex shrink-0 items-center justify-between gap-3 px-5 pt-4 pb-2'>
          <h3 id={titleId} className='min-w-0 text-sm font-bold'>{title}</h3>
          <button type='button' onClick={() => closeRef.current?.()} className='-mr-2 grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-mute transition hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime' aria-label='Đóng cửa sổ'>
            <IconX size={18} />
          </button>
        </div>
        <div className='space-y-4 overflow-y-auto overscroll-contain px-5 pt-2 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>{children}</div>
      </div>
    </div>,
    document.body
  );
};