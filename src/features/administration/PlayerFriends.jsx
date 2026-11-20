import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { IconPlus, IconRefresh, IconStarFilled, IconTrash, IconUser } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import Tile from '@/features/shop/Tile';
import { Button, Dialog, ErrorState, Field, PageSizeSelect, PagerSkeleton, RowSkeleton, SearchInput, Spinner, toast, toastError } from '@/shared/components/ui';
import Head from '@/features/administration/Head';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import * as api from '@/shared/library/api';

const DEFAULT_PAGE_SIZE = 10;

export default function PlayerFriends({ openid }) {
  const [friends, setFriends] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [query, setQuery] = useState('');
  const [pageSize, setPageSize] = useState(DEFAULT_PAGE_SIZE);
  const [addOpen, setAddOpen] = useState(false);
  const [friendId, setFriendId] = useState('');
  const [adding, setAdding] = useState(false);
  const [removeTarget, setRemoveTarget] = useState(null);
  const [removing, setRemoving] = useState(false);
  const requestId = useRef(0);
  const activeOpenid = useRef(openid);
  activeOpenid.current = openid;

  const loadFriends = useCallback(async () => {
    const request = ++requestId.current;
    setLoading(true);
    setError('');
    try {
      const response = await api.adminPlayerFriends(openid);
      if (request === requestId.current) setFriends(Array.isArray(response.friends) ? response.friends : []);
    } catch (failure) {
      if (request === requestId.current) setError(failure?.message || 'Không thể tải bạn bè');
    } finally {
      if (request === requestId.current) setLoading(false);
    };
  }, [openid]);

  useEffect(() => {
    setFriends(null);
    setQuery('');
    setAddOpen(false);
    setRemoveTarget(null);
    loadFriends();
    return () => { requestId.current += 1; };
  }, [loadFriends]);

  const filtered = useMemo(() => (friends || []).filter((friend) => {
    const search = query.trim().toLowerCase();
    return !search || `${friend.nickName || ''} ${friend.openid || ''}`.toLowerCase().includes(search);
  }), [friends, query]);
  const { rows, pager } = usePaginatedData(filtered, pageSize, `${openid}|${query}`);

  const addFriend = async (event) => {
    event.preventDefault();
    const id = friendId.trim();
    if (!id) return;
    if (id === openid) return toast('Không thể thêm chính người chơi này', 'err');
    setAdding(true);
    try {
      const response = await api.adminAddPlayerFriend(openid, id);
      if (activeOpenid.current !== openid) return;
      toast(response.message || 'Đã thêm bạn bè');
      setAddOpen(false);
      setFriendId('');
      await loadFriends();
    } catch (failure) {
      toastError(failure);
    } finally {
      setAdding(false);
    };
  };

  const deleteFriend = async () => {
    if (!removeTarget?.openid) return;
    setRemoving(true);
    try {
      const response = await api.adminDeletePlayerFriend(openid, removeTarget.openid);
      if (activeOpenid.current !== openid) return;
      setFriends((current) => (current || []).filter((friend) => friend.openid !== removeTarget.openid));
      toast(response.message || 'Đã xoá bạn bè');
      setRemoveTarget(null);
    } catch (failure) {
      toastError(failure);
    } finally {
      setRemoving(false);
    };
  };

  return (
    <section className='min-w-0 space-y-4'>
      <Head title='Danh sách bạn bè' sub={friends ? `${friends.length.toLocaleString('vi-VN')} bạn bè` : 'Đang tải danh sách…'}>
        <Button variant='ghost' size='sm' className='size-9! p-0!' title='Tải lại bạn bè' aria-label='Tải lại bạn bè' onClick={loadFriends} requestAction disabled={loading}> {loading ? <Spinner size={16} /> : <IconRefresh size={17} />}
        </Button>
        <Button size='sm' className='size-9! p-0!' title='Thêm bạn bè' aria-label='Thêm bạn bè' onClick={() => setAddOpen(true)}>
          <IconPlus size={18} />
        </Button>
      </Head>

      <div className='grid min-w-0 grid-cols-[minmax(0,1fr)_auto] gap-2'>
        <SearchInput label='Tìm bạn bè' placeholder='Tìm tên hoặc mã bạn bè…' value={query} onChange={setQuery} />
        <div className='w-32'><PageSizeSelect value={pageSize} onChange={setPageSize} /></div>
      </div>

      {friends === null && loading ? (
        <>
          <ul aria-busy='true' className='divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel'>
            {Array.from({ length: Math.min(pageSize, 10) }, (_, index) => <RowSkeleton kind='friend' key={index} />)}
          </ul>
          <PagerSkeleton />
        </>
      ) : error ? (
        <ErrorState message={error} onRetry={loadFriends} loading={loading} />
      ) : filtered.length ? (
        <ul className={`divide-y divide-line overflow-hidden rounded-2xl border border-line bg-panel transition-opacity ${loading ? 'opacity-60' : ''}`}>
          {rows.map((friend) => (
            <li key={friend.openid} className='flex min-w-0 items-center gap-3 p-3 sm:px-4'>
              <Tile p={{ key: friend.openid, name: friend.nickName || 'Người chơi', image: friend.avatarUrl }} />
              <div className='min-w-0 flex-1'>
                <p className='truncate text-xs font-bold'>{friend.nickName || 'Chưa đặt tên'}</p>
                <p className='mt-1 break-all text-[11px] text-mute'>{friend.openid}</p>
                <p className='mt-1 flex items-center gap-1 text-[11px] font-semibold text-lime'>
                  <IconStarFilled size={12} /> {formatNumber(Number(friend.starSum || 0))} sao
                </p>
              </div>
              <Button variant='quiet' size='sm' className='size-9! shrink-0 p-0! text-bad! hover:bg-bad/10'
                onClick={() => setRemoveTarget(friend)} title={`Xóa bạn bè ${friend.nickName || friend.openid}`}
                aria-label={`Xóa ${friend.nickName || friend.openid} khỏi danh sách bạn bè`}>
                <IconTrash size={17} />
              </Button>
            </li>
          ))}
        </ul>
      ) : (
        <div className='rounded-2xl border border-dashed border-line px-5 py-10 text-center'>
          <IconUser size={25} className='mx-auto text-mute' />
          <p className='mt-3 text-xs font-bold'>{query ? 'Không tìm thấy bạn bè phù hợp' : 'Chưa có bạn bè'}</p>
        </div>
      )}
      {!error && filtered.length > 0 && pager}

      <Dialog open={addOpen} title='Thêm bạn bè' onClose={() => !adding && setAddOpen(false)}>
        <form onSubmit={addFriend} className='space-y-4'>
          <Field label='Mã bạn bè' placeholder='Nhập mã bạn bè' autoFocus autoCapitalize='none' value={friendId} onChange={(event) => setFriendId(event.target.value)} />
          <Button type='submit' className='w-full' disabled={!friendId.trim()} loading={adding}>
            <IconPlus size={16} /> Thêm bạn bè
          </Button>
        </form>
      </Dialog>
      <Dialog open={!!removeTarget} title='Xóa bạn bè' onClose={() => !removing && setRemoveTarget(null)}>
        <p className='text-xs leading-6 text-mute'>
          Bạn có chắc muốn xóa <strong className='text-fg'>{removeTarget?.nickName || removeTarget?.openid}</strong> khỏi danh sách bạn bè?
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <Button variant='ghost' onClick={() => setRemoveTarget(null)} disabled={removing}>Hủy</Button>
          <Button variant='danger' onClick={deleteFriend} requestAction loading={removing}>Xóa bạn bè</Button>
        </div>
      </Dialog>
    </section>
  );
};