import { IconBan, IconCircleCheck, IconClockHour4 } from '@tabler/icons-react';

export const STATUS = {
  pending: { label: 'Chờ thanh toán', cls: 'bg-coin/15 text-coin', Icon: IconClockHour4 },
  success: { label: 'Thành công', cls: 'bg-ok/15 text-ok', Icon: IconCircleCheck },
  cancelled: { label: 'Đã huỷ', cls: 'bg-raise text-mute', Icon: IconBan }
};

export default function StatusBadge({ status }) {
  const s = STATUS[status] || STATUS.pending;
  return (
    <span className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${s.cls}`}>
      <s.Icon size={11} /> {s.label}
    </span>
  );
};