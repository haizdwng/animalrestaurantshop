const TONES = {
  neutral: 'border-line bg-raise text-fg',
  accent: 'border-lime/25 bg-lime/10 text-lime',
  success: 'border-ok/25 bg-ok/10 text-ok',
  warning: 'border-coin/25 bg-coin/10 text-coin',
  danger: 'border-bad/25 bg-bad/10 text-bad'
};

export default function Badge({ tone = 'neutral', Icon, children, className = '' }) {
  return (
    <span className={`inline-flex max-w-full items-center gap-1 rounded-md border px-2 py-0.5 text-[10px] font-bold whitespace-nowrap ${TONES[tone] || TONES.neutral} ${className}`}>
      {Icon && <Icon size={12} className='shrink-0' />}
      {children}
    </span>
  );
};