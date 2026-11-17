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
}
export const pickUser = (response) => normUser(response.user);
export const isAdmin = (user) => user?.role === 'administrator';

export const SHOP_CATEGORIES = Object.freeze({
  letters: 'Thư',
  customers: 'Khách',
  memorials: 'Vật kỷ niệm',
  foods: 'Món ăn',
  plants: 'Tưới cây',
  fishes: 'Cá',
  flowers: 'Hoa',
  vegetables: 'Rau',
  frames: 'Khung ảnh',
  specials: 'Đặc biệt',
  items: 'Vật phẩm'
});

const PRODUCT_FIELDS = ['key', 'name', 'image', 'price', 'once', 'owned', 'conditions', 'limit'];
const OPTION_FIELDS = ['key', 'name', 'image', 'price', 'once', 'owned', 'conditions', 'limit'];

function selectFields(product, fields) {
  const selected = {};
  for (const field of fields) if (Object.hasOwn(product, field)) selected[field] = product[field];
  if (Array.isArray(selected.conditions)) {
    selected.conditions = selected.conditions
      .filter((condition) => condition && typeof condition.name === 'string' && typeof condition.already === 'boolean')
      .map(({ name, already }) => ({ name, already }));
  } else delete selected.conditions;
  return selected;
};

function normalizeProduct(product) {
  if (!product || typeof product.key !== 'string' || !product.key.trim()) return null;
  const normalized = selectFields(product, PRODUCT_FIELDS);
  if (Array.isArray(product.options)) normalized.options = product.options.filter((option) => option && typeof option.key === 'string' && option.key.trim()).map((option) => selectFields(option, OPTION_FIELDS));
  return normalized;
};

function normalizeCategory(products) {
  const signatures = new Set();
  const result = [];
  for (const source of products) {
    const product = normalizeProduct(source);
    if (!product) continue;
    const signature = JSON.stringify(product);
    if (signatures.has(signature)) continue;
    signatures.add(signature);
    result.push(product);
  };
  return result;
};

export function normShop(shop) {
  if (!shop || typeof shop !== 'object') return [];
  return Object.entries(SHOP_CATEGORIES).filter(([category]) => Array.isArray(shop[category])).map(([category, name]) => ({ id: category, name, products: normalizeCategory(shop[category]) }));
};

export const normAdminUser = (user) => ({ ...user, id: user._id });