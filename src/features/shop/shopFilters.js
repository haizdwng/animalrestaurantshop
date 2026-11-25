import { isAvailable, nodeOptions, ownedValue } from '@/features/shop/cartUtils';

export const SHOP_FILTER_OPTIONS = Object.freeze([
  { value: 'all', label: 'Tất cả vật phẩm' },
  { value: 'owned', label: 'Đã sở hữu' },
  { value: 'unowned', label: 'Chưa sở hữu' },
  { value: 'available', label: 'Có thể mua' },
  { value: 'locked', label: 'Chưa thể mua' },
  { value: 'cart', label: 'Trong giỏ hàng' }
]);

export function ownershipStatus(node) {
  const current = ownedValue(node?.owned);
  if (current !== null) return current;
  const statuses = nodeOptions(node).map((child) => ownershipStatus(child));
  if (statuses.includes(true)) return true;
  if (statuses.includes(false)) return false;
  return null;
};

export function matchesShopFilter(product, filter, { cart = [], category = '', accountLimit = 100, now = Date.now() } = {}) {
  switch (filter) {
    case 'owned': return ownershipStatus(product) === true;
    case 'unowned': return ownershipStatus(product) === false;
    case 'available': return isAvailable(product, accountLimit, now);
    case 'locked': return !isAvailable(product, accountLimit, now);
    case 'cart': return cart.some((item) => item.category === category && item.key === product.key);
    default: return true;
  };
};