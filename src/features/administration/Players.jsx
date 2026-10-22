import { useMemo, useState } from 'react';
import { IconArrowLeft, IconRefresh, IconSearch, IconArrowRight } from '@tabler/icons-react';
import { Button, Dialog, ErrorState, Field, JsonEditor, PageSizeSelect, PagerSkeleton, Spinner, Tabs, toast, toastError } from '@/shared/components/ui';
import { PLAYER_PAGE_SIZE, PLAYER_TABS } from '@/features/administration/config';
import PlayerCard, { PlayerCardSkeleton } from '@/features/administration/PlayerCard';
import RecordCrypto from '@/features/administration/RecordCrypto';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRemoteResource from '@/shared/hooks/useRemoteResource';
import Head from '@/features/administration/Head';
import PlayerRow, { PlayerRowSkeleton } from '@/features/administration/PlayerRow';
import PlayerDialogs, { PlayerStarDialog } from '@/features/administration/PlayerDialogs';
import * as api from '@/shared/library/api';

export default function AdminPlayers() {
  const { data: list, setData, loading: listLoading, error: listError, reload } = useRemoteResource(async () => (await api.adminPlayers()).players);
  const [input, setInput] = useState('');
  const [openid, setOpenid] = useState('');
  const [tab, setTab] = useState('player');
  const [recordVisited, setRecordVisited] = useState(false);
  const [player, setPlayer] = useState({ data: null, loading: false, error: '' });
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState(null);
  const [busy, setBusy] = useState(false);
  const [manualOpen, setManualOpen] = useState(false);
  const [size, setSize] = useState(PLAYER_PAGE_SIZE);

  const shown = useMemo(() => {
    const q = query.trim().toLowerCase();
    return (list || []).filter((p) => !q || [p.nickName, p.openid].some((v) => String(v || '').toLowerCase().includes(q)));
  }, [list, query]);
  const { rows, pager } = usePaginatedData(shown, size, query);

  const loadPlayer = async (id = openid) => {
    setPlayer({ data: null, loading: true, error: '' });
    try {
      const r = await api.adminPlayer(id);
      setPlayer({ data: r.player ?? r, loading: false, error: '' });
    } catch (e) {
      setPlayer({ data: null, loading: false, error: e.message });
    };
  };
  const go = (e) => {
    e.preventDefault();
    const id = input.trim();
    if (!id) return;
    setOpenid(id);
    setTab('player');
    loadPlayer(id);
  };
  const viewPlayer = (id) => {
    setInput(id);
    setOpenid(id);
    setTab('player');
    setRecordVisited(false);
    loadPlayer(id);
  };
  const addStar = async (star) => {
  if (!dialog?.player) return;
  const id = dialog.player.openid;
  setBusy(true);
  try {
    const r = await api.adminAddPlayerStar(id, star);
    const add = (p) => ({ ...p, starSum: Number(p.starSum || 0) + star });
    setData((items) => (items || []).map((item) => (item.openid === id ? add(item) : item)));
    if (openid === id) setPlayer((current) => ({ ...current, data: current.data && add(current.data) }));
    toast(r.message || `Đã thêm ${star} sao`);
    setDialog(null);
  } catch (error) {
    toastError(error);
  } finally {
    setBusy(false);
  };
};
  const savePlayer = async ({ nickName, avatar }) => {
    if (!dialog?.player) return;
    const id = dialog.player.openid;
    if (!nickName && !avatar) return toast('Chưa có thay đổi nào', 'info');
    setBusy(true);
    try {
      if (nickName && nickName !== dialog.player.nickName) await api.adminEditPlayer(id, { nickName });
      if (avatar) await api.adminUpdatePlayerAvatar(id, avatar);
      const patch = { ...(nickName ? { nickName } : {}), ...(avatar ? { avatarUrl: avatar } : {}) };
      setData((items) => (items || []).map((item) => item.openid === id ? { ...item, ...patch } : item));
      if (openid === id) setPlayer((current) => ({ ...current, data: { ...current.data, ...patch } }));
      toast('Đã cập nhật người chơi');
      setDialog(null);
    } catch (error) {
      toastError(error);
    } finally {
      setBusy(false);
    };
  };
  const selectTab = (next) => {
    setTab(next);
    if (next === 'record') setRecordVisited(true);
  };

  if (!openid) return (
    <div className='space-y-4'>
      <Head title='Người chơi' sub={list ? `${list.length.toLocaleString('vi-VN')} người chơi` : 'Đang tải danh sách…'}>
        <div className='flex gap-2'>
          <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={reload} disabled={listLoading} aria-label='Làm mới'>
            {listLoading ? <Spinner size={14} /> : <IconRefresh size={14} />}
          </Button>
          <Button size='sm' onClick={() => setManualOpen(true)}><IconSearch size={14} /> Mã người chơi</Button>
        </div>
      </Head>
      <div className='grid gap-2 sm:grid-cols-[1fr_auto]'>
        <label className='flex h-10 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime'>
          <IconSearch size={15} className='text-mute' />
          <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder='Tìm tên người chơi, mã người chơi…' className='min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/50 sm:text-sm' />
        </label>
        <PageSizeSelect value={size} onChange={setSize} />
      </div>
      {!list && listLoading ? (
        <>
          <ul aria-busy='true' className='divide-y divide-line rounded-2xl border border-line bg-panel'>
            {Array.from({ length: Math.min(size, 10) }).map((_, index) => <PlayerRowSkeleton key={index} />)}
          </ul>
          <PagerSkeleton />
        </>
      ) : !list && listError ? <ErrorState message={listError} onRetry={reload} loading={listLoading} /> : shown.length ? (
        <ul className={`divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${listLoading ? 'opacity-50' : ''}`}>
          {rows.map((p, index) => <PlayerRow key={`${p.openid || 'player'}-${index}`} player={p} onAction={(kind) => kind === 'data' ? viewPlayer(p.openid) : setDialog({ kind, player: p })} />)}
        </ul>
      ) : <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>{query ? 'Không tìm thấy người chơi phù hợp' : 'Chưa có người chơi nào'}</p>}
      {pager}
      <Dialog open={manualOpen} title='Xem dữ liệu theo mã người chơi' onClose={() => setManualOpen(false)}>
        <form onSubmit={(event) => { setManualOpen(false); go(event); }} className='space-y-4'>
          <Field label='Mã người chơi' placeholder='openid' autoFocus autoCapitalize='none' value={input} onChange={(event) => setInput(event.target.value)} />
          <Button type='submit' className='w-full' disabled={!input.trim()}>Xem dữ liệu <IconArrowRight size={15} /></Button>
        </form>
      </Dialog>
      <PlayerDialogs player={dialog?.player} open={dialog?.kind} busy={busy} onClose={() => !busy && setDialog(null)} onSave={savePlayer} />
      <PlayerStarDialog player={dialog?.player} open={dialog?.kind} busy={busy} onClose={() => !busy && setDialog(null)} onSubmit={addStar} />
    </div>
  );

  return (
    <div className='space-y-4'>
      <div className='space-y-2'>
        <div className='flex min-w-0 items-center gap-2'>
          <Button variant='ghost' size='sm' className='size-8! shrink-0 p-0!' onClick={() => setOpenid('')} aria-label='Đổi người chơi'>
            <IconArrowLeft size={14} />
          </Button>
          <form onSubmit={go} className='flex h-8 min-w-0 flex-1 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime'>
          <IconSearch size={14} className='text-mute' />
          <input value={input} onChange={(e) => setInput(e.target.value)} placeholder='Mã người chơi khác…' className='min-w-0 flex-1 bg-transparent text-base outline-none sm:text-xs' />
          </form>
        </div>
        <Tabs value={tab} onChange={selectTab} tabs={PLAYER_TABS} />
        <div className='grid grid-cols-2 gap-1 rounded-lg border border-line bg-panel p-1'>
          <RecordCrypto openid={openid} />
        </div>
      </div>

      <div hidden={tab !== 'player'}>
        {player.loading ? (
          <PlayerCardSkeleton />
        ) : player.error ? (
          <ErrorState message={player.error} onRetry={() => loadPlayer()} />
        ) : (
          <PlayerCard player={player.data || {}} />
        )}
      </div>
      {recordVisited && (
        <div hidden={tab !== 'record'}>
          <div className='space-y-4'>
            <JsonEditor key={openid} deps={[openid]} load={async () => (await api.adminRecord(openid)).record} save={(v) => api.adminSaveRecord(openid, v)} />
          </div>
        </div>
      )}
      <PlayerDialogs player={dialog?.player} open={dialog?.kind} busy={busy} onClose={() => !busy && setDialog(null)} onSave={savePlayer} />
      <PlayerStarDialog player={dialog?.player} open={dialog?.kind} busy={busy} onClose={() => !busy && setDialog(null)} onSubmit={addStar} />
    </div>
  );
};