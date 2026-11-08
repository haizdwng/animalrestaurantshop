import { useState } from 'react';
import { IconStarFilled, IconUser } from '@tabler/icons-react';
import { Line, Skeleton } from '@/shared/components/ui';

export default function PlayerCard({ player: p }) {
  const [imageError, setImageError] = useState(false);
  return (
    <div className='relative overflow-hidden rounded-2xl border border-line bg-panel p-5 sm:p-6'>
      <div aria-hidden className='absolute inset-x-0 top-0 h-24 bg-[radial-gradient(80%_100%_at_0%_0%,color-mix(in_oklab,var(--color-lime)_16%,transparent),transparent)]' />
      <div className='relative flex flex-wrap items-center gap-4'>
        <div className='size-20 overflow-hidden rounded-2xl bg-raise ring-2 ring-line'>
          {p.avatarUrl && !imageError ? <img src={p.avatarUrl} alt='' className='size-full object-cover' onError={() => setImageError(true)} /> : <IconUser size={28} className='m-auto mt-6 text-mute' />}
        </div>
        <div className='min-w-0 flex-1'>
          <h2 className='truncate text-xl font-extrabold'>{p.nickName || 'Chưa đặt tên'}</h2>
          <p className='mt-1 text-xs break-all text-mute'>{p.openid}</p>
        </div>
        <div className='rounded-xl bg-bg px-4 py-3'>
          <p className='text-[10px] text-mute'>Tổng sao</p>
          <p className='mt-1 flex items-center gap-1.5 whitespace-nowrap text-lg font-extrabold tabular-nums'>
            <IconStarFilled size={16} className='shrink-0 text-lime' /> <span>{Number(p.starSum || 0).toLocaleString('vi-VN')}</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export function PlayerCardSkeleton() {
  return (
    <div aria-busy='true' className='rounded-2xl border border-line bg-panel p-5 sm:p-6'>
      <div className='flex flex-wrap items-center gap-4'>
        <Skeleton className='size-20 rounded-2xl' />
        <div className='min-w-0 flex-1'>
          <Line h='h-7' w='w-40' bar='h-5' />
          <Line h='h-4 mt-1' w='w-56 max-w-full' bar='h-2.5' />
        </div>
        <div className='rounded-xl bg-bg px-4 py-3'>
          <Line h='h-[15px]' w='w-12' bar='h-2' />
          <Line h='h-7 mt-1' w='w-20' bar='h-4' />
        </div>
      </div>
    </div>
  );
};