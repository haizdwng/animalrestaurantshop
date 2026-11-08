import { useEffect, useState } from 'react';
import { IconPlus, IconStarFilled, IconTrash, IconUser } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import Tile from '@/features/shop/Tile';
import { Button, Dialog, ErrorState, Field, toast, toastError } from '@/shared/components/ui';
import * as api from '@/shared/library/api';

function FriendSkeleton() {
  return (
    <li aria-hidden='true' className='flex items-center gap-3 rounded-xl border border-line bg-panel p-3'>
      <div className='size-12 animate-pulse rounded-xl bg-raise' />
      <div className='min-w-0 flex-1 space-y-2'>
        <div className='h-3 w-28 animate-pulse rounded bg-raise' />
        <div className='h-2.5 w-44 max-w-full animate-pulse rounded bg-raise' />
      </div>
      <div className='size-9 animate-pulse rounded-lg bg-raise' />
    </li>
  );
};

export default function PlayerFriends({ openid }) {
  const [friends, setFriends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [addOpen, setAddOpen] = useState(false);
  const [friendId, setFriendId] = useState('');
  const [adding, setAdding] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);

  const loadFriends = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await api.adminPlayerFriends(openid);
      setFriends(Array.isArray(response.friends) ? response.friends : []);
    } catch (loadError) {
      setError(loadError.message);
    } finally {
      setLoading(false);
    };
  };

  useEffect(() => {
    setFriends([]);
    loadFriends();
  }, [openid]);

  const addFriend = async (event) => {
    event.preventDefault();
    const id = friendId.trim();
    if (!id) return;
    if (id === openid) {
      toast('Không thể thêm chính người chơi này', 'err');
      return;
    };

    setAdding(true);
    try {
      const response = await api.adminAddPlayerFriend(openid, id);
      toast(response.message || 'Đã thêm bạn bè');
      setAddOpen(false);
      setFriendId('');
      await loadFriends();
    } catch (addError) {
      toastError(addError);
    } finally {
      setAdding(false);
    };
  };

  const deleteFriend = async () => {
    if (!removeTarget?.openid) return;
    setRemoving(true);
    try {
      const response = await api.adminDeletePlayerFriend(openid, removeTarget.openid);
      setFriends((current) => current.filter((friend) => friend.openid !== removeTarget.openid));
      toast(response.message || 'Đã xoá bạn bè');
      setRemoveTarget(null);
    } catch (deleteError) {
      toastError(deleteError);
    } finally {
      setRemoving(false);
    };
  };

  return (
    <div className='space-y-4'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <div className='min-w-0'>
          <h2 className='text-sm font-bold'>Danh sách bạn bè</h2>
          <p className='mt-1 text-[11px] text-mute'>
            {loading ? 'Đang tải danh sách…' : `${friends.length.toLocaleString('vi-VN')} bạn bè`}
          </p>
        </div>
        <Button size='sm' onClick={() => setAddOpen(true)}>
          <IconPlus size={15} /> Thêm bạn bè
        </Button>
      </div>

      {loading ? (
        <ul className='space-y-2' aria-busy='true'>
          {Array.from({ length: 3 }).map((_, index) => <FriendSkeleton key={index} />)}
        </ul>
      ) : error ? (
        <ErrorState message={error} onRetry={loadFriends} loading={loading} />
      ) : friends.length ? (
        <ul className='space-y-2'>
          {friends.map((friend) => (
            <li key={friend.openid} className='flex min-w-0 items-center gap-3 rounded-xl border border-line bg-panel p-3'>
              <Tile p={{ id: friend.openid, name: friend.nickName || 'Người chơi', image: friend.avatarUrl }} />
              <div className='min-w-0 flex-1'>
                <p className='truncate text-xs font-bold'>{friend.nickName || 'Chưa đặt tên'}</p>
                <p className='mt-1 break-all text-[10px] text-mute'>{friend.openid}</p>
                <p className='mt-1 flex items-center gap-1 text-[10px] font-semibold text-lime'>
                  <IconStarFilled size={11} />
                  {formatNumber(Number(friend.starSum || 0))} sao
                </p>
              </div>
              <Button
                variant='quiet'
                size='sm'
                className='size-9! shrink-0 p-0! text-bad hover:bg-bad/10 hover:text-bad'
                onClick={() => setRemoveTarget(friend)}
                aria-label={`Xoá ${friend.nickName || friend.openid} khỏi danh sách bạn bè`}
              >
                <IconTrash size={16} />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className='rounded-2xl border border-dashed border-line px-5 py-12 text-center'>
          <div className='mx-auto grid size-11 place-items-center rounded-xl bg-raise text-mute'>
            <IconUser size={21} />
          </div>
          <p className='mt-3 text-xs font-bold'>Chưa có bạn bè</p>
          <p className='mt-1 text-[11px] text-mute'>Thêm bạn bè bằng mã bạn bè.</p>
          <Button size='sm' className='mt-4' onClick={() => setAddOpen(true)}>
            <IconPlus size={14} /> Thêm bạn bè
          </Button>
        </div>
      )}

      <Dialog open={addOpen} title='Thêm bạn bè' onClose={() => !adding && setAddOpen(false)}>
        <form onSubmit={addFriend} className='space-y-4'>
          <Field
            label='Mã bạn bè'
            placeholder='Nhập mã bạn bè'
            autoFocus
            autoCapitalize='none'
            value={friendId}
            onChange={(event) => setFriendId(event.target.value)}
          />
          <Button type='submit' className='w-full' loading={adding} disabled={!friendId.trim()}>
            <IconPlus size={15} /> Thêm bạn bè
          </Button>
        </form>
      </Dialog>

      <Dialog
        open={!!removeTarget}
        title='Xoá bạn bè'
        onClose={() => !removing && setRemoveTarget(null)}
      >
        <p className='text-xs leading-6 text-mute'>
          Bạn có chắc muốn xoá <strong className='text-fg'>{removeTarget?.nickName || removeTarget?.openid}</strong> khỏi danh sách bạn bè?
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <Button variant='ghost' onClick={() => setRemoveTarget(null)} disabled={removing}>Huỷ</Button>
          <Button variant='danger' onClick={deleteFriend} loading={removing}>
            <IconTrash size={15} /> Xoá bạn bè
          </Button>
        </div>
      </Dialog>
    </div>
  );
};