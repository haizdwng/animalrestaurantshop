import { IconHexagonLetterA } from '@tabler/icons-react';

export function Coin({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' className={`shrink-0 ${className}`} aria-hidden>
      <circle cx='12' cy='12' r='11' fill='var(--color-coin)' />
      <circle cx='12' cy='12' r='7.5' fill='none' stroke='#0c0d0f' strokeOpacity='.35' strokeWidth='1.5' strokeDasharray='2 1.6' />
      <path d='M12 8l4 4-4 4-4-4z' fill='#0c0d0f' fillOpacity='.75' />
    </svg>
  );
};

export function Logo() {
  return (
    <div className='flex items-center gap-2'>
      <IconHexagonLetterA size={28} className='text-lime' stroke={1.8} />
      <span className='text-[15px] font-extrabold tracking-tight'>
        animalrestaurant<span className='text-lime'>shop</span>
      </span>
    </div>
  );
};