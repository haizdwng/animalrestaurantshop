import { IconLoader2 } from '@tabler/icons-react';

const VARIANTS = {
  solid: 'bg-lime text-bg hover:brightness-110',
  danger: 'bg-bad text-bg hover:brightness-110',
  ghost: 'border border-line bg-raise text-fg hover:border-mute',
  quiet: 'text-mute hover:bg-raise hover:text-fg',
};
const SIZES = { sm: 'h-8 px-3 text-[11px]', md: 'h-11 px-4 text-xs' };

export default function Button({ variant = 'solid', size = 'md', className = '', loading, children, ...p }) {
  return (
    <button
      {...p}
      type={p.type || 'button'}
      disabled={p.disabled || loading}
      className={`inline-flex cursor-pointer items-center justify-center gap-2 rounded-lg font-bold tracking-wide transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40 disabled:active:scale-100 ${SIZES[size]} ${VARIANTS[variant]} ${className}`}
    >
      {loading ? <IconLoader2 size={16} className='animate-spin' /> : children}
    </button>
  );
};