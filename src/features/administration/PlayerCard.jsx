import { useEffect, useState } from 'react';
import { IconStarFilled, IconUser } from '@tabler/icons-react';
import { Line, Skeleton } from '@/shared/components/ui';

export default function PlayerCard({ player }) {
  const [imageError, setImageError] = useState(false);
  useEffect(() => setImageError(false), [player.avatarUrl]);
  return (
    <section className='ui-card flex flex-wrap items-center gap-4 p-5 sm:p-6'>
      <div className='grid size-20 shrink-0 place-items-center overflow-hidden rounded-2xl border border-line bg-raise text-mute'>
        {player.avatarUrl && !imageError ? <img src={player.avatarUrl} alt='Ảnh người chơi' className='size-full object-cover' onError={() => setImageError(true)} /> : <IconUser size={30} stroke={1.5} />}
      </div>
      <div className='min-w-0 flex-1'>
        <h2 className='wrap-break-word text-lg font-extrabold tracking-tight'>{player.nickName || 'Chưa đặt tên'}</h2>
        <p className='mt-1 break-all text-xs text-mute'>{player.openid}</p>
      </div>
      <dl className='rounded-xl border border-line bg-bg px-4 py-3'>
        <dt className='text-[11px] text-mute'>Tổng sao</dt>
        <dd className='mt-1 flex items-center gap-1.5 text-lg font-extrabold tabular-nums'><IconStarFilled size={17} className='text-lime' /> {Number(player.starSum || 0).toLocaleString('vi-VN')}</dd>
      </dl>
    </section>
  );
};

export function PlayerCardSkeleton() {
  return (
    <div aria-busy='true' className='ui-card flex flex-wrap items-center gap-4 p-5 sm:p-6'>
      <Skeleton className='size-20 rounded-2xl' />
      <div className='min-w-0 flex-1'><Line h='h-7' w='w-40' bar='h-5' /><Line h='mt-1 h-4' w='w-56 max-w-full' bar='h-2.5' /></div>
      <div className='rounded-xl border border-line bg-bg px-4 py-3'><Line h='h-4' w='w-12' bar='h-2' /><Line h='mt-1 h-7' w='w-20' bar='h-4' /></div>
    </div>
  );
};