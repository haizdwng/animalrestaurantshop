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

function selectProductFields(product, fields) {
  const selected = {};
  for (const field of fields) if (Object.hasOwn(product, field)) selected[field] = product[field];
  if (Array.isArray(selected.conditions)) {
    selected.conditions = selected.conditions.filter((condition) => condition && typeof condition.name === 'string' && typeof condition.already === 'boolean').map(({ name, already }) => ({ name, already }));
  } else delete selected.conditions;
  return selected;
};

function normalizeProduct(product) {
  if (!product || typeof product.key !== 'string' || !product.key.trim()) return null;
  const normalized = selectProductFields(product, PRODUCT_FIELDS);
  if (Array.isArray(product.options)) {
    normalized.options = product.options.filter((option) => option && typeof option.key === 'string' && option.key.trim()).map((option) => selectProductFields(option, OPTION_FIELDS));
  };
  return normalized;
};

function normalizeCategory(products) {
  const seen = new Set();
  const result = [];
  for (const source of products) {
    const product = normalizeProduct(source);
    if (!product) continue;
    const signature = JSON.stringify(product);
    if (seen.has(signature)) continue;
    seen.add(signature);
    result.push(product);
  };
  return result;
};

export function normShop(shop) {
  if (!shop || typeof shop !== 'object') return [];
  return Object.entries(SHOP_CATEGORIES).filter(([key]) => Array.isArray(shop[key])).map(([key, name]) => ({
    id: key,
    name,
    products: normalizeCategory(shop[key])
  }));
};

export const normAdminUser = (user) => ({ ...user, id: user._id });