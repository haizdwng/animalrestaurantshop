import { Button, ErrorState, Spinner } from '@/shared/components/ui';
import * as api from '@/shared/library/api';
import Composer from '@/features/chat/Composer';
import MessageList from '@/features/chat/MessageList';
import usePolling from '@/features/chat/usePolling';

export default function Chat() {
  const { data, error, loading, refresh, setData } = usePolling(api.getChat);
  const messages = data?.messages || [];

  const send = async (text) => {
    const r = await api.sendChat(text);
    setData((current) => ({ ...current, messages: [...(current?.messages || []), r.chat] }));
    refresh();
  };

  return (
    <div className='app-screen space-y-4'>
      <div>
        <h1 className='text-xl font-extrabold tracking-tight'>Trò chuyện</h1>
        <p className='mt-1 text-xs text-mute'>Nhắn tin trực tiếp với quản trị viên để được hỗ trợ</p>
      </div>
      {!data && loading ? (
        <div className='grid h-64 place-items-center rounded-2xl border border-line bg-panel'>
          <Spinner size={20} />
        </div>
      ) : !data && error ? (
        <ErrorState message={error} onRetry={refresh} loading={loading} />
      ) : (
        <section className='flex h-[calc(100dvh-var(--app-header-h)-var(--app-bottom-nav-h)-9.5rem)] min-h-80 flex-col overflow-hidden rounded-2xl border border-line bg-panel md:h-[calc(100dvh-var(--app-header-h)-9.5rem)]'>
          <MessageList messages={messages} mineSender='user' empty='Chưa có tin nhắn nào — hãy gửi lời chào đến quản trị viên!' />
          <Composer onSend={send} disabled={data?.banned} disabledText='Bạn đã bị cấm trò chuyện' />
        </section>
      )}
    </div>
  );
};
