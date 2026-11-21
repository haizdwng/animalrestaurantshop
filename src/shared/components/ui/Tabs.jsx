import { useEffect, useRef } from 'react';

export default function Tabs({ tabs, value, onChange, label = 'Điều hướng danh mục', equal = false }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (equal) return;
    const container = containerRef.current;
    const selected = [...(container?.children || [])].find((child) => child.getAttribute('aria-selected') === 'true');
    if (!container || !selected) return;
    const target = container.scrollLeft + selected.getBoundingClientRect().left - container.getBoundingClientRect().left - (container.clientWidth - selected.clientWidth) / 2;
    container.scrollTo({ left: Math.max(0, target), behavior: 'auto' });
  }, [value, equal]);

  return (
    <div ref={containerRef} role='tablist' aria-label={label} className={`no-scrollbar w-full min-w-0 max-w-full gap-1 rounded-xl border border-line bg-panel p-1 ${equal ? 'grid grid-cols-2' : 'flex overflow-x-auto overscroll-x-contain'}`}>
      {tabs.map(([key, title, Icon]) => (
        <button key={key} role='tab' type='button' aria-selected={value === key} onClick={() => onChange(key)} className={`ui-nav-item min-h-10 whitespace-nowrap ${equal ? 'min-w-0 w-full shrink justify-center' : 'shrink-0'} ${value === key ? 'bg-raise text-fg' : ''}`}>
          {Icon && <Icon size={16} className='shrink-0' />} {title}
        </button>
      ))}
    </div>
  );
};