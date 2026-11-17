import { useState } from 'react';
import { initials } from '@/features/shop/shopUtilities';

const usableImage = (value) => typeof value === 'string' && /^(https?:\/\/|\/|data:image\/)/i.test(value);

export default function Tile({ p, size = 'md' }) {
  const large = size === 'lg';
  const [failed, setFailed] = useState('');
  const src = usableImage(p?.image) ? p.image : '';
  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl border border-line bg-raise text-mute ${large ? 'size-16' : 'size-12'}`}>
      {src && src !== failed ? (
        <img src={src} alt='' loading='lazy' className='size-full object-cover' onError={() => setFailed(src)} />
      ) : (
        <span className={`font-extrabold tracking-tight ${large ? 'text-xl' : 'text-sm'}`}>
          {initials(p?.name || p?.key) || '?'}
        </span>
      )}
    </div>
  );
};