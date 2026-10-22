import { hue, initials } from '@/features/shop/shopUtilities';

export default function Tile({ p, size = 'md' }) {
  const c = hue(p.id);
  const big = size === 'lg';
  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl ${big ? 'size-16' : 'size-12'}`} style={{ background: `color-mix(in oklab, ${c} 14%, transparent)`, color: c }}>
      {p.image ? <img src={p.image} alt='' loading='lazy' className='size-full object-cover' /> : <span className={`font-extrabold tracking-tight ${big ? 'text-xl' : 'text-sm'}`}>{initials(p.name) || '?'}</span>}
      <span className='absolute inset-0 rounded-xl ring-1 ring-current/20 ring-inset' />
    </div>
  );
};