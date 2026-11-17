import { Logo } from '@/shared/components/ui';

export default function AuthLayout({ children }) {
  return (
    <div className='relative grid min-h-dvh place-items-center px-4 py-10'>
      <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-60 bg-[radial-gradient(ellipse_at_top,color-mix(in_srgb,var(--color-lime)_9%,transparent),transparent_70%)]' />
      <div className='relative w-full max-w-md animate-rise'>
        <div className='mb-7 flex flex-col items-center gap-3 text-center'>
          <Logo />
          <p className='ui-description'>Quản lý tài khoản · mua vật phẩm · nạp xu</p>
        </div>
        <div className='ui-card p-5 shadow-(--ui-shadow) sm:p-7'>{children}</div>
        <p className='mt-5 text-center text-[11px] text-mute'>Animal Restaurant Shop</p>
      </div>
    </div>
  );
};