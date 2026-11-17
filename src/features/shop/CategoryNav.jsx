import { IconBox } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Coin, Skeleton } from '@/shared/components/ui';
import { CATEGORY_ICONS, TOPUP } from '@/features/shop/config';

const CoinIcon = ({ size }) => <Coin size={size} />;

function CategoryButton({ id, name, Icon, count, active, featured, onSelect }) {
  return (
    <button type='button' aria-current={active ? 'page' : undefined}
      onClick={() => {
        onSelect(id);
        if (window.scrollY > 0) window.scrollTo({ top: 0, behavior: 'auto' });
      }}
      className={`ui-nav-item relative w-full shrink-0 justify-start text-left md:w-full ${active && featured ? 'border-coin/30! bg-coin/10! text-coin!' : ''}`}>
      <Icon size={17} className={`shrink-0 ${active && !featured ? 'text-lime' : ''}`} />
      <span className='min-w-0 flex-1 whitespace-nowrap'>{name}</span>
      {count !== undefined && <span className={`rounded-md px-1.5 text-[10px] tabular-nums ${active ? 'bg-bg/60' : 'bg-raise'} ${count === 0 ? 'opacity-50' : ''}`}>{formatNumber(count)}</span>}
    </button>
  );
};

export default function CategoryNav({ tabs, tabId, hits, onSelect }) {
  const categories = tabs || [];
  const active = (id) => tabId === id || (!tabId && id === categories[0]?.id);
  return (
    <aside className='sticky top-(--app-header-h) z-20 min-w-0 border-b border-line bg-bg/95 backdrop-blur-xl md:top-[calc(var(--app-header-h)+1rem)] md:max-h-[calc(100dvh-var(--app-header-h)-2rem)] md:self-start md:overflow-y-auto md:border-0 md:bg-transparent md:backdrop-blur-none'>
      <p className='hidden px-3 pb-2 text-[11px] font-bold tracking-wider text-mute uppercase md:block'>Danh mục</p>
      <nav aria-label='Danh mục cửa hàng' className='no-scrollbar flex gap-1 overflow-x-auto px-3 py-2 md:flex-col md:p-0'>
        {tabs ? categories.map(({ id, name }) => <CategoryButton key={id} id={id} name={name} Icon={CATEGORY_ICONS[id] || IconBox} count={hits[id]} active={active(id)} onSelect={onSelect} />) : Array.from({ length: 5 }, (_, index) => <Skeleton key={index} className='h-9 w-27 shrink-0 md:w-full' />)}
        <div aria-hidden className='mx-1 w-px shrink-0 bg-line md:mx-0 md:my-2 md:h-px md:w-auto' />
        <CategoryButton id={TOPUP} name='Mua xu' Icon={CoinIcon} active={active(TOPUP)} featured onSelect={onSelect} />
      </nav>
    </aside>
  );
};