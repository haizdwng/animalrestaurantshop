import { IconCheck, IconPlus } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Coin } from '@/shared/components/ui';
import { hasPrice } from '@/features/shop/shopUtilities';
import Tile from '@/features/shop/Tile';

export default function ProductItem({ p, poor, owned, onBuy }) {
  return (
    <li>
      <button
        type='button'
        onClick={onBuy}
        disabled={owned}
        className='group disabled:cursor-default disabled:opacity-55 disabled:hover:border-line disabled:hover:bg-panel flex h-19.5 w-full cursor-pointer items-center gap-3 rounded-xl border border-line bg-panel p-3 text-left transition hover:border-mute/60 hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime'
      >
        <Tile p={p} />
        <span className='min-w-0 flex-1'>
          <span className='line-clamp-2 text-[13px] leading-snug font-bold'>{p.name}</span>
          <span className='mt-0.5 block truncate text-[10px] text-mute'>{p.id}</span>
        </span>
        <span className='flex shrink-0 flex-col items-end gap-1.5'>
          {owned ? (
            <span className='flex items-center gap-1 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok'>
              <IconCheck size={12} stroke={2.6} /> Đã mua
            </span>
          ) : (
            hasPrice(p) && (
              <span className={`flex items-center gap-1 text-xs font-bold tabular-nums ${poor ? 'text-mute' : 'text-coin'}`}>
                <Coin size={14} /> {formatNumber(p.price)}
              </span>
            )
          )}
          {!owned && (
            <span className='grid size-7 place-items-center rounded-lg bg-raise text-mute transition group-hover:bg-lime group-hover:text-bg'>
              <IconPlus size={15} stroke={2.4} />
            </span>
          )}
        </span>
      </button>
    </li>
  );
};