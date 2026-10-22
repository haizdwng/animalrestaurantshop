import { IconCoins, IconPencil, IconTrash } from '@tabler/icons-react';
import { isAdmin } from '@/shared/library/api';
import { formatDateTime } from '@/shared/library/format';
import { Coin, Menu } from '@/shared/components/ui';

export default function UserRow({ user: u, onAction }) {
  return (
    <li className='flex items-center gap-3 px-4 py-3 sm:px-5'>
      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-sm font-extrabold text-lime uppercase'>{(u.username || '?')[0]}</span>
      <div className='min-w-0 flex-1'>
        <p className='flex items-center gap-2 truncate text-sm font-bold'>
          {u.username}
          <span className={`rounded-full px-2 py-0.5 text-[10px] ${isAdmin(u) ? 'bg-lime/15 text-lime' : 'bg-raise text-mute'}`}>{u.role === 'user' ? 'Người dùng' : 'Quản trị viên'}</span>
        </p>
        <p className='mt-0.5 truncate text-[11px] text-mute'>
          {u.openid || '—'} · {formatDateTime(u.createdAt)}
        </p>
      </div>
      <span className='hidden items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex'>
        <Coin size={15} /> {u.coin.toLocaleString('vi-VN')}
      </span>
      <Menu
        items={[
          { label: 'Sửa', Icon: IconPencil, onClick: () => onAction('edit') },
          { label: 'Thêm xu', Icon: IconCoins, onClick: () => onAction('coin') },
          { label: 'Xoá', Icon: IconTrash, danger: true, onClick: () => onAction('delete') }
        ]}
      />
    </li>
  );
};