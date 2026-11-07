import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconArrowLeft, IconBan, IconCircleCheck, IconRefresh } from '@tabler/icons-react';
import { Button, Dialog, ErrorState, Spinner, toast, toastError } from '@/shared/components/ui';
import { formatShortDateTime } from '@/shared/library/format';
import Head from '@/features/administration/Head';
import Composer from '@/features/chat/Composer';
import MessageList from '@/features/chat/MessageList';
import usePolling from '@/features/chat/usePolling';
import * as api from '@/shared/library/api';

function ConversationList({ activeId, onOpen }) {
  const { data, error, loading, refresh } = usePolling(api.adminChats, [], 6000);
  const list = data?.conversations;

  return (
    <div className='space-y-4'>
      <Head title='Trò chuyện' sub={list ? `${list.length.toLocaleString('vi-VN')} cuộc trò chuyện` : 'Đang tải…'}>
        <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={refresh} disabled={loading} aria-label='Làm mới'>
          {loading ? <Spinner size={14} /> : <IconRefresh size={14} />}
        </Button>
      </Head>
      {!list && error ? (
        <ErrorState message={error} onRetry={refresh} loading={loading} />
      ) : !list ? (
        <div className='grid h-40 place-items-center rounded-2xl border border-line bg-panel'><Spinner size={20} /></div>
      ) : list.length ? (
        <ul className='divide-y divide-line rounded-2xl border border-line bg-panel'>
          {list.map((c) => (
            <li key={c.userId}>
              <button onClick={() => onOpen(c.userId)} className={`flex w-full cursor-pointer items-center gap-3 px-4 py-3 text-left transition hover:bg-raise sm:px-5 ${c.userId === activeId ? 'bg-raise' : ''}`}>
                {c.avatar ? <img src={c.avatar} alt='' loading='lazy' className='size-10 shrink-0 rounded-full bg-raise object-cover' /> : <span className='grid size-10 shrink-0 place-items-center rounded-full bg-raise text-sm font-extrabold text-lime uppercase'>{(c.username || '?')[0]}</span>}
                <span className='min-w-0 flex-1'>
                  <span className='flex items-center gap-2 text-sm font-bold'>
                    <span className='truncate'>{c.name}</span>
                    <span className='truncate text-[11px] font-normal text-mute'>@{c.username}</span>
                    {c.banned && <span className='shrink-0 rounded-full bg-bad/15 px-2 py-0.5 text-[10px] text-bad'>Bị cấm</span>}
                  </span>
                  <span className='mt-0.5 block truncate text-[11px] text-mute'>{c.lastSender === 'admin' ? 'Bạn: ' : ''}{c.lastText}</span>
                </span>
                <span className='shrink-0 text-[10px] text-mute'>{formatShortDateTime(c.lastAt)}</span>
              </button>
            </li>
          ))}
        </ul>
      ) : (
        <p className='rounded-2xl border border-dashed border-line p-10 text-center text-xs text-mute'>Chưa có người dùng nào nhắn tin</p>
      )}
    </div>
  );
};

function Thread({ userId, onBack }) {
  const { data, error, loading, refresh, setData } = usePolling(() => api.adminChatThread(userId), [userId]);
  const [confirm, setConfirm] = useState(null);
  const [busy, setBusy] = useState(false);
  const user = data?.user;
  const messages = data?.messages || [];

  const send = async (text) => {
    const r = await api.adminSendChat(userId, text);
    setData((current) => ({ ...current, messages: [...(current?.messages || []), r.chat] }));
    refresh();
  };

  const run = async (fn) => {
    setBusy(true);
    try {
      const r = await fn();
      toast(r.message);
      setConfirm(null);
      await refresh();
    } catch (e) {
      toastError(e);
    } finally {
      setBusy(false);
    };
  };

  return (
    <div className='space-y-4'>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='sm' className='size-8! p-0!' onClick={onBack} aria-label='Quay lại'>
          <IconArrowLeft size={14} />
        </Button>
        <div className='min-w-0 flex-1'>
          <h1 className='truncate text-base font-extrabold'>{user ? `@${user.username}` : 'Trò chuyện'}</h1>
          {user && <p className='truncate text-[11px] text-mute'>{user.openid || '—'}</p>}
        </div>
        {user && (
          <Button variant={user.banned ? 'ghost' : 'danger'} size='sm' onClick={() => setConfirm({ kind: 'ban' })}>
            {user.banned ? <IconCircleCheck size={14} /> : <IconBan size={14} />}
            {user.banned ? 'Bỏ cấm chat' : 'Cấm chat'}
          </Button>
        )}
      </div>

      {!data && error ? (
        <ErrorState message={error} onRetry={refresh} loading={loading} />
      ) : !data ? (
        <div className='grid h-64 place-items-center rounded-2xl border border-line bg-panel'><Spinner size={20} /></div>
      ) : (
        <section className='flex h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-12rem)] min-h-80 flex-col overflow-hidden rounded-2xl border border-line bg-panel md:h-[calc(100dvh-var(--app-header-h)-12rem)]'>
          <MessageList messages={messages} mineSender='admin' onDelete={(message) => setConfirm({ kind: 'delete', message })} empty='Chưa có tin nhắn nào' />
          <Composer onSend={send} placeholder='Trả lời người dùng…' />
        </section>
      )}

      <Dialog open={!!confirm} title={confirm?.kind === 'delete' ? 'Xoá tin nhắn' : user?.banned ? 'Bỏ cấm trò chuyện' : 'Cấm trò chuyện'} onClose={() => !busy && setConfirm(null)}>
        {confirm?.kind === 'delete' ? (
          <p className='text-sm text-mute'>Tin nhắn “<span className='text-fg'>{confirm.message.text.slice(0, 120)}</span>” sẽ bị xoá khỏi cuộc trò chuyện.</p>
        ) : (
          <p className='text-sm text-mute'>{user?.banned ? `Cho phép @${user?.username} nhắn tin trở lại?` : `@${user?.username} sẽ không thể gửi tin nhắn nữa cho đến khi được bỏ cấm.`}</p>
        )}
        <div className='flex justify-end gap-2'>
          <Button variant='ghost' onClick={() => setConfirm(null)} disabled={busy}>Huỷ</Button>
          <Button
            variant={confirm?.kind === 'delete' || !user?.banned ? 'danger' : 'solid'}
            loading={busy}
            onClick={() => run(() => (confirm.kind === 'delete' ? api.adminDeleteChat(userId, confirm.message._id) : api.adminBanChat(userId, !user.banned)))}
          >
            {confirm?.kind === 'delete' ? 'Xoá' : user?.banned ? 'Bỏ cấm' : 'Cấm'}
          </Button>
        </div>
      </Dialog>
    </div>
  );
};

export default function AdminChat() {
  const { userId } = useParams();
  const navigate = useNavigate();
  return userId ? <Thread userId={userId} onBack={() => navigate('/administrator/chat')} /> : <ConversationList onOpen={(id) => navigate(`/administrator/chat/${id}`)} />;
};
