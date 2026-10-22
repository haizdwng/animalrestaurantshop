import { IconPencil, IconDatabase, IconStar } from '@tabler/icons-react';
import { IconStarFilled } from '@tabler/icons-react';
import { Menu, Skeleton } from '@/shared/components/ui';

export default function PlayerRow({ player, onAction }) {
  const p = player;
  return (
    <li className='flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5'>
      <div className='size-10 shrink-0 overflow-hidden rounded-xl bg-raise'>
        {p.avatarUrl ? <img src={p.avatarUrl} alt='' className='size-full object-cover' /> : <span className='grid size-full place-items-center text-sm font-extrabold text-lime'>{(p.nickName || '?')[0]}</span>}
      </div>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-bold'>{p.nickName || 'Chưa đặt tên'}</p>
        <p className='mt-0.5 truncate text-[11px] text-mute'>{p.openid || 'Không có mã người chơi'}</p>
      </div>
      <span className='hidden min-w-0 shrink-0 items-center gap-1.5 whitespace-nowrap text-sm font-bold tabular-nums text-lime sm:flex'>
        <IconStarFilled size={14} className='shrink-0' /> <span className='truncate'>{Number(p.starSum || 0).toLocaleString('vi-VN')}</span>
      </span>
      <Menu
        items={[
          { label: 'Sửa', Icon: IconPencil, onClick: () => onAction('edit') },
          { label: 'Thêm sao', Icon: IconStar, onClick: () => onAction('star') },
          { label: 'Xem dữ liệu', Icon: IconDatabase, onClick: () => onAction('data') }
        ]}
      />
    </li>
  );
};

export function PlayerRowSkeleton() {
  return (
    <li aria-hidden='true' className='flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5'>
      <Skeleton className='size-10 shrink-0 rounded-xl' />
      <div className='min-w-0 flex-1 space-y-2'>
        <Skeleton className='h-3.5 w-2/5' />
        <Skeleton className='h-2.5 w-3/5' />
      </div>
      <Skeleton className='hidden h-3.5 w-14 sm:block' />
      <Skeleton className='size-8 shrink-0 rounded-lg' />
    </li>
  );
};