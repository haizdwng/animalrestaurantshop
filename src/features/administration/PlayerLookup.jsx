import { IconArrowRight, IconUser } from '@tabler/icons-react';
import { Button, Field } from '@/shared/components/ui';

export default function PlayerLookup({ value, onChange, onSubmit }) {
  return (
    <div className='app-screen grid min-h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-env(safe-area-inset-bottom))] place-items-center md:min-h-[calc(100dvh-var(--app-header-h)-3rem)]'>
      <form onSubmit={onSubmit} className='w-full max-w-sm space-y-4 rounded-2xl border border-line bg-panel p-6'>
        <span className='grid size-11 place-items-center rounded-xl bg-lime/15 text-lime'>
          <IconUser size={22} />
        </span>
        <div>
          <h1 className='text-lg font-extrabold'>Xem thông tin người chơi</h1>
          <p className='mt-1 text-xs text-mute'>Nhập mã người chơi của người chơi cần xem</p>
        </div>
        <Field label='Mã người chơi' placeholder='openid' autoFocus autoCapitalize='none' value={value} onChange={(e) => onChange(e.target.value)} />
        <Button type='submit' className='w-full' disabled={!value.trim()}>
          Xem <IconArrowRight size={15} />
        </Button>
      </form>
    </div>
  );
};