import { Coin, Logo, Spinner, Tooltip } from '@/shared/components/ui';
import { formatNumber } from '@/shared/library/format';

export default function AppHeader({ nav, current, onNavigate, coins, syncing, coinSyncing, onRefresh, badgeKeys = [] }) {
  const badges = new Set(badgeKeys);
  return (
    <header className='sticky top-0 z-30 border-b border-line bg-bg/95 backdrop-blur-xl'>
      <div className='mx-auto flex h-(--app-header-h) max-w-6xl items-center gap-3 px-4 md:gap-5 md:px-6'>
        <Logo />
        <nav aria-label='Điều hướng chính' className='no-scrollbar ml-2 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-xl border border-line bg-panel p-1 md:flex'>
          {nav.map(([key, title, Icon]) => (
            <button key={key} type='button' onClick={() => onNavigate(key)} aria-current={current === key ? 'page' : undefined}
              className='ui-nav-item relative shrink-0'>
              <Icon size={17} /> {title}
              {badges.has(key) && <span aria-hidden className='absolute top-1 right-1 size-1.5 rounded-full bg-lime' />}
            </button>
          ))}
        </nav>
        <Tooltip text='Số xu hiện có · Bấm để cập nhật' align='end' className='ml-auto shrink-0'>
          <button type='button' onClick={onRefresh} aria-label={`Hiện có ${formatNumber(coins)} xu. Bấm để cập nhật`} aria-busy={coinSyncing || undefined}
            className='flex h-10 cursor-pointer items-center gap-2 rounded-xl border border-coin/30 bg-coin/10 px-3 text-sm font-bold text-coin tabular-nums transition-colors hover:bg-coin/15'>
            {coinSyncing ? <Spinner size={19} /> : <Coin size={20} />}
            <span className='min-w-5 text-right'>{formatNumber(coins)}</span>
          </button>
        </Tooltip>
      </div>
      {syncing && <div role='progressbar' aria-label='Đang đồng bộ dữ liệu' className='absolute inset-x-0 -bottom-px h-px overflow-hidden'><span className='block h-full w-1/3 animate-indeterminate bg-lime' /></div>}
    </header>
  );
};