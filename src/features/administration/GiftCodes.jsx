import { useMemo, useState } from 'react';
import { IconGift, IconPencil, IconPlus, IconRefresh, IconTrash } from '@tabler/icons-react';
import { Button, Coin, Dialog, ErrorState, Field, Menu, PagerSkeleton, RowSkeleton, SearchInput, Skeleton, Spinner, toast, toastError } from '@/shared/components/ui';
import { formatDateTime, formatNumber } from '@/shared/library/format';
import { EMPTY_GIFT_CODE, GIFT_CODE_PAGE_SIZE } from '@/features/administration/config';
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
  const selectedSet = new Set(selected);
  const filtered = (users || []).filter((user) => {
    const searchable = `${user.username || ''} ${user.playerName || user.name || ''} ${user.openid || ''} ${userId(user)}`.toLowerCase();
    return !selectedSet.has(userId(user)) && searchable.includes(query.trim().toLowerCase());
  });
  const selectedUsers = selected.map((id) => (users || []).find((user) => userId(user) === id) || { _id: id });

  return (
    <section className='space-y-2 rounded-xl border border-line bg-bg p-3'>
      <div>
        <p className='text-xs font-bold'>{title}</p>
        <p className='mt-1 text-[11px] text-mute'>{description}</p>
      </div>
      {selectedUsers.length > 0 && (
        <div className='flex flex-wrap gap-1.5'>
          {selectedUsers.map((user) => (
            <button key={userId(user)} type='button' title='Bấm để bỏ người dùng'
              onClick={() => onChange(selected.filter((id) => id !== userId(user)))}
              className='max-w-full cursor-pointer truncate rounded-full border border-lime/20 bg-lime/10 px-2.5 py-1 text-[11px] font-bold text-lime hover:bg-lime/20'>
              {user.username || user.openid || userId(user)} ×
            </button>
          ))}
        </div>
      )}
      <SearchInput value={query} onChange={setQuery} label='Tìm người dùng để thêm' placeholder='Tìm người dùng để thêm…' />
      <div className='max-h-40 overflow-y-auto rounded-lg border border-line bg-panel'>
        {usersLoading ? (
          <p className='p-3 text-[11px] text-mute'>Đang tải danh sách người dùng…</p>
        ) : filtered.length ? (
          filtered.slice(0, 50).map((user) => (
            <button key={userId(user)} type='button'
              onClick={() => onChange([...selected, userId(user)])}
              className='flex w-full min-w-0 cursor-pointer items-center gap-2 border-b border-line px-3 py-2 text-left last:border-0 hover:bg-raise'>
              <span className='grid size-7 shrink-0 place-items-center rounded-md bg-raise text-[11px] font-bold text-lime'>
                {(user.username || '?')[0].toUpperCase()}
              </span>
              <span className='min-w-0 flex-1'>
                <span className='block truncate text-xs font-bold'>{user.username || 'Không có tên'}</span>
                <span className='block truncate text-[11px] text-mute'>{user.playerName || user.name || user.openid || userId(user)}</span>
              </span>
              <span className='shrink-0 text-[11px] text-lime'>Thêm</span>
            </button>
          ))
        ) : <p className='p-3 text-[11px] text-mute'>{query ? 'Không tìm thấy người dùng' : 'Không còn người dùng để thêm'}</p>}
      </div>
    </section>
  );
};

function GiftCodeDialog({ dialog, form, setForm, busy, onClose, onCreate, onEdit, users, usersLoading, selectedUsers, setSelectedUsers, selectedUsed, setSelectedUsed }) {
  const editing = dialog?.kind === 'edit';
  const setField = (key) => (event) => setForm((state) => ({ ...state, [key]: event.target.value }));
  return (
    <Dialog open={dialog?.kind === 'create' || editing}
      title={editing ? `Sửa mã đổi thưởng ${dialog?.giftcode?.code}` : 'Thêm mã đổi thưởng'} onClose={onClose}>
      <form noValidate className='space-y-4' onSubmit={editing ? onEdit : onCreate}>
        <Field label='Mã đổi thưởng' placeholder='GIFTCODE' autoFocus autoCapitalize='characters'
          value={form.code} onChange={setField('code')} />
        <Field label='Số xu' type='number' inputMode='numeric' placeholder='100'
          value={form.coin} onChange={setField('coin')} />
        <Field label='Ngày hết hạn' type='datetime-local' hint='để trống nếu không giới hạn'
          value={form.date} onChange={setField('date')} />
        {editing && (
          <>
            <UserAssignment title='Người dùng được phép dùng'
              description='Chỉ các tài khoản được chọn mới dùng được mã đổi thưởng này.'
              users={users} usersLoading={usersLoading} selected={selectedUsers} onChange={setSelectedUsers} />
            <UserAssignment title='Đã sử dụng'
              description='Danh sách người đã đổi thưởng. Có thể thêm hoặc bỏ để chỉnh trạng thái đã dùng.'
              users={users} usersLoading={usersLoading} selected={selectedUsed} onChange={setSelectedUsed} />
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
  const [query, setQuery] = useState('');
  const pageSize = GIFT_CODE_PAGE_SIZE;
  const [dialog, setDialog] = useState(null);
  const [form, setForm] = useState(EMPTY_GIFT_CODE);
  const [busy, setBusy] = useState(false);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsed, setSelectedUsed] = useState([]);

  const matching = useMemo(() => {
    const search = query.trim().toLowerCase();
    return list?.filter((entry) => !search || String(entry.code ?? '').toLowerCase().includes(search));
  }, [list, query]);
  const { rows, pager } = usePaginatedData(matching, pageSize, query);
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
    if (value) run(() => api.adminCreateGiftCode(value), 'Đã thêm mã đổi thưởng');
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
            <Button variant='ghost' size='sm' onClick={load} disabled={loading} aria-label='Tải lại danh sách mã đổi thưởng'>
              {loading ? <Spinner size={16} /> : <IconRefresh size={16} />}
            </Button>
            <Button size='sm' onClick={openCreate}><IconPlus size={17} /> Thêm mã đổi thưởng</Button>
          </div>
        </Head>
        <SearchInput value={query} onChange={setQuery} label='Tìm mã đổi thưởng' placeholder='Tìm mã đổi thưởng…' />
        {!list && loading ? (
          <>
            <ul aria-busy='true' className='divide-y divide-line rounded-2xl border border-line bg-panel'>
              {Array.from({ length: Math.min(pageSize, 10) }).map((_, index) => (
                <RowSkeleton key={index} w={index % 2 ? 'w-1/3' : 'w-1/4'} trail={<Skeleton className='hidden h-3.5 w-14 sm:block' />} />
              ))}
            </ul>
            <PagerSkeleton />
          </>
        ) : !list && error ? <ErrorState message={error} onRetry={load} loading={loading} /> : matching?.length ? (
          <ul className={`divide-y divide-line rounded-2xl border border-line bg-panel transition-opacity ${loading ? 'opacity-50' : ''}`}>
            {rows.map((giftcode, index) => (
              <GiftCodeRow key={`${giftcode.code || 'giftcode'}-${index}`} giftcode={giftcode}
                onEdit={() => openEdit(giftcode)} onDelete={() => setDialog({ kind: 'delete', giftcode })} />
            ))}
          </ul>
        ) : null}
        {pager}
        {list && !matching?.length && <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>
          {query ? 'Không tìm thấy mã đổi thưởng phù hợp' : 'Chưa có mã đổi thưởng nào'}
        </p>}
      </div>
      <GiftCodeDialog dialog={dialog} form={form} setForm={setForm} busy={busy} onClose={close}
        onCreate={create} onEdit={edit} users={users} usersLoading={usersLoading}
        selectedUsers={selectedUsers} setSelectedUsers={setSelectedUsers}
        selectedUsed={selectedUsed} setSelectedUsed={setSelectedUsed} />
      <DeleteDialog giftcode={dialog?.kind === 'delete' ? dialog.giftcode : null}
        busy={busy} onClose={close} onConfirm={remove} />
    </>
  );
};