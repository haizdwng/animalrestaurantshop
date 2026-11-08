import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconBrush, IconEraser, IconPointer, IconTrash } from '@tabler/icons-react';
import { DRAWING_SIZE } from '@/features/avatar/config';

const TOOLS = [
  ['select', 'Chỉnh sửa', IconPointer],
  ['brush', 'Bút vẽ', IconBrush],
  ['eraser', 'Bút tẩy', IconEraser]
];

function RangeControl({ label, value, min, max, suffix, onChange }) {
  return (
    <label className='block min-w-0'>
      <span className='mb-1 flex items-center justify-between gap-2 text-[11px] text-mute' aria-hidden='true'>
        <span>{label}</span>
        <span className='font-bold tabular-nums text-fg'>{value}{suffix}</span>
      </span>
      <input
        type='range'
        aria-label={label}
        aria-valuetext={`${value}${suffix}`}
        min={min}
        max={max}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
        className='block h-5 w-full cursor-pointer accent-lime'
      />
    </label>
  );
};

export default function DrawingTools({ tool, onTool, brush, onBrush, eraserSize, onEraserSize, hasStrokes, onClear }) {
  const buttons = useRef({});
  const panel = useRef(null);
  const panelId = useId();
  const [openTool, setOpenTool] = useState(null);
  const [pos, setPos] = useState(null);

  useLayoutEffect(() => {
    if (!openTool) return;
    const anchor = buttons.current[openTool].getBoundingClientRect();
    const { width, height } = panel.current.getBoundingClientRect();
    const below = anchor.bottom + 4;
    const top = below + height + 8 <= innerHeight ? below : anchor.top - height - 4;
    setPos({
      left: Math.max(8, Math.min(anchor.right - width, innerWidth - width - 8)),
      top: Math.max(8, Math.min(top, innerHeight - height - 8))
    });
    panel.current.querySelector('input')?.focus({ preventScroll: true });
  }, [openTool]);

  useEffect(() => {
    if (!openTool) return;
    const off = () => setOpenTool(null);
    const onScroll = (event) => {
      if (!panel.current?.contains(event.target)) off();
    };
    const onKey = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      off();
      buttons.current[openTool]?.focus({ preventScroll: true });
    };
    const onFocus = (event) => {
      if (!panel.current?.contains(event.target)) off();
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', off);
    document.addEventListener('keydown', onKey);
    document.addEventListener('focusin', onFocus);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', off);
      document.removeEventListener('keydown', onKey);
      document.removeEventListener('focusin', onFocus);
    };
  }, [openTool]);

  const close = () => {
    setOpenTool(null);
    buttons.current[openTool]?.focus({ preventScroll: true });
  };

  return (
    <>
      {TOOLS.map(([key, label, Icon]) => (
        <button
          key={key}
          ref={(node) => { buttons.current[key] = node; }}
          type='button'
          title={label}
          aria-label={label}
          aria-pressed={tool === key}
          aria-haspopup={key === 'select' ? undefined : 'dialog'}
          aria-expanded={key === 'select' ? undefined : openTool === key}
          aria-controls={openTool === key ? panelId : undefined}
          onClick={() => {
            onTool(key);
            setPos(null);
            if (key === 'select') {
              setOpenTool(null);
              return;
            };

            setOpenTool((current) => tool === key ? (current === key ? null : key) : null);
          }}
          className={`grid h-9 w-full cursor-pointer place-items-center rounded-lg border transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-95 ${tool === key ? 'border-lime bg-lime/10 text-lime' : 'border-line bg-raise text-fg hover:border-mute'}`}
        >
          <Icon size={17} />
        </button>
      ))}
      {openTool && createPortal(
        <div className='fixed inset-0 z-40' onClick={close}>
          <div
            ref={panel}
            id={panelId}
            role='dialog'
            aria-label={openTool === 'brush' ? 'Tùy chỉnh bút vẽ' : 'Tùy chỉnh bút tẩy'}
            style={{ ...pos, width: 'min(17rem, calc(100vw - 16px))', maxHeight: 'calc(100dvh - 16px)' }}
            className='fixed overflow-y-auto animate-pop rounded-xl border border-line bg-raise p-3 shadow-2xl shadow-black/60'
            onClick={(event) => event.stopPropagation()}
          >
            {openTool === 'brush' ? (
              <div className='space-y-3'>
                <RangeControl label='Độ lớn' value={brush.size} min={DRAWING_SIZE.min} max={DRAWING_SIZE.max} suffix=' px' onChange={(size) => onBrush({ ...brush, size })} />
                <RangeControl label='Độ mờ đục' value={brush.opacity} min={1} max={100} suffix='%' onChange={(opacity) => onBrush({ ...brush, opacity })} />
                <label className='flex items-center justify-between gap-3 text-[11px] text-mute'>
                  <span>Màu bút <span className='ml-1 font-mono text-fg'>{brush.color.toUpperCase()}</span></span>
                  <input type='color' value={brush.color} onChange={(event) => onBrush({ ...brush, color: event.target.value })} aria-label='Chọn màu bút vẽ' className='h-9 w-12 cursor-pointer rounded-md border border-line bg-bg p-1' />
                </label>
              </div>
            ) : (
              <>
                <div className='flex items-end gap-3'>
                  <div className='min-w-0 flex-1'>
                    <RangeControl label='Độ lớn bút tẩy' value={eraserSize} min={DRAWING_SIZE.min} max={DRAWING_SIZE.max} suffix=' px' onChange={onEraserSize} />
                  </div>
                  <button
                    type='button'
                    title='Xóa tất cả nét vẽ'
                    aria-label='Xóa tất cả nét vẽ'
                    disabled={!hasStrokes}
                    onClick={onClear}
                    className='grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-bad transition hover:bg-bad/10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:bg-transparent'
                  >
                    <IconTrash size={17} />
                  </button>
                </div>
                <p className='mt-2 text-[10px] text-mute'>Bút tẩy chỉ xóa nét vẽ, không xóa nhân vật hoặc phụ kiện.</p>
              </>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
};