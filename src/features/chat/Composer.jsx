import { useState } from 'react';
import { IconSend } from '@tabler/icons-react';
import { Button, toast, toastError } from '@/shared/components/ui';
import { CHAT_MAX_LENGTH } from '@/features/chat/config';

export default function Composer({ onSend, disabled, disabledText, placeholder = 'Nhập tin nhắn…' }) {
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);
  const trimmed = text.trim();

  const submit = async (e) => {
    e?.preventDefault();
    if (busy || disabled) return;
    if (!trimmed) return;
    if (trimmed.length > CHAT_MAX_LENGTH) return toast(`Tin nhắn không được vượt quá ${CHAT_MAX_LENGTH} ký tự`, 'err');
    setBusy(true);
    try {
      await onSend(trimmed);
      setText('');
    } catch (error) {
      toastError(error);
    } finally {
      setBusy(false);
    };
  };

  if (disabled) return <p className='border-t border-line px-4 py-3 text-center text-xs text-bad'>{disabledText}</p>;

  return (
    <form onSubmit={submit} className='flex items-end gap-2 border-t border-line p-3'>
      <div className='min-w-0 flex-1'>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing) submit(e);
          }}
          rows={1}
          maxLength={CHAT_MAX_LENGTH + 50}
          placeholder={placeholder}
          className='max-h-28 min-h-10 w-full resize-none rounded-lg border border-line bg-panel px-3 py-2 text-base outline-none placeholder:text-mute/50 focus:border-lime sm:text-sm'
        />
        {text.length > CHAT_MAX_LENGTH * 0.8 && <p className={`mt-1 text-right text-[10px] ${text.length > CHAT_MAX_LENGTH ? 'text-bad' : 'text-mute'}`}>{text.length}/{CHAT_MAX_LENGTH}</p>}
      </div>
      <Button type='submit' className='size-10! shrink-0 p-0!' loading={busy} disabled={!trimmed} aria-label='Gửi'>
        <IconSend size={16} />
      </Button>
    </form>
  );
};
