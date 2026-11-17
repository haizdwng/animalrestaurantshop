import { IconMinus, IconPlus } from '@tabler/icons-react';
import { clampCartQuantity } from '@/features/shop/cartUtils';

export default function QuantityPicker({ value, max, disabled = false, onChange, onEnter, compact = false }) {
  const change = (nextValue) => onChange(clampCartQuantity(nextValue, max));
  const buttonClass = 'grid shrink-0 cursor-pointer place-items-center text-mute transition hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-30';
  const input = (
    <div className={`flex items-stretch overflow-hidden rounded-lg border border-line bg-bg transition-colors focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/15 ${compact ? 'h-9' : 'h-12'}`}>
      <button type='button' aria-label='Giảm số lượng' disabled={disabled || value <= 1} onClick={() => change(value - 1)} className={`${buttonClass} ${compact ? 'w-9' : 'w-12'}`}>
        <IconMinus size={compact ? 15 : 18} />
      </button>
      <input type='number' inputMode='numeric' min={1} max={max} aria-label='Số lượng vật phẩm' value={value} disabled={disabled}
        onChange={(event) => change(event.target.value)}
        onKeyDown={(event) => { if (event.key === 'Enter' && onEnter) { event.preventDefault(); onEnter(); } }}
        className={`min-w-0 flex-1 bg-transparent text-center font-bold tabular-nums outline-none disabled:opacity-60 ${compact ? 'w-13 text-xs' : 'text-lg'}`} />
      <button type='button' aria-label='Tăng số lượng' disabled={disabled || value >= max} onClick={() => change(value + 1)} className={`${buttonClass} ${compact ? 'w-9' : 'w-12'}`}>
        <IconPlus size={compact ? 15 : 18} />
      </button>
    </div>
  );
  if (compact) return input;
  return (
    <div>
      <span className='mb-1.5 block text-[11px] font-medium text-mute'>Số lượng mỗi lần mua</span>
      {input}
      <div className='mt-2 grid grid-cols-4 gap-1.5'>
        {[...new Set([1, 5, 10, max])].map((quantity) => (
          <button key={quantity} type='button' disabled={disabled || quantity > max} onClick={() => change(quantity)}
            className={`h-8 cursor-pointer rounded-lg border text-[11px] font-bold tabular-nums transition disabled:cursor-not-allowed disabled:opacity-30 ${value === quantity ? 'border-lime bg-lime text-bg' : 'border-line bg-raise text-mute hover:text-fg'}`}>
            {quantity.toLocaleString('vi-VN')}
          </button>
        ))}
      </div>
    </div>
  );
};