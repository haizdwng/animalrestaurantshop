import { hasValidPrice, productOptions } from '@/features/shop/cartUtils';
export const hasPrice = hasValidPrice;
export const initials = (name) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
export const matches = (product, needle) => !needle || String(product.name || '').toLowerCase().includes(needle) || String(product.key || '').toLowerCase().includes(needle) || productOptions(product).some((option) => String(option.key || '').toLowerCase().includes(needle) || String(option.name || '').toLowerCase().includes(needle));