import { useEffect, useRef, useState } from 'react';
import { IconCopy, IconQrcode, IconX } from '@tabler/icons-react';
import { copyText } from '@/shared/library/clipboard';
import { formatShortDateTime, formatVietnameseDong } from '@/shared/library/format';
import { Menu, Spinner } from '@/shared/components/ui';
import StatusBadge from '@/shared/components/payment/StatusBadge';

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

function PendingCountdown({ expiredAt, onExpire }) {
  const [left, setLeft] = useState(() => remainingMs(expiredAt));
  const onExpireRef = useRef(onExpire);
  onExpireRef.current = onExpire;

  useEffect(() => {
    if (!expiredAt) {
      setLeft(null);
      return;
    };
    setLeft(remainingMs(expiredAt));
  }, [expiredAt]);

  useEffect(() => {
    if (left == null) return;
    if (left <= 0) {
      onExpireRef.current?.();
      return;
    };
    const id = setTimeout(() => setLeft(remainingMs(expiredAt)), 250);
    return () => clearTimeout(id);
  }, [left, expiredAt]);

  if (left == null) return null;
  const label = formatCountdown(left);
  if (!label) return null;
  return (
    <span className={`tabular-nums ${left <= 60_000 ? 'text-bad' : 'text-mute'}`}>
      · Còn {label}
    </span>
  );
};

export default function TransactionRow({ tx: t, cancelling, onPay, onCancel, onExpire }) {
  const pending = t.status === 'pending';
  return (
    <li className='flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-5'>
      <div className='min-w-0 flex-1'>
        <p className='flex items-center gap-2 text-sm font-bold tabular-nums'>
          {formatVietnameseDong(t.amount)}
          <StatusBadge status={t.status} />
        </p>
        <p className='mt-0.5 truncate text-[11px] text-mute'>
          {t.code} · {t.createdAt ? formatShortDateTime(t.createdAt) : ''}
          {pending && t.expiredAt ? <PendingCountdown expiredAt={t.expiredAt} onExpire={onExpire} /> : null}
        </p>
      </div>
      {cancelling && <Spinner size={15} className='text-mute' />}
      <Menu
        items={[
          { label: 'Thanh toán tiếp', Icon: IconQrcode, onClick: onPay, hidden: !pending },
          { label: 'Sao chép mã', Icon: IconCopy, onClick: () => copyText(t.code, 'Đã sao chép mã giao dịch') },
          { label: 'Huỷ giao dịch', Icon: IconX, danger: true, onClick: onCancel, hidden: !pending },
        ]}
      />
    </li>
  );
};