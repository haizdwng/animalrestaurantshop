import { useEffect, useState } from 'react';
import { IconBriefcase2, IconCopy, IconLogout, IconPencil, IconStarFilled, IconUser, IconUserPlus } from '@tabler/icons-react';
import { formatNumber, formatDate } from '@/shared/library/format';
import { copyText } from '@/shared/library/clipboard';
import { Badge, Button, Coin, Tooltip } from '@/shared/components/ui';

export default function ProfileCard({ user, onEditAvatar, onLogout, onRedeemGiftCode, onRedeemInvite, onFriendLink, onBuffetLink }) {
  const [imageFailed, setImageFailed] = useState(false);
  useEffect(() => setImageFailed(false), [user.avatar]);
  const invited = Boolean(user.friendInvite);
  return (
    <section className='ui-card relative overflow-hidden p-5'>
      <div aria-hidden className='pointer-events-none absolute inset-x-0 top-0 h-22 bg-[radial-gradient(ellipse_at_15%_0%,color-mix(in_srgb,var(--color-lime)_9%,transparent),transparent_70%)]' />
      <div className='relative flex items-start justify-between gap-3'>
        <div className='relative'>
          <div className='grid size-20 place-items-center overflow-hidden rounded-2xl border border-line bg-raise text-mute'>
            {user.avatar && !imageFailed ? <img src={user.avatar} alt='Ảnh đại diện' className='size-full object-cover' onError={() => setImageFailed(true)} /> : <IconUser size={30} stroke={1.5} />}
          </div>
          <Tooltip text='Chỉnh sửa ảnh đại diện' side='top' className='absolute -right-2 -bottom-2'>
            <button type='button' onClick={onEditAvatar} aria-label='Chỉnh sửa ảnh đại diện'
              className='grid size-9 cursor-pointer place-items-center rounded-xl border-2 border-panel bg-lime text-bg hover:brightness-105'>
              <IconPencil size={16} />
            </button>
          </Tooltip>
        </div>
        <Button variant='quiet' size='sm' onClick={onLogout}><IconLogout size={16} /> Đăng xuất</Button>
      </div>
      <h1 className='relative mt-4 wrap-break-word text-xl leading-tight font-extrabold tracking-tight'>{user.playerName}</h1>
      <div className='relative mt-1 flex flex-wrap items-center gap-2'>
        <span className='min-w-0 break-all text-xs text-mute'>@{user.username}</span>
        <Badge tone='neutral'>{user.role === 'administrator' ? 'Quản trị viên' : 'Người dùng'}</Badge>
      </div>
      <dl className='relative mt-5 grid grid-cols-2 gap-2'>
        <div className='rounded-xl border border-line bg-bg p-3'>
          <dt className='text-[11px] text-mute'>Số xu</dt>
          <dd className='mt-1 flex min-w-0 items-center gap-1.5 text-sm font-extrabold tabular-nums text-coin'><Coin size={17} /> {formatNumber(user.coins)}</dd>
        </div>
        <div className='rounded-xl border border-line bg-bg p-3'>
          <dt className='text-[11px] text-mute'>Số sao</dt>
          <dd className='mt-1 flex min-w-0 items-center gap-1.5 text-sm font-extrabold tabular-nums'><IconStarFilled size={16} className='text-lime' /><span className='truncate'>{formatNumber(user.star)}</span></dd>
        </div>
      </dl>
      <div className='relative mt-3 space-y-2'>
        <Button variant='ghost' size='sm' className='w-full' onClick={onRedeemGiftCode}>Nhập mã đổi thưởng</Button>
        <div className='flex gap-2'>
          <Button variant='ghost' size='sm' className='min-w-0 flex-1' onClick={onRedeemInvite} disabled={invited}>
            <span className='truncate'>{invited ? `Đã nhập mã: ${user.friendInvite}` : 'Nhập mã mời'}</span>
          </Button>
          <Tooltip text='Sao chép mã mời của bạn'>
            <Button variant='ghost' size='sm' className='size-8! px-0!' disabled={!user.invite} aria-label='Sao chép mã mời'
              onClick={() => user.invite && copyText(user.invite, 'Đã sao chép mã mời')}><IconCopy size={16} /></Button>
          </Tooltip>
        </div>
        <div className='grid grid-cols-2 gap-2'>
          <Button variant='ghost' size='sm' className='min-w-0' onClick={onFriendLink}><IconUserPlus size={15} /><span className='truncate'>Kết bạn</span></Button>
          <Button variant='ghost' size='sm' className='min-w-0' onClick={onBuffetLink}><IconBriefcase2 size={15} /><span className='truncate'>Làm thêm</span></Button>
        </div>
      </div>
      {user.createdAt && <p className='relative mt-4 text-[11px] text-mute'>Tham gia {formatDate(user.createdAt)}</p>}
    </section>
  );
};