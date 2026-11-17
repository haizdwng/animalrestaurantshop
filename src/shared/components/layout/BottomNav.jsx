export default function BottomNav({ nav, current, onNavigate, badgeKeys = [] }) {
  const badges = new Set(badgeKeys);
  return (
    <nav aria-label='Điều hướng trên điện thoại'
      className='pb-safe fixed inset-x-0 bottom-0 z-30 grid h-(--app-bottom-nav-h) border-t border-line bg-bg/95 backdrop-blur-xl md:hidden'
      style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0,1fr))` }}>
      {nav.map(([key, title, Icon]) => (
        <button key={key} type='button' onClick={() => onNavigate(key)} aria-current={current === key ? 'page' : undefined}
          className={`relative flex min-w-0 cursor-pointer flex-col items-center justify-center gap-1 rounded-lg py-2 text-[10px] font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-lime ${current === key ? 'text-lime' : 'text-mute hover:text-fg'}`}>
          {current === key && <span aria-hidden className='absolute inset-x-1/4 top-0 h-0.5 rounded-full bg-lime' />}
          <span className='relative'><Icon size={22} stroke={current === key ? 2.1 : 1.7} />
            {badges.has(key) && <span aria-label='Có thông báo mới' className='absolute -top-0.5 -right-1 size-2 rounded-full bg-lime ring-2 ring-bg' />}
          </span>
          <span className='max-w-full truncate px-1'>{title}</span>
        </button>
      ))}
    </nav>
  );
};