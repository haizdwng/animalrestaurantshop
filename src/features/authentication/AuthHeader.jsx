import { IconArrowLeft } from '@tabler/icons-react';
import { Button, Tabs } from '@/shared/components/ui';
import { MODE_TABS } from '@/features/authentication/config';

export default function AuthHeader({ mode, onMode }) {
  if (mode === 'forgot') return (
    <header className='mb-6 space-y-3'>
      <Button variant='quiet' size='sm' className='-ml-2' onClick={() => onMode('login')}>
        <IconArrowLeft size={15} /> Quay lại đăng nhập
      </Button>
      <h1 className='ui-heading'>Quên mật khẩu</h1>
      <p className='ui-description'>Đặt mật khẩu mới bằng mã OTP gửi tới mã người chơi của bạn.</p>
    </header>
  );
  return <div className='mb-6'><Tabs tabs={MODE_TABS} value={mode} onChange={onMode} label='Đăng nhập hoặc đăng ký' /></div>;
};