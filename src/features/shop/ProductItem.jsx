import { IconCheck, IconChevronRight, IconPlus, IconShoppingCart } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Coin } from '@/shared/components/ui';
import { hasPrice } from '@/features/shop/shopUtilities';
import { hasOptions } from '@/features/shop/cartUtils';
import Tile from '@/features/shop/Tile';

export default function ProductItem({ p, poor, owned, cartQuantity = 0, onBuy }) {
  const grouped = hasOptions(p);
  const inventory = p.owned;
  const inventoryLabel = typeof inventory === 'number' ? `Đã có ${formatNumber(inventory)}` : typeof inventory === 'string' && inventory ? `Đang dùng: ${inventory}` : '';
  return (
    <li>
      <button
        type='button'
        onClick={onBuy}
        disabled={owned}
        className='group flex min-h-19.5 w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-panel p-3 text-left transition hover:border-mute/60 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime disabled:cursor-default disabled:opacity-55 disabled:hover:border-line disabled:hover:bg-panel'
      >
        <Tile p={p} />
        <span className='min-w-0 flex-1'>
          <span className='line-clamp-2 text-[13px] leading-snug font-bold'>{p.name || p.key}</span>
          <span className='mt-0.5 block truncate text-[10px] text-mute'>{p.key}</span>
          {grouped && <span className='mt-1 block text-[10px] text-mute'>{formatNumber(p.options.length)} tùy chọn</span>}
          {!owned && inventoryLabel && <span className='mt-1 block max-w-full truncate text-[10px] text-mute'>{inventoryLabel}</span>}
        </span>
        <span className='flex shrink-0 flex-col items-end gap-1.5'>
          {owned ? (
            <span className='flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok'>
              <IconCheck size={12} stroke={2.6} /> Đã mua
            </span>
          ) : cartQuantity > 0 ? (
            <span className='flex items-center gap-1 rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-bold text-lime'>
              <IconShoppingCart size={12} /> {p.once ? 'Đã thêm' : `Đã thêm ${formatNumber(cartQuantity)}`}
            </span>
          ) : grouped ? (
            <span className='text-[10px] font-bold text-mute'>Chọn loại</span>
          ) : hasPrice(p) ? (
            <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${poor ? 'text-mute' : 'text-coin'}`}>
              <Coin size={14} /> {formatNumber(p.price)}
            </span>
          ) : null}
          {!owned && (
            <span className='grid size-7 place-items-center rounded-lg bg-raise text-mute transition group-hover:bg-lime group-hover:text-bg'>
              {grouped ? <IconChevronRight size={15} /> : cartQuantity ? <IconCheck size={15} stroke={2.4} /> : <IconPlus size={15} stroke={2.4} />}
            </span>
          )}
        </span>
      </button>
    </li>
  );
};