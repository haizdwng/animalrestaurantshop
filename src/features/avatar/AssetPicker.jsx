import { memo, useCallback, useMemo, useState } from 'react';
import { IconCheck, IconPhotoOff, IconPhotoPlus, IconTrash } from '@tabler/icons-react';
import { Skeleton, Tabs, toast } from '@/shared/components/ui';
import { labelOf, thumbnailUrl } from '@/features/avatar/manifest';
import { MAX_ITEMS, TABS, isItemTab } from '@/features/avatar/config';

const Tile = memo(function Tile({ id, index, active, onPick }) {
  const [state, setState] = useState('loading');
  const label = labelOf(id);
  return (
    <li>
      <button
        type='button'
        onClick={() => onPick(id, index)}
        aria-pressed={active}
        aria-label={label}
        title={label}
        className={`relative block aspect-square w-full cursor-pointer overflow-hidden rounded-xl border bg-raise transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-95 ${active ? 'border-lime ring-1 ring-lime' : 'border-line hover:border-mute'}`}
      >
        {state === 'loading' && <Skeleton className='absolute inset-0 rounded-none' />}
        {state === 'error' ? (
          <IconPhotoOff size={18} className='absolute inset-0 m-auto text-mute' />
        ) : (
          <img
            ref={(el) => {
              if (el?.complete && el.naturalWidth) setState('ready');
            }}
            src={thumbnailUrl(id)}
            alt=''
            loading='lazy'
            decoding='async'
            draggable={false}
            onLoad={() => setState('ready')}
            onError={() => setState('error')}
            className={`size-full object-contain p-1 transition-opacity duration-200 ${state === 'ready' ? 'opacity-100' : 'opacity-0'}`}
          />
        )}
        {active && (
          <span className='absolute top-1 right-1 grid size-4 place-items-center rounded-full bg-lime text-bg'>
            <IconCheck size={11} stroke={3} />
          </span>
        )}
      </button>
    </li>
  );
});

function AssetPicker({ tab, onTab, role, emoji, background, photo, itemKey, dispatch, onPhoto, uploading, disabled = false }) {
  const current = TABS.find((t) => t.key === tab);
  const ids = current.ids(role);
  const used = useMemo(() => new Set(itemKey ? itemKey.split('|') : []), [itemKey]);
  const itemTab = isItemTab(tab);

  const isActive = (id, i) => (tab === 'role' ? !photo && role === i : tab === 'emoji' ? !photo && emoji === i : tab === 'background' ? !photo && background === i : used.has(id));

  const pick = useCallback((id, index) => {
    if (disabled) return;
    if (itemTab) {
      if (!used.has(id) && used.size >= MAX_ITEMS) return toast(`Tối đa ${MAX_ITEMS} phụ kiện, hãy bỏ bớt một cái`, 'info');
      return dispatch({ type: 'toggle', src: id });
    };
    dispatch({ type: tab, index });
  }, [disabled, itemTab, tab, used, dispatch]);

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='shrink-0 space-y-2 pb-2'>
        <div className={`flex flex-wrap items-center gap-2 rounded-xl border px-3 py-2.5 ${photo ? 'border-lime/40 bg-lime/5' : 'border-line bg-bg'}`}>
          <p className='min-w-0 flex-1 text-xs font-bold'>Ảnh của bạn hoặc nhân vật</p>
          <label className={`inline-flex h-9 shrink-0 items-center gap-1.5 rounded-lg border border-line bg-raise px-2.5 text-[11px] font-bold text-fg transition hover:border-lime ${disabled || uploading ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}>
            <IconPhotoPlus size={16} /> {uploading ? 'Đang mở ảnh…' : photo ? 'Đổi ảnh' : 'Tải ảnh lên'}
            <input
              type='file'
              accept='image/jpeg,image/png,image/webp'
              disabled={disabled || uploading}
              className='sr-only'
              aria-label='Tải ảnh JPG, PNG hoặc WebP lên để chỉnh sửa avatar'
              onChange={(event) => {
                const file = event.target.files?.[0];
                event.target.value = '';
                if (file) onPhoto(file);
              }}
            />
          </label>
          {photo && (
            <button
              type='button'
              disabled={disabled || uploading}
              onClick={() => dispatch({ type: 'remove-photo' })}
              className='inline-flex h-9 shrink-0 cursor-pointer items-center gap-1 rounded-lg px-2 text-[11px] font-bold text-mute transition hover:bg-raise hover:text-fg disabled:opacity-50'
            >
              <IconTrash size={15} /> Dùng nhân vật
            </button>
          )}
        </div>
        <Tabs tabs={TABS.map((t) => [t.key, t.label, t.Icon])} value={tab} onChange={onTab} />
        <p className='min-h-4 px-1 text-[11px] leading-4 text-mute tabular-nums'>
          {itemTab ? `${used.size}/${MAX_ITEMS}` : current.hint}
        </p>
      </div>
      <div className='min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1 pb-3 scrollbar-gutter-stable'>
        <ul key={tab} className='grid animate-fade grid-cols-[repeat(auto-fill,minmax(4.5rem,1fr))] content-start gap-2'>
          {ids.map((id, i) => (
            <Tile key={id} id={id} index={i} active={isActive(id, i)} onPick={pick} />
          ))}
        </ul>
      </div>
    </div>
  );
};

export default memo(AssetPicker);