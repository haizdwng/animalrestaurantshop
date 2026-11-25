import { hasValidPrice, nodeOptions } from '@/features/shop/cartUtils';
export const hasPrice = hasValidPrice;
export const initials = (name) => String(name || '').split(/\s+/).filter(Boolean).slice(0, 2).map((word) => word[0]).join('').toUpperCase();
export function matches(node, needle) {
  if (!needle) return true;
  if (String(node?.name || '').toLowerCase().includes(needle) || String(node?.key || '').toLowerCase().includes(needle) || String(node?.description || '').toLowerCase().includes(needle)) return true;
  return nodeOptions(node).some((option) => matches(option, needle));
};