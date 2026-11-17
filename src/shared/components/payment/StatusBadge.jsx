import { IconBan, IconCircleCheck, IconClock, IconHourglassEmpty } from '@tabler/icons-react';
import { Badge } from '@/shared/components/ui';

export const STATUS = {
  pending: { label: 'Chờ thanh toán', tone: 'warning', Icon: IconClock },
  success: { label: 'Thành công', tone: 'success', Icon: IconCircleCheck },
  cancelled: { label: 'Đã hủy', tone: 'neutral', Icon: IconBan },
  expired: { label: 'Hết hạn', tone: 'neutral', Icon: IconHourglassEmpty }
};

export default function StatusBadge({ status }) {
  const { Icon, tone, label } = STATUS[status] || STATUS.pending;
  return <Badge Icon={Icon} tone={tone}>{label}</Badge>;
};