import { IconArrowLeft } from '@tabler/icons-react';
import { MODE_TABS } from '@/features/authentication/config';

export default function AuthHeader({ mode, onMode }) {
  if (mode === 'forgot') return (
    <div className='mb-6'>
      <button type='button' onClick={() => onMode('login')} className='mb-3 flex cursor-pointer items-center gap-1 text-[11px] text-mute hover:text-fg'>
        <IconArrowLeft size={14} /> Quay lại đăng nhập
      </button>
      <h1 className='text-xl font-extrabold tracking-tight'>Quên mật khẩu</h1>
      <p className='mt-1 text-xs text-mute'>Đặt mật khẩu mới bằng mã OTP gửi tới mã người chơi của bạn.</p>
    </div>
  );
  return (
    <div role='tablist' className='mb-6 grid grid-cols-2 gap-1 rounded-lg bg-bg p-1'>
      {MODE_TABS.map(([k, label]) => (
        <button key={k} role='tab' type='button' aria-selected={mode === k} onClick={() => mode !== k && onMode(k)} className={`h-9 cursor-pointer rounded-md text-xs font-bold transition ${mode === k ? 'bg-raise text-fg shadow' : 'text-mute hover:text-fg'}`}>
          {label}
        </button>
      ))}
    </div>
  );
};