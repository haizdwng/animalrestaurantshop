import { useEffect, useRef, useState } from 'react';
import { IconLoader2, IconSend } from '@tabler/icons-react';
import { toast } from '@/shared/components/ui/Toast';
import useRequestPending from '@/shared/hooks/useRequestPending';
import { getPendingRequestCount } from '@/shared/library/api/client';

const COOLDOWN_MS = 60_000;

export default function OtpButton({ send, target, onSent, check }) {
  const [cooldown, setCooldown] = useState({ target: '', until: 0 });
  const [now, setNow] = useState(Date.now());
  const [busy, setBusy] = useState(false);
  const busyRef = useRef(false);
  const currentTarget = useRef(target);
  currentTarget.current = target;
  const requestPending = useRequestPending();
  const left = cooldown.target === target ? Math.max(0, Math.ceil((cooldown.until - now) / 1000)) : 0;

  useEffect(() => {
    if (left <= 0) return;
    const timer = setTimeout(() => setNow(Date.now()), 1000);
    return () => clearTimeout(timer);
  }, [left, now]);

  const sendCode = async () => {
    if (busyRef.current || getPendingRequestCount() > 0 || left > 0) return;
    if (check && !check()) return;
    const requestedTarget = target.trim();
    if (!requestedTarget) return;

    busyRef.current = true;
    setBusy(true);
    try {
      const response = await send();
      if (currentTarget.current !== target) return;
      const serverTime = response.resendAt ? new Date(response.resendAt).getTime() : NaN;
      setCooldown({ target: requestedTarget, until: Number.isFinite(serverTime) && serverTime > Date.now() ? serverTime : Date.now() + COOLDOWN_MS });
      setNow(Date.now());
      toast(response.message || 'Đã gửi mã xác thực', 'info');
      onSent?.();
    } catch (error) {
      if (error.retryAt) {
        const retryTime = new Date(error.retryAt).getTime();
        if (Number.isFinite(retryTime)) setCooldown({ target: requestedTarget, until: retryTime });
        setNow(Date.now());
      };
      toast(error.message || 'Không gửi được mã xác thực', 'err');
    } finally {
      busyRef.current = false;
      setBusy(false);
    };
  };

  return (
    <button
      type='button'
      onClick={sendCode}
      disabled={requestPending || busy || left > 0}
      data-request-action=''
      aria-label={left > 0 ? `Gửi lại mã sau ${left} giây` : 'Gửi mã xác thực'}
      aria-busy={busy || undefined}
      title={left > 0 ? `Có thể gửi lại sau ${left} giây` : 'Gửi mã xác thực'}
      className='m-1 inline-flex h-8 shrink-0 cursor-pointer items-center justify-center gap-1.5 rounded-md bg-lime px-2.5 text-[11px] leading-none font-bold whitespace-nowrap text-bg transition-colors hover:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:bg-raise disabled:text-mute sm:px-3'
    >
      {busy ? <IconLoader2 size={14} className='animate-spin' aria-hidden /> : <IconSend size={14} className='shrink-0' aria-hidden />}
      <span aria-live={left ? 'off' : undefined}>
        {busy ? 'Đang gửi…' : left ? `${left}s` : <><span className='sm:hidden'>Gửi mã</span><span className='hidden sm:inline'>Gửi mã xác thực</span></>}
      </span>
    </button>
  );
};