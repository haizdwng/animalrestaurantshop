import { Logo } from '@/shared/components/ui';

export default function AuthLayout({ children }) {
  return (
    <div className='relative grid min-h-dvh place-items-center overflow-hidden px-4 py-10'>
      <div aria-hidden className='pointer-events-none absolute inset-0 bg-[radial-gradient(60%_50%_at_50%_0%,color-mix(in_oklab,var(--color-lime)_10%,transparent),transparent_70%)]' />
      <div aria-hidden className='pointer-events-none absolute inset-0 opacity-[0.07] bg-[linear-gradient(var(--color-fg)_1px,transparent_1px),linear-gradient(90deg,var(--color-fg)_1px,transparent_1px)] bg-size-[44px_44px] mask-[radial-gradient(70%_60%_at_50%_30%,black,transparent)]' />
      <div className='relative w-full max-w-100 animate-rise'>
        <div className='mb-8 flex flex-col items-center text-center'>
          <Logo />
          <p className='mt-3 text-xs text-mute'>nạp xu · mua vật phẩm · dùng ngay trong game</p>
        </div>
        <div className='rounded-2xl border border-line bg-panel/90 p-5 shadow-2xl shadow-black/40 backdrop-blur sm:p-7'>{children}</div>
      </div>
    </div>
  );
};