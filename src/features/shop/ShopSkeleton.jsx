import { Skeleton, Spinner } from '@/shared/components/ui';

export default function ShopSkeleton() {
  return (
    <div aria-busy='true' aria-label='Đang tải cửa hàng'>
      <div className='mb-4 flex flex-wrap items-end gap-3'>
        <div className='min-w-0 flex-1'>
          <Skeleton className='h-7 w-32 sm:h-8' />
          <p className='mt-0.5 flex h-[16.5px] items-center gap-1.5 text-[11px] text-mute'>
            <Spinner size={12} className='text-lime' /> Đang tải dữ liệu cửa hàng…
          </p>
        </div>
        <div className='flex w-full items-center gap-2 sm:w-auto'>
          <Skeleton className='h-10 flex-1 rounded-lg sm:w-72' />
          <Skeleton className='size-10 rounded-lg' />
        </div>
      </div>
      <ul className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 9 }).map((_, i) => (
          <li key={i} className={`flex h-19.5 items-center gap-3 rounded-xl border border-line bg-panel p-3 ${i >= 6 ? 'hidden sm:flex' : ''}`}>
            <Skeleton className='size-12 rounded-xl' />
            <div className='flex-1 space-y-2'>
              <Skeleton className='h-3 w-3/4' />
              <Skeleton className='h-2.5 w-1/3' />
            </div>
            <div className='flex flex-col items-end gap-1.5'>
              <Skeleton className='h-3.5 w-8' />
              <Skeleton className='size-7 rounded-lg' />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};