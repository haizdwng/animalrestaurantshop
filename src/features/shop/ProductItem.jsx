import { IconCheck, IconChevronRight, IconLock, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Badge, Coin } from '@/shared/components/ui';
import { hasOptions, isOnce, isOwnedOnce, productOptions } from '@/features/shop/cartUtils';
import { hasPrice } from '@/features/shop/shopUtilities';
import Tile from '@/features/shop/Tile';

export default function ProductItem({ p, poor, cartQuantity = 0, conflictingKeys = new Set(), onBuy }) {
  const grouped = hasOptions(p);
  const options = productOptions(p);
  const owned = grouped ? options.every((option) => isOwnedOnce(option, p)) : isOwnedOnce(p);
  const conflicting = options.some((option) => conflictingKeys.has(option.key));
  const inventory = typeof p.owned === 'number' ? `Đang có ${formatNumber(p.owned)}` : '';
  const selected = typeof p.owned === 'string' && p.owned ? `Đang chọn: ${p.owned}` : '';

  return (
    <li>
      <button type='button' onClick={onBuy}
        className='ui-panel group flex min-h-20 w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:border-mute/70 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime'>
        <Tile p={p} />
        <span className='min-w-0 flex-1'>
          <span className='line-clamp-2 text-[13px] leading-snug font-bold'>{p.name || p.key}</span>
          <span className='mt-0.5 block truncate font-mono text-[10px] text-mute'>{p.key}</span>
          {grouped && <span className='mt-1 block text-[11px] text-mute'>{formatNumber(p.options.length)} lựa chọn</span>}
          {inventory && <span className='mt-1 block truncate text-[11px] text-mute'>{inventory}</span>}
          {selected && <span className='mt-1 block truncate text-[11px] text-coin'>{selected}</span>}
          {!owned && p.owned === true && !isOnce(p) && !grouped && <span className='mt-1 block text-[11px] text-ok'>Đã sở hữu · có thể mua tiếp</span>}
        </span>
        <span className='flex shrink-0 flex-col items-end gap-1.5'>
          {owned ? <Badge Icon={IconCheck} tone='success'>Đã mua</Badge> : conflicting ? <Badge Icon={IconLock} tone='danger'>Mã trùng</Badge> : cartQuantity > 0 ? <Badge Icon={IconShoppingCart} tone='accent'>{formatNumber(cartQuantity)} trong giỏ</Badge> : grouped ? <span className='text-[11px] font-semibold text-mute'>Chọn loại</span> : hasPrice(p) ? <span className={`flex items-center gap-1 text-xs font-extrabold tabular-nums ${poor ? 'text-mute' : 'text-coin'}`}><Coin size={15} /> {formatNumber(p.price)}</span> : null}
          {!owned && <span aria-hidden className='grid size-7 place-items-center rounded-lg bg-raise text-mute transition-colors group-hover:bg-line group-hover:text-fg'>
            {grouped ? <IconChevronRight size={16} /> : cartQuantity ? <IconCheck size={16} /> : <IconPlus size={16} />}
          </span>}
        </span>
      </button>
    </li>
  );
};