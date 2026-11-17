import { hasOptions, isAvailable, productOptions, unmetConditions } from '@/features/shop/cartUtils';

export const SHOP_FILTER_OPTIONS = Object.freeze([
  { value: 'all', label: 'Tất cả vật phẩm' },
  { value: 'owned', label: 'Đã sở hữu' },
  { value: 'unowned', label: 'Chưa sở hữu' },
  { value: 'available', label: 'Có thể mua' },
  { value: 'locked', label: 'Chưa đủ điều kiện' },
  { value: 'cart', label: 'Trong giỏ hàng' }
]);

export function ownedValue(value) {
  if (typeof value === 'boolean') return value;
  if (typeof value === 'number') return Number.isFinite(value) ? value > 0 : null;
  if (typeof value === 'string') return value.trim().length > 0;
  return null;
};

export function ownershipStatus(group) {
  const groupStatus = ownedValue(group?.owned);
  const options = hasOptions(group) ? group.options : [];
  const optionStatuses = options.map((option) => ownedValue(option?.owned));
  if (groupStatus === true || optionStatuses.includes(true)) return true;
  if (groupStatus === false || optionStatuses.includes(false)) return false;
  return null;
};

export function matchesShopFilter(group, filter, { cartKeys = new Set(), conflicts = new Set() } = {}) {
  const choices = productOptions(group);
  switch (filter) {
    case 'owned': return ownershipStatus(group) === true;
    case 'unowned': return ownershipStatus(group) === false;
    case 'available': return choices.some((product) => isAvailable(product, group, conflicts));
    case 'locked': return choices.some((product) => unmetConditions(product, group));
    case 'cart': return choices.some((product) => cartKeys.has(product.key));
    default: return true;
  };
};