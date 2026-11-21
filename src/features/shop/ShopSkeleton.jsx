import { Skeleton } from '@/shared/components/ui';
import { ShopToolbarSkeleton } from '@/features/shop/ShopToolbar';
import { PAGE_SIZE } from '@/shared/configuration/pagination';

function ProductItemSkeleton({ index }) {
  return (
    <li aria-hidden='true'>
      <div className='ui-panel flex min-h-20 w-full items-center gap-3 p-3'>
        <Skeleton className='size-12 shrink-0 rounded-xl' />
        <div className='min-w-0 flex-1 space-y-1.5'>
          <Skeleton className={`h-3.5 ${index % 3 === 0 ? 'w-3/4' : 'w-4/5'}`} />
          <Skeleton className='h-2.5 w-1/2' />
          {index % 3 === 0 && <Skeleton className='h-2.5 w-1/3' />}
        </div>
        <div className='flex shrink-0 flex-col items-end gap-1.5'>
          <Skeleton className='h-4 w-14 rounded-md' />
          <Skeleton className='size-7 rounded-lg' />
        </div>
      </div>
    </li>
  );
};

export default function ShopSkeleton() {
  return (
    <section aria-busy='true' aria-label='Đang tải cửa hàng'>
      <ShopToolbarSkeleton />
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-panel px-3 py-2.5'>
        <Skeleton className='h-3 w-52 max-w-full' />
        <Skeleton className='h-8 w-36 rounded-lg' />
      </div>
      <ul className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: PAGE_SIZE }, (_, index) => <ProductItemSkeleton key={index} index={index} />)}
      </ul>
    </section>
  );
};