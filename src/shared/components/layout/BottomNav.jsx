export default function BottomNav({ nav, current, onNavigate, badgeKeys = [] }) {
  const badges = new Set(badgeKeys);
  return (
    <nav className='pb-safe fixed inset-x-0 bottom-0 z-30 grid h-(--app-bottom-nav-h) border-t border-line bg-bg/90 backdrop-blur-md supports-backdrop-filter:bg-bg/75 md:hidden' style={{ gridTemplateColumns: `repeat(${nav.length}, minmax(0, 1fr))` }}>
      {nav.map(([k, label, Icon]) => (
        <button key={k} onClick={() => onNavigate(k)} aria-current={current === k ? 'page' : undefined} className={`relative flex cursor-pointer flex-col items-center justify-center gap-1 py-2 text-[10px] font-bold transition ${current === k ? 'text-lime' : 'text-mute'}`}>
          {current === k && <span className='absolute top-0 h-0.5 w-10 rounded-full bg-lime' />}
          <span className='relative'>
            <Icon size={22} stroke={current === k ? 2.2 : 1.6} />
            {badges.has(k) && (
              <span className='absolute -top-0.5 -right-1 size-2 rounded-full bg-lime ring-2 ring-bg' aria-label='Có quà đăng nhập' />
            )}
          </span>
          {label}
        </button>
      ))}
    </nav>
  );
};