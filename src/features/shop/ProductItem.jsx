import { IconCheck, IconChevronRight, IconLock, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Coin } from '@/shared/components/ui';
import { hasOptions, isOnce, isOwnedOnce, productOptions } from '@/features/shop/cartUtils';
import { hasPrice } from '@/features/shop/shopUtilities';
import Tile from '@/features/shop/Tile';

export default function ProductItem({ p, poor, cartQuantity = 0, conflictingKeys = new Set(), onBuy }) {
  const grouped = hasOptions(p);
  const choices = productOptions(p);
  const owned = grouped ? choices.every((choice) => isOwnedOnce(choice, p)) : isOwnedOnce(p);
  const conflicting = choices.some((choice) => conflictingKeys.has(choice.key));
  const count = typeof p.owned === 'number' ? `Đang có ${formatNumber(p.owned)}` : '';
  const selected = typeof p.owned === 'string' && p.owned ? `Đang chọn: ${p.owned}` : '';
  return (
    <li>
      <button type='button' onClick={onBuy}
        className='group flex min-h-20 w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-panel p-3 text-left transition hover:border-mute/70 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime'>
        <Tile p={p} />
        <span className='min-w-0 flex-1'>
          <span className='line-clamp-2 text-[13px] leading-snug font-bold'>{p.name || p.key}</span>
          <span className='mt-0.5 block truncate text-[10px] text-mute'>{p.key}</span>
          {grouped && <span className='mt-1 block text-[10px] text-mute'>{formatNumber(p.options.length)} lựa chọn</span>}
          {count && <span className='mt-1 block truncate text-[10px] text-mute'>{count}</span>}
          {selected && <span className='mt-1 block truncate text-[10px] text-coin'>{selected}</span>}
          {!owned && p.owned === true && !isOnce(p) && !grouped && <span className='mt-1 block text-[10px] text-ok'>Đã sở hữu · có thể mua tiếp</span>}
        </span>
        <span className='flex shrink-0 flex-col items-end gap-1.5'>
          {owned ? (
            <span className='flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok'><IconCheck size={12} /> Đã mua</span>
          ) : conflicting ? (
            <span className='flex items-center gap-1 rounded-full bg-bad/10 px-2 py-0.5 text-[10px] font-bold text-bad'><IconLock size={12} /> Mã trùng</span>
          ) : cartQuantity > 0 ? (
            <span className='flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-bold text-lime'><IconShoppingCart size={12} /> {formatNumber(cartQuantity)} trong giỏ</span>
          ) : grouped ? (
            <span className='text-[10px] font-medium text-mute'>Chọn loại</span>
          ) : hasPrice(p) ? (
            <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${poor ? 'text-mute' : 'text-coin'}`}><Coin size={14} /> {formatNumber(p.price)}</span>
          ) : null}
          {!owned && <span className='grid size-7 place-items-center rounded-lg bg-raise text-mute transition group-hover:bg-line group-hover:text-fg'>
            {grouped ? <IconChevronRight size={15} /> : cartQuantity ? <IconCheck size={15} /> : <IconPlus size={15} />}
          </span>}
        </span>
      </button>
    </li>
  );
};