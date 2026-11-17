import { Button, ErrorState, Splash } from '@/shared/components/ui';

export default function BootScreen({ error, onRetry, onSwitchAccount }) {
  if (!error) return <Splash label='Đang kiểm tra phiên đăng nhập…' />;
  return (
    <div className='grid min-h-dvh place-items-center p-4'>
      <div className='w-full max-w-md space-y-3'>
        <ErrorState message={error} onRetry={onRetry} />
        <Button variant='quiet' size='sm' className='mx-auto w-full' onClick={onSwitchAccount}>Đăng nhập tài khoản khác</Button>
      </div>
    </div>
  );
};