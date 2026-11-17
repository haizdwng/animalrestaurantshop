import { IconArrowRight, IconUser } from '@tabler/icons-react';
import { Button, Field } from '@/shared/components/ui';

export default function PlayerLookup({ value, onChange, onSubmit }) {
  return (
    <div className='app-screen grid min-h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-env(safe-area-inset-bottom))] place-items-center md:min-h-[calc(100dvh-var(--app-header-h)-3rem)]'>
      <form onSubmit={onSubmit} className='ui-card w-full max-w-sm space-y-4 p-6'>
        <span className='grid size-11 place-items-center rounded-xl bg-lime/10 text-lime'><IconUser size={23} /></span>
        <header><h1 className='ui-heading'>Tìm người chơi</h1><p className='ui-description mt-1'>Nhập mã người chơi để xem thông tin và quản lý dữ liệu.</p></header>
        <Field label='Mã người chơi' placeholder='openid' autoFocus autoCapitalize='none' value={value} onChange={(event) => onChange(event.target.value)} />
        <Button type='submit' className='w-full' disabled={!value.trim()}>Xem người chơi <IconArrowRight size={16} /></Button>
      </form>
    </div>
  );
};