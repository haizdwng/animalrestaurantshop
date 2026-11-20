export function Skeleton({ className = '', ...props }) {
  return <span {...props} aria-hidden='true' className={`block animate-shimmer rounded-lg bg-[linear-gradient(90deg,var(--color-raise)_25%,var(--color-line)_50%,var(--color-raise)_75%)] bg-size-[200%_100%] ${className}`} />;
};

export function Line({ h = 'h-5', w = 'w-1/2', bar = 'h-3', className = '' }) {
  return <span className={`flex items-center ${h} ${className}`}><Skeleton className={`${bar} ${w}`} /></span>;
};

export function RowSkeleton({ lead = true, trail, w = 'w-2/5', kind = 'list' }) {
  if (kind === 'friend') return (
    <li aria-hidden='true' className='flex min-w-0 items-center gap-3 p-3 sm:px-4'>
      <Skeleton className='size-12 shrink-0 rounded-xl' />
      <div className='min-w-0 flex-1 space-y-1.5'>
        <Skeleton className='h-3 w-2/5' />
        <Skeleton className='h-2.5 w-3/5' />
        <Skeleton className='h-2.5 w-20' />
      </div>
      <Skeleton className='size-9 shrink-0 rounded-lg' />
    </li>
  );
  if (kind === 'transaction') return (
    <li aria-hidden='true' className='flex flex-wrap items-center gap-x-3 gap-y-2 px-4 py-3 sm:px-5'>
      <div className='min-w-0 flex-1 space-y-1.5'>
        <div className='flex items-center gap-2'>
          <Skeleton className='h-3.5 w-24' />
          <Skeleton className='h-5 w-20 rounded-md' />
        </div>
        <Skeleton className={`h-2.5 ${w}`} />
      </div>
      <Skeleton className='size-9 shrink-0 rounded-lg' />
    </li>
  );
  return (
    <li aria-hidden='true' className='flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5'>
      {lead && <Skeleton className='size-9 shrink-0 rounded-lg' />}
      <div className='min-w-0 flex-1 space-y-1.5'>
        {kind === 'user' ? (
          <div className='flex min-w-0 items-center gap-2'>
            <Skeleton className={`h-3.5 max-w-32 ${w}`} />
            <Skeleton className='h-4 w-16 shrink-0 rounded-full' />
          </div>
        ) : <Skeleton className={`h-3.5 ${w}`} />}
        <Skeleton className='h-2.5 w-3/5' />
      </div>
      {trail}
      <Skeleton className='size-9 shrink-0 rounded-lg' />
    </li>
  );
};

export function PagerSkeleton() {
  return (
    <nav aria-hidden='true' className='flex flex-wrap items-center justify-between gap-2 text-xs'>
      <Skeleton className='h-3 w-24' />
      <div className='flex items-center gap-2'>
        <Skeleton className='h-8 w-8 rounded-lg' />
        <Skeleton className='h-3 w-16' />
        <Skeleton className='h-8 w-8 rounded-lg' />
      </div>
    </nav>
  );
};