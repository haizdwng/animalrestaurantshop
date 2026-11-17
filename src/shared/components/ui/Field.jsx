import { useId, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function Field({ label, right, error, hint, className = '', type = 'text', ...props }) {
  const generatedId = useId();
  const id = props.id || `input-${generatedId}`;
  const [visible, setVisible] = useState(false);
  const password = type === 'password';
  const description = [hint && `${id}-hint`, error && `${id}-error`].filter(Boolean).join(' ') || undefined;

  return (
    <div className={`min-w-0 ${className}`}>
      {label && (
        <div className='mb-1.5 flex items-center justify-between gap-2'>
          <label htmlFor={id} className='text-xs font-semibold text-fg'>{label}</label>
          {hint && <span id={`${id}-hint`} className='text-[11px] text-mute'>{hint}</span>}
        </div>
      )}
      <div className={`ui-control flex min-w-0 items-center overflow-hidden ${error ? 'border-bad! focus-within:shadow-none' : ''}`}>
        <input
          {...props}
          id={id}
          name={props.name || id}
          type={password && visible ? 'text' : type}
          autoComplete={props.autoComplete}
          aria-invalid={Boolean(error)}
          aria-describedby={description}
          className='min-h-10 min-w-0 flex-1 bg-transparent px-3 py-2.5 text-sm leading-snug outline-none placeholder:text-mute/60'
        />
        {password && (
          <button type='button' onClick={() => setVisible((previous) => !previous)} aria-label={visible ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} aria-pressed={visible}
            className='grid size-10 shrink-0 cursor-pointer place-items-center text-mute hover:bg-raise hover:text-fg'>
            {visible ? <IconEyeOff size={17} /> : <IconEye size={17} />}
          </button>
        )}
        {right}
      </div>
      {error && <p role='alert' id={`${id}-error`} className='mt-1.5 text-xs text-bad'>{error}</p>}
    </div>
  );
};