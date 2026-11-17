import { useEffect, useState } from 'react';
import { IconAlertTriangle, IconCircleCheck, IconInfoCircle, IconX } from '@tabler/icons-react';

const TYPES = {
  ok: { Icon: IconCircleCheck, icon: 'text-ok', bar: 'bg-ok' },
  err: { Icon: IconAlertTriangle, icon: 'text-bad', bar: 'bg-bad' },
  info: { Icon: IconInfoCircle, icon: 'text-lime', bar: 'bg-lime' }
};
const DURATIONS = { ok: 4500, err: 6000, info: 6500 };
let counter = 0;
let dispatch = null;

export function toast(message, kind = 'ok') {
  if (!message) return;
  dispatch?.({ id: ++counter, message: String(message), kind: TYPES[kind] ? kind : 'info', createdAt: Date.now() });
};
export function toastError(error) {
  if (error?.code !== 'UNAUTHORIZED') toast(error?.message || 'Đã xảy ra lỗi', 'err');
};

export default function Toaster() {
  const [items, setItems] = useState([]);
  useEffect(() => {
    const publisher = (item) => setItems((existing) => [...existing.slice(-3), item]);
    dispatch = publisher;
    return () => { if (dispatch === publisher) dispatch = null; };
  }, []);
  useEffect(() => {
    const timers = items.map((item) => setTimeout(() => setItems((existing) => existing.filter((entry) => entry.id !== item.id)), Math.max(0, DURATIONS[item.kind] - (Date.now() - item.createdAt))));
    return () => timers.forEach(clearTimeout);
  }, [items.map((item) => item.id).join(',')]);

  return (
    <div aria-live='polite' aria-atomic='false' className='pointer-events-none fixed inset-x-0 top-0 z-70 flex flex-col items-center gap-2 p-3 pt-[max(.75rem,env(safe-area-inset-top))] sm:items-end sm:p-5'>
      {items.map((item) => {
        const type = TYPES[item.kind];
        const Icon = type.Icon;
        return (
          <div key={item.id} role={item.kind === 'err' ? 'alert' : 'status'}
            className='pointer-events-auto relative flex w-full max-w-sm animate-toast-in items-start gap-3 overflow-hidden rounded-xl border border-line bg-panel px-3 py-3.5 shadow-(--ui-shadow)'>
            <Icon size={19} className={`mt-0.5 shrink-0 ${type.icon}`} />
            <p className='min-w-0 flex-1 wrap-break-word text-xs leading-relaxed'>{item.message}</p>
            <button type='button' aria-label='Đóng thông báo' onClick={() => setItems((entries) => entries.filter((entry) => entry.id !== item.id))}
              className='grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-mute hover:bg-raise hover:text-fg'>
              <IconX size={15} />
            </button>
            <span aria-hidden className={`absolute inset-x-0 bottom-0 h-0.5 origin-left animate-toast-bar ${type.bar}`}
              style={{ animationDuration: `${DURATIONS[item.kind]}ms` }} />
          </div>
        );
      })}
    </div>
  );
};