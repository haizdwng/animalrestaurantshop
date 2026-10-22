import { IconBriefcase2, IconLink, IconLogout, IconPencil, IconStarFilled, IconUserPlus } from '@tabler/icons-react';
import { formatNumber, formatDate } from '@/shared/library/format';
import { Button, Coin } from '@/shared/components/ui';

export default function ProfileCard({ user, onEditAvatar, onLogout, onRedeemGiftCode, onFriendLink, onBuffetLink }) {
  return (
    <div className='relative overflow-hidden rounded-2xl border border-line bg-panel p-5'>
      <div aria-hidden className='absolute inset-x-0 top-0 h-20 bg-[radial-gradient(80%_100%_at_0%_0%,color-mix(in_oklab,var(--color-lime)_18%,transparent),transparent)]' />
      <div className='relative flex items-start justify-between'>
        <div className='relative'>
          <div className='size-20 overflow-hidden rounded-2xl bg-raise ring-2 ring-line'>
            <img src={user.avatar} alt='Ảnh đại diện' className='size-full object-cover' />
          </div>
          <button onClick={onEditAvatar} aria-label='Sửa ảnh đại diện' className='absolute -right-2 -bottom-2 grid size-8 cursor-pointer place-items-center rounded-full border-2 border-panel bg-lime text-bg transition hover:brightness-110'>
            <IconPencil size={14} />
          </button>
        </div>
        <Button variant='quiet' size='sm' onClick={onLogout}>
          <IconLogout size={14} /> Đăng xuất
        </Button>
      </div>
      <h1 className='relative mt-4 text-xl leading-tight font-extrabold tracking-tight wrap-break-word'>{user.playerName}</h1>
      <p className='mt-1 flex flex-wrap items-center gap-2 text-xs text-mute'>
        @{user.username}
        <span className='rounded-full bg-lime/15 px-2 py-0.5 text-[10px] font-bold text-lime'>{user.role === 'user' ? 'Người dùng' : 'Quản trị viên'}</span>
      </p>
      <div className='mt-5 grid grid-cols-2 gap-2'>
        <div className='rounded-xl bg-bg p-3'>
          <p className='text-[10px] text-mute'>Xu</p>
          <p className='mt-1 flex items-center gap-1.5 font-extrabold tabular-nums text-coin'>
            <Coin size={16} /> {formatNumber(user.coins)}
          </p>
        </div>
        <div className='rounded-xl bg-bg p-3'>
          <p className='text-[10px] text-mute'>Sao</p>
          <p className='mt-1 flex min-w-0 items-center gap-1.5 font-extrabold tabular-nums'>
            <IconStarFilled size={14} className='shrink-0 text-lime' /> <span className='min-w-0 truncate'>{formatNumber(user.star)}</span>
          </p>
        </div>
      </div>
      <Button variant='ghost' size='sm' className='relative mt-3 w-full' onClick={onRedeemGiftCode}>
        Nhập mã đổi thưởng
      </Button>
      <div className='relative mt-2 grid grid-cols-2 gap-2'>
        <Button variant='quiet' size='sm' className='min-w-0' onClick={onFriendLink}>
          <IconUserPlus size={14} /> <span className='truncate'>Liên kết kết bạn</span>
        </Button>
        <Button variant='quiet' size='sm' className='min-w-0' onClick={onBuffetLink}>
          <IconBriefcase2 size={14} /> <span className='truncate'>Liên kết làm thêm</span>
        </Button>
      </div>
      {user.createdAt && <p className='mt-4 text-[10px] text-mute'>Tham gia {formatDate(user.createdAt)}</p>}
    </div>
  );
};