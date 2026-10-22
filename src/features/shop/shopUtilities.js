import { HUES } from '@/features/shop/config';

export const hasPrice = (p) => p?.price !== null && p?.price !== undefined;

export const hue = (s) => HUES[[...String(s)].reduce((a, c) => a + c.charCodeAt(0), 0) % HUES.length];

export const initials = (name) => name
  .split(/\s+/)
  .filter(Boolean)
  .slice(0, 2)
  .map((w) => w[0])
  .join('')
  .toUpperCase()

export const matches = (p, needle) => !needle || p.name.toLowerCase().includes(needle) || String(p.id).toLowerCase().includes(needle);