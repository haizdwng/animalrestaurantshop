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

const FIELDS = ['key', 'name', 'image', 'price', 'once', 'owned', 'conditions', 'limit', 'startTime', 'endTime'];
function selectFields(source) {
  const value = {};
  for (const field of FIELDS) if (Object.hasOwn(source, field)) value[field] = source[field];
  if (Array.isArray(value.conditions)) value.conditions = value.conditions.filter((condition) => condition && typeof condition.name === 'string' && typeof condition.already === 'boolean').map(({ name, already }) => ({ name, already }));
  else delete value.conditions;
  return value;
};
function normalizeProduct(product) {
  if (!product || typeof product.key !== 'string' || !product.key.trim()) return null;
  const normalized = selectFields(product);
  for (const field of ['multipleOptions', 'singleOptions']) {
    if (!Array.isArray(product[field])) continue;
    normalized[field] = product[field].filter((option) => option && typeof option.key === 'string' && option.key.trim()).map(selectFields);
  };
  return normalized;
};
function normalizeCategory(source) {
  const signatures = new Set();
  const products = [];
  for (const item of source) {
    const product = normalizeProduct(item);
    if (!product) continue;
    const signature = JSON.stringify(product);
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    products.push(product);
  };
  return products;
};
export function normShop(shop) {
  if (!shop || typeof shop !== 'object') return [];
  return Object.entries(SHOP_CATEGORIES).filter(([category]) => Array.isArray(shop[category])).map(([category, name]) => ({ id: category, name, products: normalizeCategory(shop[category]) }));
};
export const normAdminUser = (user) => ({ ...user, id: user._id });