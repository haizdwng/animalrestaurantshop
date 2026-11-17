import { IconRefresh } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, SearchInput, Select, Spinner } from '@/shared/components/ui';
import { SHOP_FILTER_OPTIONS } from '@/features/shop/shopFilters';

export default function ShopToolbar({ title, count, ownedCount, query, onQuery, filter, onFilter, loading, onReload }) {
  return (
    <header className='mb-4 space-y-3'>
      <div className='min-w-0'>
        <h1 className='ui-heading'>{title || 'Cửa hàng'}</h1>
        <p className='ui-description mt-1 tabular-nums'>
          {query.trim() ? `${formatNumber(count)} kết quả cho “${query.trim()}”` : `${formatNumber(count)} vật phẩm`}
          {' · '}{formatNumber(ownedCount)} đã sở hữu
        </p>
      </div>
      <div className='grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(12rem,1fr)_minmax(10rem,12rem)_auto]'>
        <SearchInput label='Tìm vật phẩm' placeholder='Tìm theo tên hoặc mã…' value={query} onChange={onQuery} disabled={loading} className='min-w-0' />
        <div className='col-span-2 row-start-2 sm:col-span-1 sm:row-start-auto'>
          <Select label='Lọc vật phẩm' value={filter} onChange={onFilter} disabled={loading} className='w-full'>
            {SHOP_FILTER_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
          </Select>
        </div>
        <Button variant='ghost' className='col-start-2 row-start-1 size-10! px-0! sm:col-start-3 sm:row-start-auto' onClick={onReload} disabled={loading} aria-label='Tải lại cửa hàng' title='Tải lại dữ liệu cửa hàng'>
          {loading ? <Spinner size={17} /> : <IconRefresh size={17} />}
        </Button>
      </div>
    </header>
  );
};