export const num = (...values) => Number(values.find((value) => value !== undefined && value !== null && value !== '') ?? 0);

export function normUser(user) {
  if (!user || typeof user !== 'object') return null;
  return {
    ...user,
    id: user.id ?? user._id,
    username: user.username ?? '',
    playerName: user.name ?? user.playerName ?? user.username ?? '',
    openid: user.openid ?? user.openId ?? '',
    avatar: user.avatar ?? user.avatarUrl ?? '',
    frame: user.frame ?? '',
    coins: num(user.coins, user.coin, user.money, user.gold, user.balance),
    star: num(user.star, user.stars),
    role: user.role ?? '',
    invite: user.invite ?? '',
    friendInvite: user.friendInvite ?? user.friend_invite ?? '',
    createdAt: user.createdAt ?? user.created_at
  };
};

export const pickUser = (response) => normUser(response.user ?? (response.username ? response : null));
export const isAdmin = (user) => String(user?.role || '').toLowerCase() === 'administrator';

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

const PRODUCT_KEYS = ['key', 'name', 'image', 'price', 'once', 'owned', 'conditions'];
const OPTION_KEYS = ['key', 'name', 'image', 'price', 'once', 'owned', 'conditions'];

function copyFields(source, keys) {
  const result = {};
  for (const key of keys) {
    if (Object.hasOwn(source, key)) result[key] = source[key];
  };
  return result;
};

function normProduct(product) {
  if (!product || typeof product !== 'object' || typeof product.key !== 'string' || !product.key.trim()) return null;
  const result = copyFields(product, PRODUCT_KEYS);
  if (Array.isArray(result.conditions)) {
    result.conditions = result.conditions.filter((condition) => condition && typeof condition === 'object');
  } else delete result.conditions;
  if (Array.isArray(product.options)) {
    result.options = product.options.filter((option) => option && typeof option.key === 'string' && option.key.trim()).map((option) => {
      const choice = copyFields(option, OPTION_KEYS);
      if (Array.isArray(choice.conditions)) choice.conditions = choice.conditions.filter((condition) => condition && typeof condition === 'object');
      else delete choice.conditions;
      return choice;
    });
  };
  return result;
};

export function normShop(shop) {
  if (!shop || typeof shop !== 'object') return [];
  const seenKeys = new Set();
  return Object.entries(SHOP_CATEGORIES).filter(([category]) => Array.isArray(shop[category])).map(([category, name]) => ({
    id: category,
    name,
    products: shop[category].map(normProduct).filter(Boolean).flatMap((product) => {
      if (!Array.isArray(product.options) || product.options.length === 0) {
        if (seenKeys.has(product.key)) return [];
        seenKeys.add(product.key);
        return [product];
      };
      const options = product.options.filter((option) => {
        if (seenKeys.has(option.key)) return false;
        seenKeys.add(option.key);
        return true;
      });
      return options.length > 0 ? [{ ...product, options }] : [];
    })
  }));
};

export const normAdminUser = (user) => ({ ...user, id: user._id ?? user.id, coin: num(user.coin, user.coins) });