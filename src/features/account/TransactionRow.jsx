import { IconCopy, IconQrcode, IconX } from '@tabler/icons-react';
import { copyText } from '@/shared/library/clipboard';
import { formatShortDateTime, formatVietnameseDong } from '@/shared/library/format';
import { Menu, Spinner } from '@/shared/components/ui';
import StatusBadge from '@/shared/components/payment/StatusBadge';

export default function TransactionRow({ tx: t, cancelling, onPay, onCancel }) {
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