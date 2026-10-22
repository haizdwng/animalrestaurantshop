export function Skeleton({ className = '', ...p }) {
  return <span {...p} aria-hidden='true' className={`block animate-shimmer rounded-md bg-[linear-gradient(90deg,var(--color-raise)_25%,var(--color-line)_50%,var(--color-raise)_75%)] bg-size-[200%_100%] ${className}`} />
};

export function Line({ h = 'h-5', w = 'w-1/2', bar = 'h-3', className = '' }) {
  return (
    <span className={`flex items-center ${h} ${className}`}>
      <Skeleton className={`${bar} ${w}`} />
    </span>
  );
};

export function RowSkeleton({ lead = true, trail, w = 'w-2/5' }) {
  return (
    <li className='flex items-center gap-3 px-4 py-3 sm:px-5'>
      {lead && <Skeleton className='size-9 shrink-0 rounded-lg' />}
      <div className='min-w-0 flex-1'>
        <Line w={w} bar='h-3.5' />
        <Line h='h-[16.5px] mt-0.5' w='w-3/5' bar='h-2.5' />
      </div>
      {trail}
      <Skeleton className='size-8 shrink-0 rounded-lg' />
    </li>
  );
};

export function PagerSkeleton() {
  return (
    <div className='flex items-center justify-between gap-2'>
      <Line h='h-8' w='w-20' bar='h-2.5' className='flex-1' />
      <div className='flex items-center gap-1'>
        <Skeleton className='size-8 rounded-lg' />
        <Line h='h-8' w='w-10 mx-auto' bar='h-3' className='min-w-16' />
        <Skeleton className='size-8 rounded-lg' />
      </div>
    </div>
  );
};