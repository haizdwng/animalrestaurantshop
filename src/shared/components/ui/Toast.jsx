import { useEffect, useState } from 'react';
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from '@tabler/icons-react';

const KINDS = {
  ok: { Icon: IconCircleCheck, ic: 'text-ok', bar: 'bg-ok' },
  err: { Icon: IconAlertTriangle, ic: 'text-bad', bar: 'bg-bad' },
  info: { Icon: IconInfoCircle, ic: 'text-lime', bar: 'bg-lime' }
};
const DURATION = 4500;
const durationOf = (kind) => (kind === 'info' ? DURATION * 2 : DURATION);

let push;

export function toast(msg, kind = 'ok') {
  push?.({ msg, kind, id: Math.random() });
};

export function toastError(e) {
  if (e.code !== 'UNAUTHORIZED') toast(e.message, 'err');
};

export default function Toaster() {
  const [items, setItems] = useState([]);
  const close = (id) => setItems((s) => s.filter((x) => x.id !== id));
  useEffect(() => {
    push = (t) => {
      setItems((s) => [...s.slice(-3), t]);
      setTimeout(() => close(t.id), durationOf(t.kind));
    };
    return () => (push = undefined);
  }, []);
  return (
    <div aria-live='polite' className='pointer-events-none fixed inset-x-0 top-0 z-60 flex flex-col items-center gap-2 px-3 pt-[max(0.75rem,env(safe-area-inset-top))] pb-3 sm:items-end sm:px-5 sm:pt-[max(1.25rem,env(safe-area-inset-top))] sm:pb-5'>
      {items.map((t) => {
        const c = KINDS[t.kind] || KINDS.ok;
        return (
          <div key={t.id} role='status' className='pointer-events-auto relative w-full max-w-sm animate-toast-in overflow-hidden rounded-xl border border-line bg-raise shadow-xl shadow-black/50'>
            <div className='flex items-start gap-3 p-3 pr-2'>
              <c.Icon size={18} className={`mt-0.5 shrink-0 ${c.ic}`} />
              <p className='min-w-0 flex-1 wrap-break-word text-[13px] leading-snug'>{t.msg}</p>
              <button onClick={() => close(t.id)} aria-label='Đóng thông báo' className='grid size-6 shrink-0 cursor-pointer place-items-center rounded-md text-mute hover:bg-line hover:text-fg'>
                <IconX size={14} />
              </button>
            </div>
            <span className={`absolute bottom-0 left-0 h-0.5 w-full origin-left animate-toast-bar opacity-70 ${c.bar}`} style={{ animationDuration: `${durationOf(t.kind)}ms` }} />
          </div>
        );
      })}
    </div>
  );
};