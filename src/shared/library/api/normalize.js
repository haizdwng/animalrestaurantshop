export const num = (...v) => Number(v.find((x) => x !== undefined && x !== null && x !== '') ?? 0);

export function normUser(u) {
  if (!u || typeof u !== 'object') return null;
  return {
    ...u,
    id: u.id ?? u._id,
    username: u.username ?? '',
    playerName: u.name ?? u.playerName ?? u.username ?? '',
    openid: u.openid ?? u.openId ?? '',
    avatar: u.avatar ?? u.avatarUrl ?? '',
    frame: u.frame ?? '',
    coins: num(u.coins, u.coin, u.money, u.gold, u.balance),
    star: num(u.star, u.stars),
    role: u.role ?? '',
    createdAt: u.createdAt ?? u.created_at
  };
};
export const pickUser = (r) => normUser(r.user ?? (r.username ? r : null));

export const isAdmin = (u) => String(u?.role || '').toLowerCase() === 'administrator';

const TAB_LABELS = {
  letters: 'Thư',
  customers: 'Khách hàng',
  boothOwners: 'Chủ quầy',
  memorials: 'Vật kỷ niệm',
  cookbooks: 'Món ăn làm ngay',
  musicians: 'Khách mời',
  items: 'Vật phẩm',
  terrace: 'Ban công',
  pond: 'Ao cá',
  vegetable: 'Vườn rau',
  flower: 'Vườn hoa',
  pet: 'Thú cưng',
  ship: 'Đồ ăn ship',
  special: 'Đặc biệt'
};
const toList = (v) => (Array.isArray(v) ? v : v && typeof v === 'object' ? Object.entries(v).map(([id, x]) => (x && typeof x === 'object' ? { id, ...x } : typeof x === 'number' ? { id, price: x } : { id, name: x })) : []);

function normProduct(p, i) {
  return {
    ...p,
    id: p.id ?? p._id ?? `${p.name || 'product'}-${i}`,
    name: p.name ?? p.title ?? `Sản phẩm ${i + 1}`,
    price: num(p.price, p.coin, p.cost),
    once: p.once === true
  };
};

export function normShop(shop) {
  if (!shop) return [];
  const keys = [...Object.keys(TAB_LABELS).filter((k) => k in shop), ...Object.keys(shop).filter((k) => !(k in TAB_LABELS))];
  return keys.map((k) => ({ id: k, name: TAB_LABELS[k] || k, products: toList(shop[k]).map(normProduct) }));
};

export const normAdminUser = (u) => ({ ...u, id: u._id ?? u.id, coin: num(u.coin, u.coins) });