import { useState } from 'react';
import { hue, initials } from '@/features/shop/shopUtilities';

export default function Tile({ p, size = 'md' }) {
  const color = hue(p.id || p.name);
  const large = size === 'lg';
  const [failedImage, setFailedImage] = useState('');
  const imageFailed = !!p.image && failedImage === p.image;

  return (
    <div
      className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl ${large ? 'size-16' : 'size-12'}`}
      style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}
    >
      {p.image && !imageFailed ? (
        <img src={p.image} alt='' loading='lazy' className='size-full object-cover' onError={() => setFailedImage(p.image)} />
      ) : (
        <span className={`font-extrabold tracking-tight ${large ? 'text-xl' : 'text-sm'}`}>
          {initials(String(p.name || '')) || '?'}
        </span>
      )}
      <span className='absolute inset-0 rounded-xl ring-1 ring-current/20 ring-inset' />
    </div>
  );
};