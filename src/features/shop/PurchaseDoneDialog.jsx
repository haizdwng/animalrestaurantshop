import { useEffect, useState } from 'react';
import { IconCircleCheck } from '@tabler/icons-react';
import { Button, Dialog } from '@/shared/components/ui';

const LOCK_SECONDS = 20;
const VIDEO_URL = `${import.meta.env.BASE_URL}videos/done.mp4`;

export default function PurchaseDoneDialog({ open, onClose }) {
  const [left, setLeft] = useState(LOCK_SECONDS);
  useEffect(() => {
    if (!open) return;
    setLeft(LOCK_SECONDS);
    const timer = setInterval(() => {
      setLeft((n) => Math.max(0, n - 1));
    }, 1000);
    return () => clearInterval(timer);
  }, [open]);
  const locked = left > 0;

  return (
    <Dialog open={open} title='Mua thành công' onClose={() => !locked && onClose()}>
      <div className='flex items-start gap-3 rounded-xl bg-bg p-3 text-xs text-mute'>
        <IconCircleCheck size={18} className='mt-0.5 shrink-0 text-ok' />
        <p className='whitespace-pre-line'>
          <b className='text-fg'>Đã mua vật phẩm thành công</b>
          Vui lòng tải lại dữ liệu trò chơi của bạn để vật phẩm được khả dụng.
        </p>
      </div>
      {open && (
        <video
          src={VIDEO_URL}
          controls
          autoPlay
          playsInline
          className='max-h-[70dvh] w-full rounded-xl bg-black object-contain'
        />
      )}
      <Button block disabled={locked} onClick={onClose}>
        {locked ? `Đóng (${left}s)` : 'Đóng'}
      </Button>
    </Dialog>
  );
};