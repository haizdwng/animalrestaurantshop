import { hasOptions, isAvailable, productOptions, unmetConditions, getTimeStatus } from '@/features/shop/cartUtils';

export const SHOP_FILTER_OPTIONS = Object.freeze([
  { value: 'all', label: 'Tất cả vật phẩm' },
  { value: 'owned', label: 'Đã sở hữu' },
  { value: 'unowned', label: 'Chưa sở hữu' },
  { value: 'available', label: 'Có thể mua' },
  { value: 'locked', label: 'Chưa thể mua' },
  { value: 'cart', label: 'Trong giỏ hàng' }
]);
export function ownedValue(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value > 0 : null;
  if (typeof value === 'string') return value.trim().length > 0;
  return null;
};
export function ownershipStatus(group) {
  const parent = ownedValue(group?.owned);
  const child = hasOptions(group) ? productOptions(group).map((item) => ownedValue(item.owned)) : [];
  if (parent === true || child.includes(true)) return true;
  if (parent === false || child.includes(false)) return false;
  return null;
};
export function matchesShopFilter(group, filter, { cartKeys = new Set(), conflicts = new Set(), now = Date.now() } = {}) {
  const choices = productOptions(group);
  switch (filter) {
    case 'owned': return ownershipStatus(group) === true;
    case 'unowned': return ownershipStatus(group) === false;
    case 'available': return choices.some((item) => isAvailable(item, group, conflicts, now));
    case 'locked': return choices.some((item) => unmetConditions(item, group) || !getTimeStatus(item, group, now).available);
    case 'cart': return choices.some((item) => cartKeys.has(item.key));
    default: return true;
  };
};