import { HUES } from '@/features/shop/config';

export const hasPrice = (product) => typeof product?.price === 'number' && Number.isSafeInteger(product.price) && product.price >= 0;
export const hue = (value) => HUES[[...String(value)].reduce((sum, character) => sum + character.charCodeAt(0), 0) % HUES.length];
export const initials = (name) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
export const matches = (product, needle) => !needle || String(product.name || '').toLowerCase().includes(needle) || String(product.key || '').toLowerCase().includes(needle) || (product.options || []).some((option) => String(option.key || '').toLowerCase().includes(needle) || String(option.name || '').toLowerCase().includes(needle));