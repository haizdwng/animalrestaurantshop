import { useMemo, useState } from 'react';
import { IconGift, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Button, Coin, Dialog, ErrorState, Field, Menu, PagerSkeleton, RowSkeleton, SearchInput, Spinner, toast, toastError } from '@/shared/components/ui';
import { formatDateTime, formatNumber } from '@/shared/library/format';
import { EMPTY_GIFT_CODE } from '@/features/administration/config';
import Head from '@/features/administration/Head';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRemoteResource from '@/shared/hooks/useRemoteResource';
import * as api from '@/shared/library/api';

function GiftCodeRow({ giftcode, onEdit, onDelete }) {
  return (
    <li className='flex min-w-0 items-center gap-3 px-4 py-3 sm:px-5'>
      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-lime'>
        <IconGift size={17} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-bold'>{giftcode.code}</p>
        <p className='mt-0.5 truncate text-[11px] text-mute'>
          Hạn dùng: {giftcode.date ? formatDateTime(giftcode.date) : 'Không giới hạn'} · Đã dùng {(giftcode.used || []).length.toLocaleString('vi-VN')} · Cập nhật {formatDateTime(giftcode.updatedAt)}
        </p>
      </div>
      <span className='hidden shrink-0 items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex'>
        <Coin size={15} /> {formatNumber(giftcode.coin)}
      </span>
      <Menu items={[
        { label: 'Sửa', Icon: IconPencil, onClick: onEdit },
        { label: 'Xoá', Icon: IconTrash, danger: true, onClick: onDelete }
      ]} />
    </li>
  );
};

const userId = (user) => String(user?._id ?? user?.id ?? '');
const selectedIds = (list) => (list || []).map((user) => String(typeof user === 'object' ? user._id ?? user.id : user)).filter(Boolean);
const identicalIds = (left, right) => left.length === right.length && left.every((id) => right.includes(id));

function UserAssignment({ title, description, users, usersLoading, selected, onChange }) {
  const [query, setQuery] = useState('');
  const selectedSet = useMemo(() => new Set(selected), [selected]);
  const available = useMemo(() => (users || []).filter((user) => {
    const text = `${user.username || ''} ${user.playerName || user.name || ''} ${user.openid || ''} ${userId(user)}`.toLowerCase();
    return !selectedSet.has(userId(user)) && text.includes(query.trim().toLowerCase());
  }), [users, selectedSet, query]);
  const userLookup = useMemo(() => new Map((users || []).map((user) => [userId(user), user])), [users]);
  const selectedUsers = useMemo(() => selected.map((id) => userLookup.get(id) || { _id: id }), [selected, userLookup]);
  const { rows: selectedRows, pager: selectedPager } = usePaginatedData(selectedUsers, `selected|${selected.join('|')}`);
  const { rows: availableRows, pager: availablePager } = usePaginatedData(available, `available|${query}|${selected.join('|')}`);

  return (
    <section className='min-w-0 space-y-3 rounded-xl border border-line bg-bg p-3'>
      <div className='flex flex-wrap items-start justify-between gap-2'>
        <div className='min-w-0 flex-1'>
          <h3 className='text-xs font-bold'>{title}</h3>
          <p className='mt-1 text-[11px] text-mute'>{description}</p>
        </div>
      </div>
      <div className='space-y-2'>
        <p className='text-[11px] font-semibold text-mute'>Đã thêm: {selectedUsers.length.toLocaleString('vi-VN')}</p>
        {selectedRows.length ? (
          <ul className='divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel'>
            {selectedRows.map((user) => (
              <li key={userId(user)} className='flex min-w-0 items-center justify-between gap-2 px-2.5 py-2'>
                <span className='min-w-0 truncate text-xs'>{user.username || user.openid || userId(user)}</span>
                <Button type='button' variant='quiet' size='sm' className='shrink-0 text-bad!' aria-label={`Bỏ ${user.username || userId(user)}`} onClick={() => onChange(selected.filter((id) => id !== userId(user)))}>Bỏ</Button>
              </li>
            ))}
          </ul>
        ) : <p className='rounded-lg border border-dashed border-line p-3 text-[11px] text-mute'>Chưa thêm người dùng nào</p>}
        {selectedPager}
      </div>
      <div className='space-y-2 border-t border-line pt-3'>
        <p className='text-[11px] font-semibold text-mute'>Có thể thêm: {available.length.toLocaleString('vi-VN')}</p>
        <SearchInput value={query} onChange={setQuery} label={`Tìm ${title.toLowerCase()}`} placeholder='Tìm tên đăng nhập, người chơi, OpenID…' />
        {usersLoading ? <p className='p-3 text-[11px] text-mute'>Đang tải danh sách người dùng…</p> : availableRows.length ? (
          <ul className='divide-y divide-line overflow-hidden rounded-lg border border-line bg-panel'>
            {availableRows.map((user) => (
              <li key={userId(user)} className='flex min-w-0 items-center justify-between gap-2 px-2.5 py-2'>
                <span className='min-w-0 flex-1'>
                  <span className='block truncate text-xs font-semibold'>{user.username || user.openid || userId(user)}</span>
                  <span className='block truncate text-[11px] text-mute'>{user.playerName || user.name || user.openid || userId(user)}</span>
                </span>
                <Button type='button' variant='ghost' size='sm' className='shrink-0' onClick={() => onChange([...selected, userId(user)])}>Thêm</Button>
              </li>
            ))}
          </ul>
        ) : <p className='rounded-lg border border-dashed border-line p-3 text-[11px] text-mute'>Không còn người dùng phù hợp</p>}
        {availablePager}
      </div>
    </section>
  );
};

function GiftCodeDialog({ dialog, form, setForm, busy, onClose, onCreate, onEdit, users, usersLoading, selectedUsers, setSelectedUsers, selectedUsed, setSelectedUsed }) {
  const editing = dialog?.kind === 'edit';
  const setField = (key) => (event) => setForm((state) => ({ ...state, [key]: event.target.value }));
  return (
    <Dialog open={dialog?.kind === 'create' || editing} title={editing ? `Sửa mã đổi thưởng ${dialog?.giftcode?.code}` : 'Thêm mã đổi thưởng'} onClose={onClose}>
      <form noValidate className='space-y-4' onSubmit={editing ? onEdit : onCreate}>
        <Field label='Mã đổi thưởng' placeholder='GIFTCODE' autoFocus autoCapitalize='characters' value={form.code} onChange={setField('code')} />
        <Field label='Số xu' type='number' inputMode='numeric' placeholder='100' value={form.coin} onChange={setField('coin')} />
        <Field label='Ngày hết hạn' type='datetime-local' hint='để trống nếu không giới hạn' value={form.date} onChange={setField('date')} />
        <>
          <UserAssignment title='Người dùng được phép dùng' users={users} usersLoading={usersLoading} selected={selectedUsers} onChange={setSelectedUsers} />
          <UserAssignment title='Người dùng đã sử dụng' users={users} usersLoading={usersLoading} selected={selectedUsed} onChange={setSelectedUsed} />
        </>
        <Button type='submit' className='w-full' loading={busy}>
          {editing ? 'Lưu thay đổi' : 'Thêm mã đổi thưởng'}
        </Button>
      </form>
    </Dialog>
  );
};

function DeleteDialog({ giftcode, busy, onClose, onConfirm }) {
  return (
    <Dialog open={!!giftcode} title='Xoá mã đổi thưởng' onClose={onClose}>
      <p className='text-sm text-mute'>
        Xoá mã đổi thưởng <b className='text-fg'>{giftcode?.code}</b>? Hành động này không thể hoàn tác.
      </p>
      <div className='grid grid-cols-2 gap-2'>
        <Button variant='ghost' onClick={onClose}>Huỷ</Button>
        <Button variant='danger' requestAction loading={busy} onClick={onConfirm}>Xoá</Button>
      </div>
    </Dialog>
  );
};

export default function GiftCodes() {
  const { data: users, loading: usersLoading, error: usersError, reload: reloadUsers } = useRemoteResource(async () => (await api.adminUsers()).users);
  const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await api.adminGiftCodes()).giftcodes, Array.isArray(users));
  const [query, setQuery] = useState('');
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(EMPTY_GIFT_CODE);
  const [busy, setBusy] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsed, setSelectedUsed] = useState([]);

  const matching = useMemo(() => {
    const search = query.trim().toLowerCase();
    return list?.filter((entry) => !search || String(entry.code ?? '').toLowerCase().includes(search));
  }, [list, query]);
  const { rows, pager } = usePaginatedData(matching, query);
  const close = () => !busy && setDialog(null);
  const openCreate = () => {
    setForm(EMPTY_GIFT_CODE);
    setSelectedUsers([]);
    setSelectedUsed([]);
    setDialog({ kind: 'create' });
  };
  const openEdit = (giftcode) => {
    setForm({
      code: giftcode.code ?? '',
      coin: String(giftcode.coin ?? ''),
      date: giftcode.date ? String(giftcode.date).slice(0, 16) : ''
    });
    setSelectedUsers(selectedIds(giftcode.users));
    setSelectedUsed(selectedIds(giftcode.used));
    setDialog({ kind: 'edit', giftcode });
  };
  const run = async (action, message) => {
    setBusy(true);
    try {
      const result = await action();
      toast(result?.message || message);
      setDialog(null);
      load();
    } catch (error) {
      toastError(error);
      load();
    } finally {
      setBusy(false);
    };
  };
  const values = () => {
    const code = form.code.trim().toUpperCase();
    const coin = Number(form.coin);
    if (!code) return toast('Nhập mã đổi thưởng', 'err');
    if (!Number.isSafeInteger(coin) || coin <= 0) return toast('Nhập số xu hợp lệ', 'err');
    return { code, coin, date: form.date ? new Date(form.date).toISOString() : null };
  };
  const create = (event) => {
    event.preventDefault();
    const value = values();
    if (!value) return;
    run(async () => {
      const created = await api.adminCreateGiftCode(value);
      if (selectedUsers.length || selectedUsed.length) await api.adminEditGiftCode(value.code, { users: selectedUsers, used: selectedUsed });
      return created;
    }, 'Đã thêm mã đổi thưởng');
  };
  const edit = (event) => {
    event.preventDefault();
    const value = values();
    if (!value) return;
    const previous = dialog.giftcode;
    const patch = {};
    if (value.code !== previous.code) patch.code = value.code;
    if (value.coin !== Number(previous.coin)) patch.coin = value.coin;
    const previousDate = previous.date ? new Date(previous.date).toISOString() : null;
    if (value.date !== previousDate) patch.date = value.date;
    if (!identicalIds(selectedUsers, selectedIds(previous.users))) patch.users = selectedUsers;
    if (!identicalIds(selectedUsed, selectedIds(previous.used))) patch.used = selectedUsed;
    if (!Object.keys(patch).length) return toast('Chưa có thay đổi nào', 'info');
    run(() => api.adminEditGiftCode(previous.code, patch), 'Đã cập nhật mã đổi thưởng');
  };
  const remove = () => run(() => api.adminDeleteGiftCode(dialog.giftcode.code), 'Đã xoá mã đổi thưởng');

  return (
    <>
      <div className='min-w-0 space-y-4'>
        <Head title='Mã đổi thưởng' sub={list ? `${list.length.toLocaleString('vi-VN')} mã` : 'Đang tải danh sách…'}>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm' onClick={load} requestAction disabled={loading} aria-label='Tải lại danh sách mã đổi thưởng'>
              {loading ? <Spinner size={16} /> : <IconRefresh size={16} />}
            </Button>
            <Button size='sm' onClick={openCreate} disabled={!Array.isArray(users)} aria-label='Thêm mã đổi thưởng'><IconPlus size={17} /> Thêm mã đổi thưởng</Button>
          </div>
        </Head>
        <SearchInput value={query} onChange={setQuery} label='Tìm mã đổi thưởng' placeholder='Tìm mã đổi thưởng…' />
        {!users && usersError ? <ErrorState message={usersError} onRetry={reloadUsers} loading={usersLoading} /> : !list && (loading || usersLoading) ? (
          <>
            <ul aria-busy='true' className='divide-y divide-line rounded-2xl border border-line bg-panel'>
              {Array.from({ length: 10 }).map((_, index) => (
                <RowSkeleton kind='giftcode' key={index} w={index % 2 ? 'w-1/3' : 'w-1/4'} />
              ))}
            </ul>
            <PagerSkeleton />
          </>
        ) : !list && error ? <ErrorState message={error} onRetry={load} loading={loading} /> : matching?.length ? (
          <ul className={`divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? 'opacity-50' : ''}`}>
            {rows.map((giftcode, index) => (
              <GiftCodeRow key={`${giftcode.code || 'giftcode'}-${index}`} giftcode={giftcode} onEdit={() => openEdit(giftcode)} onDelete={() => setDialog({ kind: 'delete', giftcode })} />
            ))}
          </ul>
        ) : null}
        {pager}
        {list && !matching?.length && <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>
          {query ? 'Không tìm thấy mã đổi thưởng phù hợp' : 'Chưa có mã đổi thưởng nào'}
        </p>}
      </div>
      <GiftCodeDialog dialog={dialog} form={form} setForm={setForm} busy={busy} onClose={close} onCreate={create} onEdit={edit} users={users} usersLoading={usersLoading} selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers} selectedUsed={selectedUsed} setSelectedUsed={setSelectedUsed} />
      <DeleteDialog giftcode={dialog?.kind === 'delete' ? dialog.giftcode : null} busy={busy} onClose={close} onConfirm={remove} />
    </>
  );
};