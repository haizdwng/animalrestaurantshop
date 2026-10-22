import { ErrorState, Splash } from '@/shared/components/ui';

export default function BootScreen({ error, onRetry, onSwitchAccount }) {
  if (!error) return <Splash label='Đang kiểm tra đăng nhập…' />
  return (
    <div className='grid min-h-dvh place-items-center p-4'>
      <div className='w-full max-w-sm space-y-3'>
        <ErrorState message={error} onRetry={onRetry} />
        <button onClick={onSwitchAccount} className='mx-auto block cursor-pointer text-[11px] text-mute hover:text-fg'>
          Đăng nhập tài khoản khác
        </button>
      </div>
    </div>
  );
};