import { memo, useCallback, useMemo, useState } from 'react';
import { IconCheck, IconPhotoOff } from '@tabler/icons-react';
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

function AssetPicker({ tab, onTab, role, emoji, background, itemKey, dispatch }) {
  const current = TABS.find((t) => t.key === tab);
  const ids = current.ids(role);
  const used = useMemo(() => new Set(itemKey ? itemKey.split('|') : []), [itemKey]);
  const itemTab = isItemTab(tab);

  const isActive = (id, i) => (tab === 'role' ? role === i : tab === 'emoji' ? emoji === i : tab === 'background' ? background === i : used.has(id));

  const pick = useCallback((id, index) => {
    if (itemTab) {
      if (!used.has(id) && used.size >= MAX_ITEMS) return toast(`Tối đa ${MAX_ITEMS} phụ kiện, hãy bỏ bớt một cái`, 'info');
      return dispatch({ type: 'toggle', src: id });
    };
    dispatch({ type: tab, index });
  }, [itemTab, tab, used, dispatch]);

  return (
    <div className='flex min-h-0 flex-1 flex-col'>
      <div className='shrink-0 space-y-1.5 pb-2'>
        <Tabs tabs={TABS.map((t) => [t.key, t.label, t.Icon])} value={tab} onChange={onTab} />
        <p className='h-4 truncate px-1 text-[11px] leading-4 text-mute tabular-nums'>
          {itemTab ? `Đã dùng ${used.size}/${MAX_ITEMS} phụ kiện · bấm lần nữa để bỏ` : current.hint}
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