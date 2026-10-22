import { useId, useState } from 'react';
import { IconEye, IconEyeOff } from '@tabler/icons-react';

export default function Field({ label, right, error, hint, className = '', type = 'text', ...p }) {
  const [show, setShow] = useState(false);
  const generatedId = useId();
  const id = p.id || `field-${generatedId}`;
  const isPw = type === 'password';
  return (
    <label className={`block ${className}`}>
      <span htmlFor={id} className='mb-1.5 flex items-baseline justify-between gap-2 text-[11px] font-medium text-mute'>
        {label}
        {hint && <span className='text-[10px] text-mute/70'>{hint}</span>}
      </span>
      <div className={`flex overflow-hidden rounded-lg border bg-bg transition focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/20 ${error ? 'border-bad' : 'border-line'}`}>
        <input {...p} id={id} name={p.name || id} type={isPw && show ? 'text' : type} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : hint ? `${id}-hint` : undefined} className='min-w-0 flex-1 bg-transparent px-3 py-3 text-base outline-none placeholder:text-mute/50 sm:text-sm' />
        {isPw && (
          <button type='button' tabIndex={-1} onClick={() => setShow(!show)} aria-label={show ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'} className='grid w-11 shrink-0 cursor-pointer place-items-center text-mute hover:text-fg'>
            {show ? <IconEyeOff size={16} /> : <IconEye size={16} />}
          </button>
        )}
        {right}
      </div>
      {hint && <span id={`${id}-hint`} className='sr-only'>{hint}</span>}
      {error && <span id={`${id}-error`} role='alert' className='mt-1.5 block text-[11px] text-bad'>{error}</span>}
    </label>
  );
};