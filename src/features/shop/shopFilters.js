import { getPurchaseLimit, getTimeStatus, hasOptions, isAvailable, isBuyItemsSupported, productOptions, unmetConditions } from '@/features/shop/cartUtils';

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

const optionOwnership = (group) => hasOptions(group) ? productOptions(group).map((product) => ownedValue(product.owned)) : [ownedValue(group?.owned)];

export function ownershipStatus(group) {
  if (ownedValue(group?.owned) === true) return true;
  const statuses = optionOwnership(group);
  if (statuses.includes(true)) return true;
  if (statuses.includes(false)) return false;
  return null;
};

export function matchesShopFilter(group, filter, { cartKeys = new Set(), conflicts = new Set(), now = Date.now() } = {}) {
  const choices = productOptions(group);
  const statuses = optionOwnership(group);
  switch (filter) {
    case 'owned': return ownershipStatus(group) === true;
    case 'unowned': return statuses.includes(false) || (!hasOptions(group) && ownedValue(group?.owned) === false);
    case 'available': return choices.some((item) => isAvailable(item, group, conflicts, now));
    case 'locked': return choices.some((item) => !isBuyItemsSupported(item.key) || unmetConditions(item, group) || !getTimeStatus(item, group, now).available || getPurchaseLimit(item, group) < 1);
    case 'cart': return choices.some((item) => cartKeys.has(item.key));
    default: return true;
  };
};