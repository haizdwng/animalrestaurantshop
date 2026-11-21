import { IconRefresh } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, SearchInput, Select, Skeleton, Spinner } from '@/shared/components/ui';
import { SHOP_FILTER_OPTIONS } from '@/features/shop/shopFilters';

export function ShopToolbarLayout({ title, description, search, filter, pager, reload }) {
  return (
    <header className='mb-4 space-y-3'>
      <div className='min-w-0'>
        {title}
        {description}
      </div>
      <div role='group' aria-label='Công cụ cửa hàng' className='flex min-w-0 flex-wrap items-center gap-2 xl:flex-nowrap'>
        <div className='min-w-40 flex-[1_1_14rem]'>{search}</div>
        <div className='min-w-38 flex-[1_1_9.5rem] sm:max-w-44 xl:flex-none'>{filter}</div>
        {pager && <div className='min-w-58 flex-[1_1_14.5rem] xl:ml-auto xl:flex-none'>{pager}</div>}
        <div className='shrink-0'>{reload}</div>
      </div>
    </header>
  );
};

export function ShopToolbarSkeleton() {
  return (
    <ShopToolbarLayout
      title={<Skeleton className='h-7 w-40 max-w-full' />}
      description={<div className='mt-1 flex h-4 items-center'><Skeleton className='h-2.5 w-48 max-w-full' /></div>}
      search={<Skeleton className='h-10 w-full rounded-lg' />}
      filter={<Skeleton className='h-10 w-full rounded-lg' />}
      pager={
        <div className='flex min-h-10 items-center justify-between gap-2 xl:justify-end'>
          <Skeleton className='h-3 w-18 shrink-0' />
          <div className='flex items-center gap-2'>
            <Skeleton className='h-8 w-8' />
            <Skeleton className='h-3 w-12' />
            <Skeleton className='h-8 w-8' />
          </div>
        </div>
      }
      reload={<Skeleton className='size-10 rounded-lg' />}
    />
  );
};

export default function ShopToolbar({ title, count, ownedCount, query, onQuery, filter, onFilter, pager, loading, onReload }) {
  return (
    <ShopToolbarLayout
      title={<h1 className='ui-heading'>{title || 'Cửa hàng'}</h1>}
      description={
        <p className='ui-description mt-1 tabular-nums'>
          {query.trim() ? `${formatNumber(count)} kết quả cho “${query.trim()}”` : `${formatNumber(count)} vật phẩm`}
          {' · '}{formatNumber(ownedCount)} đã sở hữu
        </p>
      }
      search={<SearchInput label='Tìm vật phẩm' placeholder='Tìm theo tên hoặc mã…' value={query} onChange={onQuery} className='w-full' />}
      filter={
        <Select label='Lọc vật phẩm' value={filter} onChange={onFilter} className='w-full'>
          {SHOP_FILTER_OPTIONS.map(({ value, label }) => <option key={value} value={value}>{label}</option>)}
        </Select>
      }
      pager={pager}
      reload={
        <Button variant='ghost' className='size-10! min-h-10! max-h-10! min-w-10! max-w-10! p-0!' onClick={onReload} requestAction disabled={loading} aria-label='Tải lại cửa hàng' title='Tải lại dữ liệu cửa hàng'>
          {loading ? <Spinner size={17} /> : <IconRefresh size={17} />}
        </Button>
      }
    />
  );
};