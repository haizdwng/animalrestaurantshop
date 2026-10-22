import { IconBox } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Coin, Skeleton } from '@/shared/components/ui';
import { CATEGORY_ICONS, TOPUP } from '@/features/shop/config';

const CoinIcon = ({ size }) => <Coin size={size} />

function CategoryButton({ id, name, Icon, count, accent, on, onSelect }) {
  return (
    <button
      type='button'
      role='tab'
      aria-selected={on}
      onClick={() => {
        onSelect(id)
        if (window.scrollY > 0) window.scrollTo({ top: 0 })
      }}
      className={`flex shrink-0 cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-left text-xs font-bold transition md:w-full ${on ? (accent ? 'bg-coin text-bg' : 'bg-raise text-fg') : 'text-mute hover:bg-panel hover:text-fg'}`}
    >
      <Icon size={17} className={on && !accent ? 'text-lime' : ''} />
      <span className='flex-1 whitespace-nowrap'>{name}</span>
      {count !== undefined && <span className={`rounded px-1.5 text-[10px] tabular-nums ${on ? 'bg-bg/40' : 'bg-panel'} ${count === 0 ? 'opacity-40' : ''}`}>{formatNumber(count)}</span>}
    </button>
  );
};

export default function CategoryNav({ tabs, tabId, hits, onSelect }) {
  const list = tabs || [];
  const isOn = (id) => tabId === id || (!tabId && id === list[0]?.id);
  return (
    <aside className='sticky top-(--app-header-h) z-20 border-b border-line bg-bg/90 backdrop-blur-md supports-backdrop-filter:bg-bg/75 md:top-[calc(var(--app-header-h)+1rem)] md:max-h-[calc(100dvh-var(--app-header-h)-2rem)] md:self-start md:overflow-y-auto md:border-0 md:bg-transparent md:backdrop-blur-none'>
      <p className='hidden px-3 pb-2 text-[10px] font-bold tracking-[0.2em] text-mute uppercase md:block'>Danh mục</p>
      <div role='tablist' className='no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:overflow-visible md:p-0'>
        {tabs
          ? list.map((t) => <CategoryButton key={t.id} id={t.id} name={t.name} Icon={CATEGORY_ICONS[t.id] || IconBox} count={hits[t.id]} on={isOn(t.id)} onSelect={onSelect} />)
          : Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className='h-8.25 w-28 shrink-0 rounded-lg md:w-full' />)}
        <div className='mx-1 w-px shrink-0 bg-line md:mx-0 md:my-2 md:h-px md:w-auto' />
        <CategoryButton key={TOPUP} id={TOPUP} name='Mua xu' Icon={CoinIcon} accent on={isOn(TOPUP)} onSelect={onSelect} />
      </div>
    </aside>
  );
};