import { IconRefresh } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, SearchInput, Spinner, Tooltip } from '@/shared/components/ui';

export default function ShopToolbar({ title, count, ownedCount, query, onQuery, loading, onReload }) {
  return (
    <header className='mb-4 flex flex-wrap items-end gap-3'>
      <div className='min-w-0 flex-1'>
        <h1 className='ui-heading'>{title || 'Cửa hàng'}</h1>
        <p className='ui-description mt-1 truncate tabular-nums'>
          {query.trim() ? `${formatNumber(count)} kết quả cho “${query.trim()}”` : `${formatNumber(count)} vật phẩm`}
          {ownedCount > 0 && ` · ${formatNumber(ownedCount)} đã sở hữu`}
        </p>
      </div>
      <div className='flex w-full items-center gap-2 sm:w-auto'>
        <SearchInput label='Tìm vật phẩm' placeholder='Tìm theo tên hoặc mã…' value={query} onChange={onQuery} disabled={loading} className='min-w-0 flex-1 sm:w-72' />
        <Tooltip text='Tải lại dữ liệu cửa hàng'>
          <Button variant='ghost' className='size-10! px-0!' onClick={onReload} disabled={loading} aria-label='Tải lại cửa hàng'>
            {loading ? <Spinner size={17} /> : <IconRefresh size={17} />}
          </Button>
        </Tooltip>
      </div>
    </header>
  );
};