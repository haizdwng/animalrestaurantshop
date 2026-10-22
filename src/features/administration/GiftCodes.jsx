import { useMemo, useState } from 'react';
import { IconGift, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Button, Coin, Dialog, ErrorState, Field, Menu, PagerSkeleton, RowSkeleton, Skeleton, Spinner, toast, toastError } from '@/shared/components/ui';
import { formatDateTime, formatNumber } from '@/shared/library/format';
import { EMPTY_GIFT_CODE, GIFT_CODE_PAGE_SIZE } from '@/features/administration/config';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRemoteResource from '@/shared/hooks/useRemoteResource';
import * as api from '@/shared/library/api';

function GiftCodeRow({ giftcode, onEdit, onDelete }) {
  return (
    <li className='flex items-center gap-3 px-4 py-3 sm:px-5'>
      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-lime'>
        <IconGift size={17} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className='truncate text-sm font-bold'>{giftcode.code}</p>
        <p className='mt-0.5 truncate text-[11px] text-mute'>
          Hạn dùng: {giftcode.date ? formatDateTime(giftcode.date) : 'Không giới hạn'} · Đã dùng {giftcode.used.length.toLocaleString('vi-VN')} · Cập nhật {formatDateTime(giftcode.updatedAt)}
        </p>
      </div>
      <span className='hidden items-center gap-1.5 text-sm font-bold tabular-nums text-coin sm:flex'>
        <Coin size={15} /> {formatNumber(giftcode.coin)}
      </span>
      <Menu
        items={[
          { label: 'Sửa', Icon: IconPencil, onClick: onEdit },
          { label: 'Xoá', Icon: IconTrash, danger: true, onClick: onDelete }
        ]}
      />
    </li>
  );
};

function userId(user) {
  return String(user?._id ?? user?.id ?? '');
};

function UserAssignment({ users, usersLoading, selected, onChange }) {
  const [query, setQuery] = useState('');
  const selectedSet = new Set(selected);
  const filtered = (users || []).filter((user) => {
    const value = `${user.username || ''} ${user.playerName || user.name || ''} ${user.openid || ''} ${userId(user)}`.toLowerCase();
    return !selectedSet.has(userId(user)) && value.includes(query.trim().toLowerCase());
  });
  const selectedUsers = selected.map((id) => (users || []).find((user) => userId(user) === id) || { _id: id });

  return (
    <section className='space-y-2 rounded-xl border border-line bg-bg p-3'>
      <div>
        <p className='text-xs font-bold'>Người dùng được phép dùng</p>
        <p className='mt-1 text-[10px] text-mute'>Chỉ các tài khoản được chọn mới dùng được mã đổi thưởng này.</p>
      </div>
      {selectedUsers.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {selectedUsers.map((user) => (
            <button
              key={userId(user)}
              type='button'
              onClick={() => onChange(selected.filter((id) => id !== userId(user)))}
              className='max-w-full cursor-pointer truncate rounded-full bg-lime/15 px-2.5 py-1 text-[10px] font-bold text-lime hover:bg-lime/25'
              title='Bấm để bỏ người dùng'
            >
              {user.username || user.openid || userId(user)} ×
            </button>
          ))}
        </div>
      )}
      <input
        value={query}
        onChange={(event) => setQuery(event.target.value)}
        placeholder='Tìm người dùng để thêm…'
        className='h-9 w-full rounded-lg border border-line bg-panel px-3 text-xs outline-none placeholder:text-mute/50 focus:border-lime'
      />
      <div className='max-h-40 overflow-y-auto rounded-lg border border-line bg-panel'>
        {usersLoading ? (
          <p className='p-3 text-[11px] text-mute'>Đang tải danh sách người dùng…</p>
        ) : filtered.length ? (
          filtered.slice(0, 50).map((user) => (
            <button
              key={userId(user)}
              type='button'
              onClick={() => onChange([...selected, userId(user)])}
              className='flex w-full min-w-0 items-center gap-2 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-raise'
            >
              <span className='grid size-7 shrink-0 place-items-center rounded-md bg-raise text-[10px] font-bold text-lime'>
                {(user.username || '?')[0].toUpperCase()}
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-xs font-bold'>{user.username || 'Không có tên'}</span>
                <span className='block truncate text-[10px] text-mute'>{user.playerName || user.name || user.openid || userId(user)}</span>
              </span>
              <span className='shrink-0 text-[10px] text-lime'>Thêm</span>
            </button>
          ))
        ) : (
          <p className='p-3 text-[11px] text-mute'>{query ? 'Không tìm thấy người dùng' : 'Không còn người dùng để thêm'}</p>
        )}
      </div>
    </section>
  );
};

function UsedUsers({ used, users }) {
  const entries = used.map((id) => {
    const user = (users || []).find((item) => userId(item) === id);
    return { id, label: user?.username || user?.playerName || user?.openid || id };
  });

  return (
    <section className='space-y-2 rounded-xl border border-line bg-bg p-3'>
      <div className='flex items-center justify-between gap-2'>
        <div>
          <p className='text-xs font-bold'>Đã sử dụng</p>
          <p className='mt-1 text-[10px] text-mute'>Lịch sử đổi thưởng.</p>
        </div>
        <span className='rounded-full bg-raise px-2 py-1 text-[10px] font-bold tabular-nums text-mute'>{used.length}</span>
      </div>
      {entries.length ? (
        <div className='flex max-h-24 flex-wrap gap-1.5 overflow-y-auto'>
          {entries.map(({ id, label }) => (
            <span key={id} title={id} className='max-w-full truncate rounded-full bg-raise px-2.5 py-1 text-[10px] text-mute'>
              {label}
            </span>
          ))}
        </div>
      ) : (
        <p className='text-[11px] text-mute'>Chưa có người dùng nào sử dụng.</p>
      )}
    </section>
  );
};

function GiftCodeDialog({ dlg, form, setForm, busy, onClose, onCreate, onEdit, users, usersLoading, selectedUsers, setSelectedUsers }) {
  const set = (key) => (e) => setForm((state) => ({ ...state, [key]: e.target.value }));
  const editing = dlg?.kind === 'edit';
  return (
    <Dialog open={dlg?.kind === 'create' || editing} title={editing ? `Sửa mã đổi thưởng ${dlg?.giftcode?.code}` : 'Thêm mã đổi thưởng'} onClose={onClose}>
      <form noValidate className='space-y-4' onSubmit={editing ? onEdit : onCreate}>
        <Field label='Mã đổi thưởng' placeholder='GIFTCODE' autoFocus autoCapitalize='characters' value={form.code} onChange={set('code')} />
        <Field label='Số xu' type='number' inputMode='numeric' placeholder='100' value={form.coin} onChange={set('coin')} />
        <Field label='Ngày hết hạn' type='datetime-local' hint='để trống nếu không giới hạn' value={form.date} onChange={set('date')} />
        {editing && (
          <>
            <UserAssignment users={users} usersLoading={usersLoading} selected={selectedUsers} onChange={setSelectedUsers} />
            <UsedUsers used={dlg.giftcode.used || []} users={users} />
          </>
        )}
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
        <Button variant='danger' loading={busy} onClick={onConfirm}>Xoá</Button>
      </div>
    </Dialog>
  );
};

export default function GiftCodes() {
  const { data: list, loading, error, reload: load } = useRemoteResource(async () => (await api.adminGiftCodes()).giftcodes);
  const { data: users, loading: usersLoading } = useRemoteResource(async () => (await api.adminUsers()).users);
  const [q, setQ] = useState('');
  const [size, setSize] = useState(GIFT_CODE_PAGE_SIZE);
  const [dlg, setDlg] = useState(null);
  const [form, setForm] = useState(EMPTY_GIFT_CODE);
  const [busy, setBusy] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);

  const shown = useMemo(() => {
    const query = q.trim().toLowerCase();
    return list?.filter((item) => !query || String(item.code ?? '').toLowerCase().includes(query));
  }, [list, q]);
  const { rows, pager } = usePaginatedData(shown, size, q);
  const close = () => !busy && setDlg(null);
  const openCreate = () => {
    setForm(EMPTY_GIFT_CODE);
    setSelectedUsers([]);
    setDlg({ kind: 'create' });
  };
  const openEdit = (giftcode) => {
    setForm({ code: giftcode.code ?? '', coin: String(giftcode.coin ?? ''), date: giftcode.date ? String(giftcode.date).slice(0, 16) : '' });
    setSelectedUsers((giftcode.users || []).map((user) => String(typeof user === 'object' ? user._id ?? user.id : user)).filter(Boolean));
    setDlg({ kind: 'edit', giftcode });
  };
  const run = async (fn, message) => {
    setBusy(true);
    try {
      const result = await fn();
      toast(result?.message || message);
      setDlg(null);
      load();
    } catch (e) {
      toastError(e);
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
  const create = (e) => {
    e.preventDefault();
    const value = values();
    if (value) run(() => api.adminCreateGiftCode(value), 'Đã thêm mã đổi thưởng');
  };
  const edit = (e) => {
    e.preventDefault();
    const value = values();
    if (!value) return;
    const patch = {};
    if (value.code !== dlg.giftcode.code) patch.code = value.code;
    if (value.coin !== Number(dlg.giftcode.coin)) patch.coin = value.coin;
    const oldDate = dlg.giftcode.date ? new Date(dlg.giftcode.date).toISOString() : null;
    if (value.date !== oldDate) patch.date = value.date;
    const previousUsers = (dlg.giftcode.users || []).map((user) => String(typeof user === 'object' ? user._id ?? user.id : user)).filter(Boolean);
    if (JSON.stringify(selectedUsers) !== JSON.stringify(previousUsers)) patch.users = selectedUsers;
    if (!Object.keys(patch).length) return toast('Chưa có thay đổi nào', 'info');
    run(() => api.adminEditGiftCode(dlg.giftcode.code, patch), 'Đã cập nhật mã đổi thưởng');
  };
  const remove = () => run(() => api.adminDeleteGiftCode(dlg.giftcode.code), 'Đã xoá mã đổi thưởng');

  return (
    <>
      <div className='space-y-4'>
        <div className='flex flex-wrap items-end justify-between gap-3'>
          <div>
            <h1 className='text-xl font-extrabold tracking-tight'>Mã đổi thưởng</h1>
            <p className='mt-1 text-xs text-mute'>{list ? `${list.length.toLocaleString('vi-VN')} mã` : 'Đang tải danh sách…'}</p>
          </div>
          <div className='flex gap-2'>
            <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={load} disabled={loading} aria-label='Làm mới'>
              {loading ? <Spinner size={14} /> : <IconRefresh size={14} />}
            </Button>
            <Button size='sm' onClick={openCreate}><IconPlus size={15} /> Thêm mã đổi thưởng</Button>
          </div>
        </div>
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder='Tìm mã đổi thưởng…' className='h-10 w-full rounded-lg border border-line bg-panel px-3 text-base outline-none placeholder:text-mute/50 focus:border-lime sm:text-sm' />
        {!list && loading ? (
          <>
            <ul aria-busy='true' className='divide-y divide-line rounded-2xl border border-line bg-panel'>
              {Array.from({ length: Math.min(size, 10) }).map((_, i) => <RowSkeleton key={i} w={i % 2 ? 'w-1/3' : 'w-1/4'} trail={<Skeleton className='hidden h-3.5 w-14 sm:block' />} />)}
            </ul>
            <PagerSkeleton />
          </>
        ) : !list && error ? <ErrorState message={error} onRetry={load} loading={loading} /> : shown?.length ? (
          <ul className={`divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? 'opacity-50' : ''}`}>
            {rows.map((giftcode, index) => <GiftCodeRow key={`${giftcode.code || 'giftcode'}-${index}`} giftcode={giftcode} onEdit={() => openEdit(giftcode)} onDelete={() => setDlg({ kind: 'delete', giftcode })} />)}
          </ul>
        ) : null}
        {pager}
        {list && !shown?.length && <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>{q ? 'Không tìm thấy mã đổi thưởng phù hợp' : 'Chưa có mã đổi thưởng nào'}</p>}
      </div>
      <GiftCodeDialog
        dlg={dlg}
        form={form}
        setForm={setForm}
        busy={busy}
        onClose={close}
        onCreate={create}
        onEdit={edit}
        users={users}
        usersLoading={usersLoading}
        selectedUsers={selectedUsers}
        setSelectedUsers={setSelectedUsers}
      />
      <DeleteDialog giftcode={dlg?.kind === 'delete' ? dlg.giftcode : null} busy={busy} onClose={close} onConfirm={remove} />
    </>
  );
};