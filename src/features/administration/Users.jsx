import { useMemo, useState } from 'react';
import { IconRefresh, IconSearch, IconUserPlus } from '@tabler/icons-react';
import { EMPTY_USER_FORM, USER_PAGE_SIZE, USER_SORTS } from '@/features/administration/config';
import { Button, ErrorState, PagerSkeleton, PageSizeSelect, RowSkeleton, Skeleton, SortSelect, Spinner, toast, toastError } from '@/shared/components/ui';
import { validate } from '@/shared/library/validate';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRemoteResource from '@/shared/hooks/useRemoteResource';
import Head from '@/features/administration/Head';
import UserDialogs from '@/features/administration/UserDialogs';
import UserRow from '@/features/administration/UserRow';
import * as api from '@/shared/library/api';

const SKELETON_WIDTHS = ['w-1/4', 'w-1/3', 'w-1/5'];
const SEARCH_FIELDS = ['username', 'openid', 'id', 'role'];

export default function AdminUsers() {
  const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await api.adminUsers()).users);
  const [q, setQ] = useState('');
  const [sort, setSort] = useState(USER_SORTS[0][0]);
  const [size, setSize] = useState(USER_PAGE_SIZE);
  const [dlg, setDlg] = useState(null);
  const [f, setF] = useState(EMPTY_USER_FORM);
  const [busy, setBusy] = useState(false);

  const shown = useMemo(() => {
    const s = q.trim().toLowerCase();
    const hit = !s ? list : list?.filter((u) => SEARCH_FIELDS.some((k) => String(u[k] ?? '').toLowerCase().includes(s)));
    const comparator = USER_SORTS.find((x) => x[0] === sort)?.[2] || USER_SORTS[0][2];
    return hit && [...hit].sort(comparator);
  }, [list, q, sort]);
  const { rows, pager } = usePaginatedData(shown, size, q + sort);

  const open = (kind, user) => {
    setF(kind === 'edit' ? { ...EMPTY_USER_FORM, openid: user.openid ?? '', username: user.username ?? '' } : EMPTY_USER_FORM);
    setDlg({ kind, user });
  };
  const close = () => !busy && setDlg(null);

  const run = async (fn, msg) => {
    setBusy(true);
    try {
      const r = await fn();
      toast(r.message || msg);
      setDlg(null);
      load();
    } catch (e) {
      toastError(e);
    } finally {
      setBusy(false);
    };
  };

  const submitCreate = (e) => {
    e.preventDefault();
    const err = validate.openid(f.openid) || validate.username(f.username.trim()) || validate.password(f.password);
    if (err) return toast(err, 'err');
    run(() => api.adminCreateUser({ openid: f.openid.trim(), username: f.username.trim(), password: f.password }), 'Đã thêm người dùng');
  };
  const submitEdit = (e) => {
    e.preventDefault();
    const u = dlg.user;
    const patch = {};
    if (f.openid.trim() && f.openid.trim() !== u.openid) patch.openid = f.openid.trim();
    if (f.username.trim() && f.username.trim() !== u.username) patch.username = f.username.trim();
    if (f.password) patch.password = f.password;
    const err = (patch.username && validate.username(patch.username)) || (patch.password && validate.password(patch.password));
    if (err) return toast(err, 'err');
    if (!Object.keys(patch).length) return toast('Chưa có thay đổi nào', 'info');
    run(() => api.adminEditUser(u.id, patch), 'Đã cập nhật người dùng');
  };
  const submitCoin = (e) => {
    e.preventDefault();
    const n = Number(f.coin);
    if (!Number.isFinite(n) || !n) return toast('Nhập số xu hợp lệ', 'err');
    run(() => api.adminAddCoin(dlg.user.id, n), `Đã cộng ${n.toLocaleString('vi-VN')} xu`);
  };
  const submitDelete = () => run(() => api.adminDeleteUser(dlg.user.id), 'Đã xoá người dùng');

  return (
    <div className='space-y-4'>
      <Head title='Người dùng' sub={list ? `${list.length.toLocaleString('vi-VN')} tài khoản` : 'Đang tải danh sách…'}>
        <div className='flex gap-2'>
          <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={load} disabled={loading} aria-label='Làm mới'>
            {loading ? <Spinner size={14} /> : <IconRefresh size={14} />}
          </Button>
          <Button size='sm' onClick={() => open('create')}>
            <IconUserPlus size={15} /> Thêm người dùng
          </Button>
        </div>
      </Head>

      <div className='grid gap-2 sm:grid-cols-[1fr_auto_auto]'>
        <label className='flex h-10 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime'>
          <IconSearch size={15} className='text-mute' />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Tìm tên đăng nhập, mã người chơi,…' className='min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/50 sm:text-sm' />
        </label>
        <div className='grid grid-cols-[1fr_auto] gap-2 sm:contents'>
          <SortSelect sorts={USER_SORTS} value={sort} onChange={setSort} />
          <PageSizeSelect value={size} onChange={setSize} />
        </div>
      </div>

      {!list && loading ? (
        <>
          <ul aria-busy='true' className='divide-y divide-line rounded-2xl border border-line bg-panel'>
            {Array.from({ length: Math.min(size, 10) }).map((_, i) => (
              <RowSkeleton key={i} w={SKELETON_WIDTHS[i % 3]} trail={<Skeleton className='hidden h-3.5 w-14 sm:block' />} />
            ))}
          </ul>
          <PagerSkeleton />
        </>
      ) : !list && error ? (
        <ErrorState message={error} onRetry={load} loading={loading} />
      ) : shown?.length ? (
        <ul className={`divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? 'opacity-50' : ''}`}>
          {rows.map((u, index) => (
          <UserRow key={`${u.id || u.openid || 'user'}-${index}`} user={u} onAction={(kind) => open(kind, u)} />
          ))}
        </ul>
      ) : null}
      {pager}
      {list && !shown?.length && <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>{q ? 'Không tìm thấy người dùng phù hợp' : 'Chưa có người dùng nào'}</p>}

      <UserDialogs dlg={dlg} f={f} setF={setF} busy={busy} onClose={close} onCreate={submitCreate} onEdit={submitEdit} onCoin={submitCoin} onDelete={submitDelete} />
    </div>
  );
};