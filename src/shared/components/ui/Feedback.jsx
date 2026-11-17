import { IconCloudOff, IconHexagonLetterA, IconLoader2, IconRefresh } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';

export function Spinner({ size = 18, className = '' }) {
  return <IconLoader2 size={size} className={`animate-spin ${className}`} role='img' aria-label='Đang tải' />;
};
export function Splash({ label = 'Đang tải dữ liệu' }) {
  return (
    <div className='grid min-h-dvh place-items-center p-6' role='status' aria-busy='true'>
      <div className='flex w-48 flex-col items-center gap-5 text-center'>
        <IconHexagonLetterA size={50} stroke={1.6} className='text-lime' />
        <div className='h-1 w-36 overflow-hidden rounded-full bg-raise'><span className='block h-full w-1/3 animate-indeterminate rounded-full bg-lime' /></div>
        <p className='text-xs text-mute'>{label}</p>
      </div>
    </div>
  );
};
export function ErrorState({ message, onRetry, loading }) {
  return (
    <div role='alert' className='ui-card flex flex-col items-center gap-4 p-8 text-center'>
      <span className='grid size-12 place-items-center rounded-2xl bg-bad/10 text-bad'><IconCloudOff size={28} /></span>
      <div className='space-y-1'><h2 className='text-sm font-extrabold'>Không tải được dữ liệu</h2><p className='max-w-md text-xs leading-relaxed text-mute'>{message}</p></div>
      {onRetry && <Button variant='ghost' size='sm' loading={loading} onClick={onRetry}><IconRefresh size={15} /> Thử lại</Button>}
    </div>
  );
};