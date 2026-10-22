import { useEffect, useState } from 'react';
import { IconLoader2, IconSend } from '@tabler/icons-react';
import { toast } from '@/shared/components/ui/Toast';

export default function OtpButton({ send, target, onSent, check }) {
  const [until, setUntil] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const left = Math.max(0, Math.ceil((until - now) / 1000));
  useEffect(() => {
    if (!left) return;
    const t = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(t);
  }, [left, now]);

  const onClick = async () => {
    if (check && !check()) return;
    setBusy(true);
    try {
      const r = await send();
      setUntil(r.resendAt ? +new Date(r.resendAt) : Date.now() + 60e3);
      setNow(Date.now());
      toast(r.message || `Đã gửi mã xác thực tới ${target}`, 'info');
      onSent?.();
    } catch (e) {
      if (e.retryAt) {
        setUntil(+new Date(e.retryAt));
        setNow(Date.now());
      };
      toast(e.message, 'err');
    } finally {
      setBusy(false);
    };
  };

  return (
    <button
      type='button'
      disabled={left > 0 || busy}
      onClick={onClick}
      className='m-1 shrink-0 cursor-pointer rounded-md bg-lime px-3 text-[11px] font-bold text-bg transition hover:brightness-110 disabled:cursor-not-allowed disabled:bg-raise disabled:text-mute'
    >
      {busy ? (
        <IconLoader2 size={14} className='animate-spin' />
      ) : left ? (
        `${left}s`
      ) : (
        <span className='flex items-center gap-1.5'>
          <IconSend size={13} /> Gửi mã xác thực
        </span>
      )}
    </button>
  );
};