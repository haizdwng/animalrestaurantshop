import { useEffect, useId, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconDotsVertical } from '@tabler/icons-react';

const ROW_HEIGHT = 40;
export default function Menu({ items = [], label = 'Tùy chọn', disabled = false }) {
  const button = useRef(null);
  const menu = useRef(null);
  const menuId = useId();
  const [position, setPosition] = useState(null);
  const shown = items.filter((item) => !item.hidden);
  const open = Boolean(position);

  useEffect(() => {
    if (!open) return;
    const close = () => setPosition(null);
    const keyboard = (event) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        button.current?.focus();
      } else if (event.key === 'Tab') close();
      else if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
        const active = [...(menu.current?.querySelectorAll('button:not([disabled])') || [])];
        if (!active.length) return;
        event.preventDefault();
        const index = active.indexOf(document.activeElement);
        active[(index + (event.key === 'ArrowDown' ? 1 : active.length - 1)) % active.length].focus();
      };
    };
    window.addEventListener('scroll', close, true);
    window.addEventListener('resize', close);
    document.addEventListener('keydown', keyboard);
    return () => {
      window.removeEventListener('scroll', close, true);
      window.removeEventListener('resize', close);
      document.removeEventListener('keydown', keyboard);
    };
  }, [open]);

  useEffect(() => { if (disabled) setPosition(null); }, [disabled]);

  const toggle = () => {
    if (disabled || !shown.length) return;
    if (open) return setPosition(null);
    const rectangle = button.current.getBoundingClientRect();
    const width = 216;
    const maxHeight = Math.min(window.innerHeight - 24, shown.length * ROW_HEIGHT + 12);
    const top = rectangle.bottom + maxHeight + 8 < window.innerHeight ? rectangle.bottom + 6 : Math.max(12, rectangle.top - maxHeight - 6);
    setPosition({ top, left: Math.max(12, Math.min(rectangle.right - width, window.innerWidth - width - 12)) });
    requestAnimationFrame(() => menu.current?.querySelector('button:not([disabled])')?.focus({ preventScroll: true }));
  };

  if (!shown.length) return null;
  return <>
    <button ref={button} type='button' onClick={toggle} disabled={disabled} aria-label={label} aria-haspopup='menu' aria-expanded={open} aria-controls={open ? menuId : undefined}
      className={`grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg text-mute transition-colors hover:bg-raise hover:text-fg focus-visible:outline-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-50 ${open ? 'bg-raise text-fg' : ''}`}>
      <IconDotsVertical size={19} />
    </button>
    {open && createPortal(
      <div className='fixed inset-0 z-50' onPointerDown={(event) => { if (event.target === event.currentTarget) setPosition(null); }}>
        <div id={menuId} ref={menu} role='menu' aria-label={label} style={position}
          className='fixed z-10 max-h-[calc(100dvh-24px)] w-54 overflow-auto rounded-xl border border-line bg-panel p-1.5 shadow-(--ui-shadow) animate-pop'>
          {shown.map(({ label: itemLabel, Icon, onClick, danger, disabled: itemDisabled }) => (
            <button key={itemLabel} type='button' role='menuitem' disabled={itemDisabled}
              className={`flex min-h-10 w-full cursor-pointer items-center gap-2.5 rounded-lg px-3 text-left text-xs font-semibold transition-colors disabled:cursor-not-allowed disabled:opacity-45 ${danger ? 'text-bad hover:bg-bad/10' : 'text-fg hover:bg-raise'}`}
              onClick={() => { setPosition(null); onClick?.(); }}>
              {Icon && <Icon size={16} className='shrink-0' />} {itemLabel}
            </button>
          ))}
        </div>
      </div>, document.body
    )}
  </>;
};