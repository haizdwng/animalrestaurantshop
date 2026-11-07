import { useEffect, useLayoutEffect, useRef } from 'react';
import { IconTrash } from '@tabler/icons-react';
import { formatShortDateTime } from '@/shared/library/format';

function Bubble({ message, mine, onDelete }) {
  return (
    <li className={`flex items-end gap-2 ${mine ? 'flex-row-reverse' : ''}`}>
      <img src={message.avatar} alt='' loading='lazy' className='size-8 shrink-0 rounded-full bg-raise object-cover' />
      <div className={`group flex min-w-0 max-w-[80%] flex-col ${mine ? 'items-end' : 'items-start'}`}>
        <p className='mb-0.5 flex items-center gap-1.5 px-1 text-[10px] text-mute'>
          <span className={`max-w-40 truncate font-bold ${message.sender === 'admin' ? 'text-lime' : ''}`}>{message.sender === 'admin' ? `${message.name} · Quản trị viên` : message.name}</span>
          <span>{formatShortDateTime(message.createdAt)}</span>
        </p>
        <div className='flex items-center gap-1'>
          {mine && onDelete && <DeleteButton onClick={() => onDelete(message)} />}
          <p className={`rounded-2xl px-3 py-2 text-sm leading-snug wrap-break-word whitespace-pre-wrap ${mine ? 'rounded-br-md bg-lime text-bg' : 'rounded-bl-md bg-raise'}`}>{message.text}</p>
          {!mine && onDelete && <DeleteButton onClick={() => onDelete(message)} />}
        </div>
      </div>
    </li>
  );
};

function DeleteButton({ onClick }) {
  return (
    <button onClick={onClick} aria-label='Xoá tin nhắn' className='grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-mute opacity-60 transition hover:bg-raise hover:text-bad hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100 sm:focus-visible:opacity-100'>
      <IconTrash size={14} />
    </button>
  );
};

// `mineSender` is which sender counts as "me" (right side): 'user' for users, 'admin' for admins.
export default function MessageList({ messages, mineSender, onDelete, empty }) {
  const box = useRef(null);
  const stick = useRef(true);
  const lastId = messages[messages.length - 1]?._id;

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const onScroll = () => (stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80);
    el.addEventListener('scroll', onScroll, { passive: true });
    return () => el.removeEventListener('scroll', onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = box.current;
    if (el && stick.current) el.scrollTop = el.scrollHeight;
  }, [lastId, messages.length]);

  return (
    <div ref={box} className='min-h-0 flex-1 overflow-y-auto overscroll-contain px-3 py-4 sm:px-4'>
      {messages.length ? (
        <ul className='space-y-3'>
          {messages.map((m) => (
            <Bubble key={m._id} message={m} mine={m.sender === mineSender} onDelete={onDelete} />
          ))}
        </ul>
      ) : (
        <p className='grid h-full min-h-40 place-items-center text-center text-xs text-mute'>{empty}</p>
      )}
    </div>
  );
};
