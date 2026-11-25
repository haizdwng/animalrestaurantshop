export function normUser(user) {
  if (!user || typeof user !== 'object') return null;
  return {
    ...user,
    id: user._id,
    username: user.username,
    playerName: user.name,
    openid: user.openid,
    avatar: user.avatar,
    frame: user.frame,
    coins: Number(user.coin),
    star: Number(user.star),
    role: user.role,
    invite: user.invite,
    friendInvite: user.friendInvite,
    createdAt: user.createdAt
  };
};
export const pickUser = (response) => normUser(response.user);
export const isAdmin = (user) => user?.role === 'administrator';

export const SHOP_CATEGORIES = Object.freeze({
  letters: 'Thư',
  customers: 'Khách hàng',
  musicians: 'Khách mời',
  memorials: 'Vật kỷ niệm',
  foods: 'Món ăn',
  plants: 'Tưới cây',
  fishes: 'Cá',
  flowers: 'Hoa',
  vegetables: 'Rau',
  frames: 'Khung ảnh',
  dolls: 'Búp bê',
  items: 'Vật phẩm',
  specials: 'Đặc biệt'
});

const PUBLIC_FIELDS = [
  'key', 'name', 'description', 'image', 'unit', 'type', 'price',
  'owned', 'canPurchase', 'purchaseLimit', 'purchaseLimitScope',
  'limit', 'limitScope', 'remainingLimit', 'remainingCapacity',
  'maxPurchasableQuantity', 'startTime', 'endTime',
  'required', 'minSelections', 'maxSelections', 'defaultValue'
];
const object = (value) => value !== null && typeof value === 'object' && !Array.isArray(value);
function normalizeNode(source, depth = 0) {
  if (!object(source) || typeof source.key !== 'string' || !source.key.trim() || depth > 62) return null;
  const node = {};
  for (const field of PUBLIC_FIELDS) if (Object.hasOwn(source, field)) node[field] = source[field];
  if (Array.isArray(source.conditions)) node.conditions = source.conditions.map((entry) => ({ name: entry?.name, met: entry?.met }));
  if (object(source.options)) {
    node.options = {};
    for (const [key, value] of Object.entries(source.options)) {
      if (value?.key !== key) continue;
      const child = normalizeNode(value, depth + 1);
      if (child) node.options[key] = child;
    };
  };
  return node;
};
export function normShop(shop) {
  if (!object(shop)) return [];
  return Object.entries(SHOP_CATEGORIES).filter(([category]) => Array.isArray(shop[category])).map(([id, name]) => ({
    id, name, products: shop[id].map((source) => normalizeNode(source)).filter(Boolean)
  }));
};
export const normAdminUser = (user) => ({ ...user, id: user._id });