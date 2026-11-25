import { IconChevronRight, IconClock, IconLock, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Badge, Coin } from '@/shared/components/ui';
import { hasOptions, hasValidPrice, isAvailable, ownedLabel } from '@/features/shop/cartUtils';
import Tile from '@/features/shop/Tile';

export default function ProductItem({ p, poor, cartQuantity = 0, onBuy, maxQuantity = 100, now = Date.now() }) {
  const available = isAvailable(p, maxQuantity, now);
  const grouped = hasOptions(p);
  const owned = ownedLabel(p);
  const time = (p.startTime != null && now < p.startTime) || (p.endTime != null && now >= p.endTime);
  return (
    <li>
      <button type='button' onClick={onBuy} className='ui-panel group flex min-h-20 w-full cursor-pointer items-center gap-3 p-3 text-left transition-colors hover:border-mute/70 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime'>
        <Tile p={p} />
        <span className='min-w-0 flex-1'>
          <span className='line-clamp-2 text-[13px] leading-snug font-bold'>{p.name || p.key}</span>
          <span className='mt-0.5 block truncate font-mono text-[10px] text-mute'>{p.key}</span>
          {p.description?.trim() && <span className='mt-1 block line-clamp-2 text-[11px] text-mute'>{p.description}</span>}
          {owned && <span className='mt-1 block truncate text-[11px] text-mute'>{owned}{typeof p.owned === 'number' && p.unit ? ` ${p.unit}` : ''}</span>}
        </span>
        <span className='flex shrink-0 flex-col items-end gap-1.5'>
          {cartQuantity > 0 ? <Badge Icon={IconShoppingCart} tone='accent'>{formatNumber(cartQuantity)} trong giỏ</Badge> : !available ? <Badge Icon={time ? IconClock : IconLock} tone='neutral'>{time ? 'Ngoài thời gian bán' : 'Chưa thể mua'}</Badge> : grouped ? <span className='text-[11px] font-semibold text-mute'>Chọn loại</span> : hasValidPrice(p) ? <span className={`flex items-center gap-1 text-xs font-extrabold tabular-nums ${poor ? 'text-mute' : 'text-coin'}`}><Coin size={15} /> {formatNumber(p.price)}</span> : null}
          <span aria-hidden className='grid size-7 place-items-center rounded-lg bg-raise text-mute transition-colors group-hover:bg-line group-hover:text-fg'>
            {grouped ? <IconChevronRight size={16} /> : <IconPlus size={16} />}
          </span>
        </span>
      </button>
    </li>
  );
};