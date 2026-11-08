import { IconCloudOff, IconHexagonLetterA, IconLoader2, IconRefresh } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';

export function Spinner({ size = 18, className = '' }) {
  return <IconLoader2 size={size} className={`animate-spin ${className}`} aria-label='Đang tải' />
};

export function Splash({ label = 'Đang tải dữ liệu' }) {
  return (
    <div className='grid min-h-dvh place-items-center'>
      <div className='flex flex-col items-center gap-5'>
        <IconHexagonLetterA size={52} className='animate-bounce-slow text-lime' stroke={1.5} />
        <div className='h-0.5 w-36 overflow-hidden rounded-full bg-raise'>
          <span className='block h-full w-1/3 animate-indeterminate bg-lime' />
        </div>
        <p className='text-[11px] text-mute'>{label}</p>
      </div>
    </div>
  );
};

export function ErrorState({ message, onRetry, loading }) {
  return (
    <div className='flex flex-col items-center gap-4 rounded-2xl border border-dashed border-line p-10 text-center'>
      <IconCloudOff size={34} className='text-bad' />
      <div>
        <p className='text-sm font-bold'>Không tải được dữ liệu</p>
        <p className='mt-1 text-xs text-mute'>{message}</p>
      </div>
      <Button variant='ghost' size='sm' loading={loading} onClick={onRetry}>
        <IconRefresh size={14} /> Thử lại
      </Button>
    </div>
  );
};