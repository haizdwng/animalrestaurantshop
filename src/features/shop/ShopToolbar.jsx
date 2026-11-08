import { IconRefresh, IconSearch, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Spinner } from '@/shared/components/ui';

export default function ShopToolbar({ title, count, ownedCount, query, onQuery, loading, onReload }) {
  const needle = query.trim();
  return (
    <div className='mb-4 flex flex-wrap items-end gap-3'>
      <div className='min-w-0 flex-1'>
        <h1 className='text-xl font-extrabold tracking-tight sm:text-2xl'>{title}</h1>
        <p className='mt-0.5 truncate text-[11px] text-mute tabular-nums'>
          {needle ? `${formatNumber(count)} kết quả cho “${needle}”` : `${formatNumber(count)} vật phẩm`}
          {ownedCount > 0 && ` · đã mua ${ownedCount}`}
        </p>
      </div>
      <div className='flex w-full items-center gap-2 sm:w-auto'>
        <label className='flex h-10 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-panel px-3 transition focus-within:border-lime sm:w-72'>
          <IconSearch size={15} className='shrink-0 text-mute' />
          <input value={query} onChange={(e) => onQuery(e.target.value)} placeholder='Tìm theo tên hoặc mã…' className='min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/60 sm:text-[13px]' />
          {query && (
            <button onClick={() => onQuery('')} aria-label='Xoá tìm kiếm' className='grid size-6 cursor-pointer place-items-center rounded text-mute hover:text-fg'>
              <IconX size={14} />
            </button>
          )}
        </label>
        <Button variant='ghost' className='size-10! px-0!' onClick={onReload} disabled={loading} aria-label='Tải lại cửa hàng'>
          {loading ? <Spinner size={16} /> : <IconRefresh size={16} />}
        </Button>
      </div>
    </div>
  );
};