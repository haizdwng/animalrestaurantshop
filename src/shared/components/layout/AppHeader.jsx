import { Coin, Logo, Spinner } from '@/shared/components/ui';
import { formatNumber } from '@/shared/library/format';

export default function AppHeader({ nav, current, onNavigate, coins, syncing, onRefresh }) {
  return (
    <header className='sticky top-0 z-30 border-b border-line bg-bg/85 backdrop-blur-md supports-backdrop-filter:bg-bg/75'>
      <div className='mx-auto flex h-(--app-header-h) max-w-6xl items-center gap-3 px-4 md:gap-4 md:px-6'>
        <Logo />
        <nav className='ml-2 hidden min-w-0 flex-1 items-center gap-1 overflow-x-auto rounded-lg bg-panel p-1 md:flex'>
          {nav.map(([k, label, Icon]) => (
            <button
              key={k}
              onClick={() => onNavigate(k)}
              aria-current={current === k ? 'page' : undefined}
              className={`flex h-8 cursor-pointer items-center gap-2 rounded-md px-3 text-xs font-bold transition ${current === k ? 'bg-raise text-fg shadow-sm' : 'text-mute hover:text-fg'}`}
            >
              <Icon size={16} /> {label}
            </button>
          ))}
        </nav>
        <button
          onClick={onRefresh}
          title='Số xu hiện có (bấm để cập nhật)'
          className='ml-auto flex h-9 shrink-0 cursor-pointer items-center gap-2 rounded-full border border-coin/30 bg-coin/10 pr-3.5 pl-1.5 text-sm font-bold tabular-nums text-coin transition hover:bg-coin/15'
        >
          {syncing ? <Spinner size={20} /> : <Coin size={22} />}
          <span key={coins} className='animate-rise'>
            {formatNumber(coins)}
          </span>
        </button>
      </div>
      {syncing && (
        <span className='absolute inset-x-0 -bottom-px h-px overflow-hidden'>
          <span className='block h-full w-1/3 animate-indeterminate bg-lime' />
        </span>
      )}
    </header>
  );
};