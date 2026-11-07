import { useEffect, useRef, useState } from 'react';
import { IconCopy, IconQrcode, IconRefresh, IconX } from '@tabler/icons-react';
import { copyText } from '@/shared/library/clipboard';
import { formatNumber, formatVietnameseDong } from '@/shared/library/format';
import { Button, Coin, Dialog, Spinner, toast, toastError } from '@/shared/components/ui';
import { STATUS } from '@/shared/components/payment/StatusBadge';
import StatusBadge from '@/shared/components/payment/StatusBadge';
import * as api from '@/shared/library/api';

const POLL = 6000;
const DIALOG_TTL_MS = 5 * 60 * 1000;
const PAID_MSG = 'Thanh toán thành công (đã cộng xu)';

const merge = (tx, r) => ({ ...tx, ...r.transaction, coin: tx.coin, status: r.status });

function remainingMs(expiredAt) {
  if (!expiredAt) return null;
  return Math.max(0, new Date(expiredAt).getTime() - Date.now());
};

function formatCountdown(ms) {
  if (ms == null || ms < 0) return null;
  const s = Math.ceil(ms / 1000);
  const m = Math.floor(s / 60);
  const r = s % 60;
  return `${m}:${String(r).padStart(2, '0')}`;
};

function usePaymentPolling(tx, status, live, setAuto) {
  useEffect(() => {
    if (!tx?.code || status !== 'pending') return;
    let stop = false;
    let timer;
    const tick = async () => {
      setAuto(true);
      try {
        const r = await api.getTransaction(tx.code);
        if (stop) return;
        if (r.status !== 'pending') {
          const { tx: cur, onChange, onPaid, onClose } = live.current;
          onChange?.(merge(cur, r));
          if (r.status === 'success') {
            toast(r.message || PAID_MSG);
            onPaid?.();
          } else if (r.status === 'expired') toast(r.message || 'Giao dịch đã hết hạn', 'info');
          onClose?.();
          return;
        };
      } catch {} finally {
        if (!stop) setAuto(false);
      };
      if (!stop) timer = setTimeout(tick, POLL);
    };
    timer = setTimeout(tick, POLL);
    return () => {
      stop = true;
      clearTimeout(timer);
    };
  }, [tx?.code, status]);
};

function useDialogCountdown(tx, status, onExpire) {
  const [left, setLeft] = useState(() => {
    if (status !== 'pending') return null;
    if (tx?.expiredAt) return remainingMs(tx.expiredAt);
    return DIALOG_TTL_MS;
  });
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;
  const started = useRef(null);

  useEffect(() => {
    if (status !== 'pending' || !tx?.code) {
      setLeft(null);
      return;
    };
    if (tx.expiredAt) setLeft(remainingMs(tx.expiredAt));
    else {
      if (!started.current || started.current.code !== tx.code) started.current = { code: tx.code, at: Date.now() };
      setLeft(Math.max(0, DIALOG_TTL_MS - (Date.now() - started.current.at)));
    };
  }, [tx?.code, tx?.expiredAt, status]);

  useEffect(() => {
    if (status !== 'pending' || left == null) return;
    if (left <= 0) {
      onExpireRef.current?.();
      return;
    };
    const id = setTimeout(() => {
      if (tx?.expiredAt) setLeft(remainingMs(tx.expiredAt));
      else if (started.current?.code === tx?.code) setLeft(Math.max(0, DIALOG_TTL_MS - (Date.now() - started.current.at)));
    }, 250);
    return () => clearTimeout(id);
  }, [left, status, tx?.code, tx?.expiredAt]);
  return left;
};

function Amount({ tx }) {
  return (
    <div>
      <p className='text-[11px] text-mute'>{tx.coin ? 'Mua' : 'Số tiền'}</p>
      {tx.coin ? (
        <>
          <p className='mt-0.5 flex items-center gap-2 text-2xl font-extrabold tabular-nums text-coin'>
            <Coin size={22} /> {formatNumber(tx.coin)}
          </p>
          {tx.amount ? <p className='mt-0.5 text-xs tabular-nums text-mute'>{formatVietnameseDong(tx.amount)}</p> : null}
        </>
      ) : (
        <p className='mt-0.5 text-2xl font-extrabold tabular-nums'>{formatVietnameseDong(tx.amount)}</p>
      )}
    </div>
  );
};

function QrCode({ tx, status }) {
  return (
    <div className='relative mx-auto aspect-square w-full max-w-[min(100%,40dvh,320px)] rounded-2xl bg-white p-3'>
      {tx.qr ? <img src={tx.qr} alt={`Mã QR giao dịch ${tx.code}`} className={`size-full object-contain ${status !== 'pending' ? 'opacity-10 grayscale' : ''}`} /> : <IconQrcode className='size-full text-black/10' />}
      {status !== 'pending' && (
        <div className='absolute inset-0 grid place-items-center'>
          <span className={`rounded-full px-4 py-2 text-xs font-extrabold ${STATUS[status]?.cls}`}>{STATUS[status]?.label}</span>
        </div>
      )}
    </div>
  );
};

export default function PaymentDialog({ tx, onClose, onChange, onPaid }) {
  const [busy, setBusy] = useState('');
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [auto, setAuto] = useState(false);
  const status = tx?.status || 'pending';
  const live = useRef({});
  live.current = { tx, onChange, onPaid, onClose };
  usePaymentPolling(tx, status, live, setAuto);
  const handleExpire = () => {
    if (!tx) return;
    onChange?.({ ...tx, status: 'expired' });
    toast('Giao dịch đã hết hạn', 'info');
    onClose?.();
  };

  const left = useDialogCountdown(tx, status, handleExpire);
  useEffect(() => setConfirmCancel(false), [tx?.code]);
  if (!tx) return null;

  const run = async (kind, fn) => {
    setBusy(kind);
    try {
      await fn();
    } catch (e) {
      toastError(e);
    } finally {
      setBusy('');
    };
  };

  const check = () => run('check', async () => {
    const r = await api.getTransaction(tx.code);
    const next = r.status;
    onChange?.(merge(tx, r));
    if (next === 'success') {
      toast(r.message || PAID_MSG);
      onPaid?.();
      onClose?.();
    } else if (next === 'expired') {
      toast(r.message || 'Giao dịch đã hết hạn', 'info');
      onClose?.();
    } else {
      toast(r.message || (next === 'pending' ? 'Chưa nhận được thanh toán' : STATUS[next]?.label), next === 'pending' ? 'info' : 'ok');
      if (next !== 'pending') onClose?.();
    };
  });

  const cancel = () => run('cancel', async () => {
    const r = await api.cancelTransaction(tx.code);
    onChange?.({ ...tx, status: 'cancelled' });
    setConfirmCancel(false);
    toast(r.message || 'Đã huỷ giao dịch', 'info');
    onClose?.();
  });

  const countdownLabel = status === 'pending' ? formatCountdown(left) : null;
  return (
    <Dialog open title='Thanh toán mua xu' onClose={() => !busy && onClose()}>
      <div className='flex items-start justify-between gap-3'>
        <Amount tx={tx} />
        <div className='flex flex-col items-end gap-1'>
          <StatusBadge status={status} />
          {countdownLabel != null && (
            <p className={`text-[11px] font-bold tabular-nums ${left != null && left <= 60_000 ? 'text-bad' : 'text-mute'}`}>
              Còn {countdownLabel}
            </p>
          )}
        </div>
      </div>

      <QrCode tx={tx} status={status} />

      <button
        type='button'
        onClick={() => copyText(tx.code, 'Đã sao chép mã giao dịch')}
        className='flex w-full cursor-pointer items-center justify-between gap-2 rounded-lg border border-dashed border-line bg-bg px-3 py-2.5 text-left hover:border-mute'
      >
        <span className='min-w-0'>
          <span className='block text-[10px] text-mute'>Mã giao dịch</span>
          <span className='block truncate text-sm font-bold'>{tx.code}</span>
        </span>
        <IconCopy size={16} className='shrink-0 text-mute' />
      </button>

      {status === 'pending' && (
        <p className='flex items-start gap-2 text-[11px] leading-relaxed text-mute'>
          {auto ? <Spinner size={12} className='mt-0.5 shrink-0 text-lime' /> : <span className='mt-1.5 size-1.5 shrink-0 animate-pulse rounded-full bg-ok' />}
          Quét mã bằng app ngân hàng, giữ nguyên nội dung chuyển khoản. Trang web sẽ tự kiểm tra định kỳ (hoặc bấm “Kiểm tra”).
          {countdownLabel != null && <> Hết hạn sau <b className='text-fg'>{countdownLabel}</b></>}
        </p>
      )}

      {status === 'pending' &&
        (confirmCancel ? (
          <div className='animate-rise space-y-3 rounded-xl border border-bad/40 bg-bad/10 p-3'>
            <p className='text-xs'>Huỷ giao dịch này? Mã QR sẽ không dùng được nữa.</p>
            <div className='grid grid-cols-2 gap-2'>
              <Button variant='ghost' disabled={!!busy} onClick={() => setConfirmCancel(false)}>
                Không
              </Button>
              <Button variant='danger' loading={busy === 'cancel'} onClick={cancel}>
                Huỷ giao dịch
              </Button>
            </div>
          </div>
        ) : (
          <div className='grid grid-cols-[auto_1fr] gap-2'>
            <Button variant='ghost' disabled={!!busy} onClick={() => setConfirmCancel(true)}>
              <IconX size={14} /> Huỷ
            </Button>
            <Button loading={busy === 'check'} onClick={check}>
              <IconRefresh size={16} /> Kiểm tra
            </Button>
          </div>
        ))}
      {status !== 'pending' && (
        <Button variant='ghost' className='w-full' onClick={onClose}>
          Đóng
        </Button>
      )}
    </Dialog>
  );
};