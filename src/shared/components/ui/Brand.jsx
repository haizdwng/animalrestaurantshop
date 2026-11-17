import { IconHexagonLetterA } from '@tabler/icons-react';

export function Coin({ size = 18, className = '' }) {
  return (
    <svg width={size} height={size} viewBox='0 0 24 24' className={`shrink-0 ${className}`} aria-hidden='true'>
      <circle cx='12' cy='12' r='11' fill='var(--color-coin)' />
      <circle cx='12' cy='12' r='7.5' fill='none' stroke='var(--color-bg)' strokeOpacity='.5' strokeWidth='1.5' strokeDasharray='2 1.6' />
      <path d='M12 8l4 4-4 4-4-4z' fill='var(--color-bg)' fillOpacity='.85' />
    </svg>
  );
};

export function Logo() {
  return (
    <div className='flex min-w-0 items-center gap-2.5' aria-label='Animal Restaurant Shop'>
      <span className='grid size-8 shrink-0 place-items-center rounded-xl bg-lime/10 text-lime'>
        <IconHexagonLetterA size={25} stroke={1.8} />
      </span>
      <span className='min-w-0 truncate text-[13px] font-extrabold tracking-[-.04em] sm:text-sm'>
        animalrestaurant<span className='text-lime'>shop</span>
      </span>
    </div>
  );
};