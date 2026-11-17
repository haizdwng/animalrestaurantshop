import { useEffect, useId, useRef } from 'react';
import { createPortal } from 'react-dom';
import { IconX } from '@tabler/icons-react';

const FOCUSABLE = 'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])';
const dialogStack = [];
let overflowBeforeDialogs = null;

export default function Dialog({ open, title, onClose, children, size = 'md' }) {
  const titleId = useId();
  const dialogId = useRef(Symbol('dialog'));
  const panel = useRef(null);
  const lastOnClose = useRef(onClose);
  lastOnClose.current = onClose;
  const sizes = { md: 'sm:max-w-lg', lg: 'sm:max-w-2xl', full: 'sm:max-w-5xl' };

  useEffect(() => {
    if (!open) return undefined;
    const id = dialogId.current;
    const previouslyFocused = document.activeElement;
    const body = document.body;
    if (dialogStack.length === 0) overflowBeforeDialogs = body.style.overflow;
    dialogStack.push(id);
    body.style.overflow = 'hidden';
    panel.current?.focus({ preventScroll: true });

    const onKeyDown = (event) => {
      if (dialogStack.at(-1) !== id) return;
      if (event.key === 'Escape') {
        event.preventDefault();
        event.stopPropagation();
        lastOnClose.current?.();
        return;
      };
      if (event.key !== 'Tab') return;
      const focusable = [...(panel.current?.querySelectorAll(FOCUSABLE) || [])].filter((element) => element.getClientRects().length > 0);
      if (focusable.length === 0) return event.preventDefault();
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (event.shiftKey && (document.activeElement === first || document.activeElement === panel.current)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      };
    };
    document.addEventListener('keydown', onKeyDown, true);
    return () => {
      document.removeEventListener('keydown', onKeyDown, true);
      const wasTopmost = dialogStack.at(-1) === id;
      const position = dialogStack.lastIndexOf(id);
      if (position >= 0) dialogStack.splice(position, 1);
      if (dialogStack.length === 0) {
        body.style.overflow = overflowBeforeDialogs ?? '';
        overflowBeforeDialogs = null;
      };
      if (wasTopmost && previouslyFocused instanceof HTMLElement && previouslyFocused.isConnected) previouslyFocused.focus({ preventScroll: true });
    };
  }, [open]);

  if (!open) return null;
  return createPortal(
    <div className='fixed inset-0 z-50 flex animate-fade items-end justify-center bg-black/75 backdrop-blur-sm sm:items-center sm:p-5'
      onPointerDown={(event) => { if (event.target === event.currentTarget && dialogStack.at(-1) === dialogId.current) lastOnClose.current?.(); }}>
      <section ref={panel} tabIndex={-1} role='dialog' aria-modal='true' aria-labelledby={titleId}
        className={`ui-card relative flex max-h-[94dvh] w-full min-w-0 animate-pop flex-col rounded-b-none shadow-(--ui-shadow) outline-none sm:max-h-[min(90dvh,52rem)] sm:rounded-2xl ${sizes[size] || sizes.md}`}>
        <span aria-hidden className='mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-line sm:hidden' />
        <header className='flex shrink-0 items-start justify-between gap-4 border-b border-line/70 px-5 py-4'>
          <h2 id={titleId} className='min-w-0 flex-1 text-base font-extrabold leading-tight tracking-tight'>{title}</h2>
          <button type='button' aria-label='Đóng cửa sổ' onClick={() => lastOnClose.current?.()}
            className='-my-1 -mr-1 grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-mute hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime'>
            <IconX size={19} />
          </button>
        </header>
        <div className='min-h-0 space-y-4 overflow-y-auto overscroll-contain px-5 py-5 pb-[max(1.25rem,env(safe-area-inset-bottom))]'>{children}</div>
      </section>
    </div>, document.body
  );
};