import { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconDotsVertical } from '@tabler/icons-react';

const ITEM_H = 44;

export default function Menu({ items, label = 'Tuỳ chọn' }) {
  const btn = useRef(null);
  const [pos, setPos] = useState(null);
  const shown = items.filter((i) => !i.hidden);

  useEffect(() => {
    if (!pos) return;
    const off = () => setPos(null);
    const onKey = (e) => e.key === 'Escape' && off();
    window.addEventListener('scroll', off, true);
    window.addEventListener('resize', off);
    document.addEventListener('keydown', onKey);
    return () => {
      window.removeEventListener('scroll', off, true);
      window.removeEventListener('resize', off);
      document.removeEventListener('keydown', onKey);
    };
  }, [pos]);

  const toggle = () => {
    if (pos) return setPos(null);
    const r = btn.current.getBoundingClientRect();
    const up = r.bottom + ITEM_H * shown.length + 16 > innerHeight;
    setPos({ right: innerWidth - r.right, ...(up ? { bottom: innerHeight - r.top + 4 } : { top: r.bottom + 4 }) });
  };

  if (!shown.length) return null;
  return (
    <>
      <button ref={btn} onClick={toggle} aria-label={label} aria-expanded={!!pos} className={`grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg transition hover:bg-raise hover:text-fg ${pos ? 'bg-raise text-fg' : 'text-mute'}`}>
        <IconDotsVertical size={17} />
      </button>
      {pos &&
        createPortal(
          <div className='fixed inset-0 z-40' onClick={() => setPos(null)}>
            <div role='menu' style={pos} className='fixed min-w-44 animate-pop rounded-xl border border-line bg-raise p-1 shadow-2xl shadow-black/60' onClick={(e) => e.stopPropagation()}>
              {shown.map(({ label: l, Icon, onClick, danger }) => (
                <button
                  key={l}
                  role='menuitem'
                  onClick={() => {
                    setPos(null);
                    onClick();
                  }}
                  className={`flex h-9 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-left text-xs font-bold transition ${danger ? 'text-bad hover:bg-bad/10' : 'text-fg hover:bg-line'}`}
                >
                  {Icon && <Icon size={15} className={danger ? '' : 'text-mute'} />} {l}
                </button>
              ))}
            </div>
          </div>,
          document.body
        )}
    </>
  );
};