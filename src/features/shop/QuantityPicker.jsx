import { IconMinus, IconPlus } from '@tabler/icons-react';

export default function QuantityPicker({ value, max, disabled, onChange, onEnter }) {
  const clamp = (n) => Math.min(max, Math.max(1, n))
  return (
    <div>
      <span className='mb-1.5 block text-[11px] text-mute'>Số lượng</span>
      <div className='flex h-12 items-stretch overflow-hidden rounded-lg border border-line bg-bg'>
        <button type='button' aria-label='Giảm' disabled={value <= 1 || disabled} onClick={() => onChange(clamp(value - 1))} className='w-12 cursor-pointer text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30'>
          <IconMinus size={18} className='mx-auto' />
        </button>
        <input
          type='number'
          inputMode='numeric'
          min={1}
          max={max}
          aria-label='Số lượng'
          value={value}
          disabled={disabled}
          onChange={(e) => onChange(clamp(parseInt(e.target.value) || 1))}
          onKeyDown={(e) => e.key === 'Enter' && onEnter()}
          className='min-w-0 flex-1 bg-transparent text-center text-lg font-bold tabular-nums outline-none'
        />
        <button type='button' aria-label='Tăng' disabled={value >= max || disabled} onClick={() => onChange(clamp(value + 1))} className='w-12 cursor-pointer text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30'>
          <IconPlus size={18} className='mx-auto' />
        </button>
      </div>
      <div className='mt-2 grid grid-cols-4 gap-1.5'>
        {[...new Set([1, 5, 10, max])].map((n) => (
          <button
            key={n}
            type='button'
            disabled={n > max || disabled}
            onClick={() => onChange(n)}
            className={`h-8 cursor-pointer rounded-md text-[11px] font-bold tabular-nums transition disabled:cursor-not-allowed disabled:opacity-30 ${value === n ? 'bg-lime text-bg' : 'bg-raise text-mute hover:text-fg'}`}
          >
            {n === max && n > 10 ? `Tối đa ${n}` : n}
          </button>
        ))}
      </div>
    </div>
  );
};