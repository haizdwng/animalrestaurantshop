import { useState } from 'react';
import { hue, initials } from '@/features/shop/shopUtilities';

const isUsableImageUrl = (value) => typeof value === 'string' && /^(https?:\/\/|\/|data:image\/)/i.test(value);

export default function Tile({ p, size = 'md' }) {
  const color = hue(p.key || p.name);
  const large = size === 'lg';
  const [failedImage, setFailedImage] = useState('');
  const imageUrl = isUsableImageUrl(p.image) ? p.image : null;

  return (
    <div className={`relative grid shrink-0 place-items-center overflow-hidden rounded-xl ${large ? 'size-16' : 'size-12'}`}
      style={{ background: `color-mix(in oklab, ${color} 14%, transparent)`, color }}>
      {imageUrl && failedImage !== imageUrl ? (
        <img src={imageUrl} alt='' loading='lazy' className='size-full object-cover' onError={() => setFailedImage(imageUrl)} />
      ) : (
        <span className={`font-extrabold tracking-tight ${large ? 'text-xl' : 'text-sm'}`}>
          {initials(p.name) || '?'}
        </span>
      )}
      <span className='absolute inset-0 rounded-xl ring-1 ring-current/20 ring-inset' />
    </div>
  );
};