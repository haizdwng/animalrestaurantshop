import { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { IconAdjustmentsHorizontal, IconBrush, IconEraser, IconPointer, IconTrash, IconX } from '@tabler/icons-react';
import { DRAWING_SIZE } from '@/features/avatar/config';

const TOOLS = [
  ['select', 'Chỉnh sửa', IconPointer],
  ['brush', 'Bút vẽ', IconBrush],
  ['eraser', 'Bút tẩy', IconEraser]
];

function RangeControl({ label, value, min, max, suffix, onChange }) {
  return <label className='block'>
    <span className='mb-1 flex justify-between gap-2 text-[11px] text-mute'>
      <span>{label}</span><span className='font-bold tabular-nums text-fg'>{value}{suffix}</span>
    </span>
    <input type='range' aria-label={label} aria-valuetext={`${value}${suffix}`} min={min} max={max} value={value}
      onChange={(event) => onChange(Number(event.target.value))} className='block h-6 w-full cursor-pointer accent-lime' />
  </label>;
}

export default function DrawingTools({ tool, onTool, brush, onBrush, eraserSize, onEraserSize, hasStrokes, onClear }) {
  const buttons = useRef({});
  const panel = useRef(null);
  const panelId = useId();
  const [openTool, setOpenTool] = useState(null);
  const [position, setPosition] = useState(null);

  useLayoutEffect(() => {
    if (!openTool || !panel.current || !buttons.current[openTool]) return;
    const anchor = buttons.current[openTool].getBoundingClientRect();
    const bounds = panel.current.getBoundingClientRect();
    const below = anchor.bottom + 8;
    const top = below + bounds.height + 8 <= window.innerHeight ? below : Math.max(8, anchor.top - bounds.height - 8);
    const left = Math.max(8, Math.min(anchor.left, window.innerWidth - bounds.width - 8));
    setPosition({ left, top });
  }, [openTool]);

  useEffect(() => {
    if (!openTool) return;
    const onOutside = (event) => {
      if (panel.current?.contains(event.target) || buttons.current[openTool]?.contains(event.target)) return;
      setOpenTool(null);
    };
    const onKeyDown = (event) => {
      if (event.key !== 'Escape') return;
      event.preventDefault();
      event.stopPropagation();
      setOpenTool(null);
      buttons.current[openTool]?.focus({ preventScroll: true });
    };
    const onScroll = (event) => { if (!panel.current?.contains(event.target)) setOpenTool(null); };
    const onResize = () => setOpenTool(null);
    document.addEventListener('pointerdown', onOutside, true);
    document.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('resize', onResize);
    return () => {
      document.removeEventListener('pointerdown', onOutside, true);
      document.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('resize', onResize);
    };
  }, [openTool]);

  const choose = (key) => {
    setPosition(null);
    if (key === 'select') {
      setOpenTool(null);
      onTool(key);
    } else if (tool !== key) {
      setOpenTool(null);
      onTool(key);
    } else setOpenTool((current) => current === key ? null : key);
  };
  const close = () => {
    const current = openTool;
    setOpenTool(null);
    buttons.current[current]?.focus({ preventScroll: true });
  };

  return <>
    {TOOLS.map(([key, label, Icon]) => {
      const active = tool === key;
      const expanded = openTool === key;
      const editable = key !== 'select';
      const hint = expanded ? 'Nhấn lại để đóng tùy chỉnh' : active && editable ? 'Nhấn thêm lần nữa để mở tùy chỉnh' : 'Nhấn để chọn công cụ';
      return <button key={key} ref={(element) => { buttons.current[key] = element; }}
        type='button' title={`${label} — ${hint}`} aria-label={label} aria-description={hint}
        aria-pressed={active} aria-haspopup={editable ? 'dialog' : undefined}
        aria-expanded={editable ? expanded : undefined} aria-controls={expanded ? panelId : undefined}
        onClick={() => choose(key)}
        className={`relative grid h-10 w-full cursor-pointer place-items-center rounded-lg border transition-[background-color,border-color,color,box-shadow,transform] duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-[.96] ${
          expanded ? 'border-lime bg-lime text-bg ring-2 ring-lime/30' : active ? 'border-lime bg-lime/15 text-lime ring-1 ring-inset ring-lime/50' : 'border-line bg-raise text-mute hover:border-mute hover:text-fg'
        }`}>
        <Icon size={19} />
        {active && editable && <span aria-hidden='true' className={`absolute -right-1 -bottom-1 grid size-4 place-items-center rounded-full border border-panel ${expanded ? 'bg-bg text-lime' : 'bg-lime text-bg'}`}><IconAdjustmentsHorizontal size={10} /></span>}
      </button>;
    })}
    {openTool && createPortal(
      <div ref={panel} id={panelId} role='dialog' aria-modal='false'
        aria-label={openTool === 'brush' ? 'Tùy chỉnh bút vẽ' : 'Tùy chỉnh bút tẩy'}
        style={{ ...(position || { left: 8, top: 8 }), width: 'min(18rem, calc(100vw - 16px))', maxHeight: 'calc(100dvh - 16px)', visibility: position ? 'visible' : 'hidden' }}
        className='fixed z-60 overflow-y-auto rounded-xl border border-lime/35 bg-panel p-3 shadow-2xl shadow-black/60 animate-pop'>
        <header className='mb-3 flex items-center gap-2 border-b border-line pb-2'>
          <IconAdjustmentsHorizontal size={17} className='text-lime' />
          <h3 className='min-w-0 flex-1 text-xs font-bold'>Tùy chỉnh {openTool === 'brush' ? 'bút vẽ' : 'bút tẩy'}</h3>
          <button type='button' onClick={close} title='Đóng tùy chỉnh' aria-label='Đóng tùy chỉnh' className='grid size-7 cursor-pointer place-items-center rounded-md text-mute hover:bg-raise hover:text-fg'><IconX size={16} /></button>
        </header>
        {openTool === 'brush' ? <div className='space-y-3'>
          <RangeControl label='Độ lớn' value={brush.size} min={DRAWING_SIZE.min} max={DRAWING_SIZE.max} suffix=' px' onChange={(size) => onBrush({ ...brush, size })} />
          <RangeControl label='Độ mờ đục' value={brush.opacity} min={1} max={100} suffix='%' onChange={(opacity) => onBrush({ ...brush, opacity })} />
          <label className='flex items-center justify-between gap-3 text-[11px] text-mute'>
            <span>Màu bút <span className='ml-1 font-mono text-fg'>{brush.color.toUpperCase()}</span></span>
            <input type='color' value={brush.color} aria-label='Chọn màu bút vẽ' onChange={(event) => onBrush({ ...brush, color: event.target.value })} className='h-9 w-12 cursor-pointer rounded-md border border-line bg-bg p-1' />
          </label>
        </div> : <>
          <div className='flex items-end gap-3'>
            <div className='min-w-0 flex-1'><RangeControl label='Độ lớn bút tẩy' value={eraserSize} min={DRAWING_SIZE.min} max={DRAWING_SIZE.max} suffix=' px' onChange={onEraserSize} /></div>
            <button type='button' title='Xóa tất cả nét vẽ' aria-label='Xóa tất cả nét vẽ' disabled={!hasStrokes} onClick={onClear} className='grid size-9 shrink-0 cursor-pointer place-items-center rounded-lg border border-line text-bad hover:bg-bad/10 disabled:opacity-40'><IconTrash size={17} /></button>
          </div>
          <p className='mt-2 text-[11px] text-mute'>Bút tẩy chỉ xóa nét vẽ, không xóa nhân vật hoặc phụ kiện.</p>
        </>}
        <p className='mt-3 border-t border-line pt-2 text-[11px] text-mute'>Nhấn lại nút công cụ để đóng bảng tùy chỉnh.</p>
      </div>, document.body
    )}
  </>;
};