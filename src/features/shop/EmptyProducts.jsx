import { IconPackageOff } from '@tabler/icons-react';

export default function EmptyProducts({ searching, tabs, hits, onSelect }) {
  const elsewhere = searching ? tabs.filter((t) => hits[t.id] > 0) : [];
  return (
    <div className='flex flex-col items-center gap-3 rounded-2xl border border-dashed border-line py-16 text-center text-mute'>
      <IconPackageOff size={34} stroke={1.4} />
      <p className='text-xs'>{searching ? 'Không có vật phẩm nào khớp trong danh mục này' : 'Danh mục chưa có vật phẩm'}</p>
      {elsewhere.length > 0 && (
        <div className='flex flex-wrap justify-center gap-1.5'>
          {elsewhere.map((t) => (
            <button key={t.id} onClick={() => onSelect(t.id)} className='cursor-pointer rounded-full border border-line px-3 py-1 text-[11px] text-fg hover:border-lime'>
              {t.name} · {hits[t.id]}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};