import { Skeleton, Spinner } from '@/shared/components/ui';

export default function ShopSkeleton() {
  return (
    <section aria-busy='true' aria-label='Đang tải cửa hàng'>
      <div className='mb-4 space-y-3'>
        <div className='space-y-2'>
          <Skeleton className='h-7 w-36' />
          <p className='flex items-center gap-2 text-xs text-mute'><Spinner size={13} /> Đang tải cửa hàng…</p>
        </div>
        <div className='grid grid-cols-[minmax(0,1fr)_auto] gap-2 sm:grid-cols-[minmax(12rem,1fr)_minmax(10rem,12rem)_auto]'>
          <Skeleton className='h-10 min-w-0 rounded-lg' />
          <Skeleton className='col-span-2 row-start-2 h-10 rounded-lg sm:col-span-1 sm:row-start-auto' />
          <Skeleton className='col-start-2 row-start-1 size-10 rounded-lg sm:col-start-3 sm:row-start-auto' />
        </div>
      </div>
      <ul className='grid gap-2 sm:grid-cols-2 xl:grid-cols-3'>
        {Array.from({ length: 9 }, (_, index) => (
          <li key={index} className={`ui-panel flex min-h-20 items-center gap-3 p-3 ${index >= 6 ? 'hidden sm:flex' : ''}`}>
            <Skeleton className='size-12 shrink-0 rounded-xl' />
            <div className='min-w-0 flex-1 space-y-2'><Skeleton className='h-3 w-3/4' /><Skeleton className='h-2.5 w-1/3' /></div>
            <div className='space-y-2'><Skeleton className='h-3.5 w-9' /><Skeleton className='ml-auto size-7' /></div>
          </li>
        ))}
      </ul>
    </section>
  );
};