export const hasOptions = (product) => Array.isArray(product?.options) && product.options.length > 0;
export const productOptions = (product) => hasOptions(product) ? product.options : [product];
export const isOnce = (product, group = product) => (product?.once ?? group?.once) === true;
export const isOwnedOnce = (product, group = product) => isOnce(product, group) && product?.owned === true;
export const unmetConditions = (product, group = product) => [
  ...(Array.isArray(group?.conditions) ? group.conditions : []),
  ...(group === product ? [] : Array.isArray(product?.conditions) ? product.conditions : [])
].some((condition) => condition?.already !== true);

export const clampCartQuantity = (value, once = false, limit = 100) => {
  const number = Number(value);
  return Math.max(1, Math.min(once ? 1 : limit, Number.isFinite(number) ? Math.trunc(number) : 1));
};

export function putInCart(cart, product, amount, category = '', limit = 100, group = product) {
  if (!product?.key || typeof product.price !== 'number' || !Number.isSafeInteger(product.price) || product.price < 0) return cart;
  if (isOwnedOnce(product, group) || unmetConditions(product, group)) return cart;
  const entry = {
    key: product.key,
    amount: clampCartQuantity(amount, isOnce(product, group), limit),
    product,
    groupKey: group.key,
    group,
    category
  };
  const index = cart.findIndex((existing) => existing.key === entry.key);
  if (index < 0) return [...cart, entry];
  return cart.map((existing, position) => position === index ? entry : existing);
};

export function changeCartQuantity(cart, key, amount, limit = 100) {
  return cart.map((entry) => entry.key === key ? { ...entry, amount: clampCartQuantity(amount, isOnce(entry.product, entry.group), limit) } : entry);
};

export function resolveCart(cart, tabs, isOwned = () => false, limit = 100) {
  const index = new Map();
  for (const tab of tabs || []) {
    for (const group of tab.products || []) {
      for (const product of productOptions(group)) {
        if (product?.key) index.set(product.key, { product, group, category: tab.name });
      };
    };
  };
  return cart.map((entry) => {
    const current = index.get(entry.key);
    const product = current?.product || entry.product;
    const group = current?.group || entry.group || product;
    const price = product?.price;
    let invalid = '';
    if (Array.isArray(tabs) && !current) invalid = 'Vật phẩm không còn trong cửa hàng';
    else if (typeof price !== 'number' || !Number.isSafeInteger(price) || price < 0) invalid = 'Giá vật phẩm không hợp lệ';
    else if (isOwnedOnce(product, group) || isOwned(product)) invalid = 'Vật phẩm đã được mua';
    else if (unmetConditions(product, group)) invalid = 'Chưa đáp ứng điều kiện mua';
    else if (!Number.isInteger(entry.amount) || entry.amount < 1 || entry.amount > (isOnce(product, group) ? 1 : limit)) invalid = 'Số lượng vượt giới hạn';
    return {
      ...entry,
      product,
      group,
      category: current?.category || entry.category,
      price: typeof price === 'number' && Number.isSafeInteger(price) && price >= 0 ? price : 0,
      total: typeof price === 'number' && Number.isSafeInteger(price) && price >= 0 ? price * entry.amount : 0,
      invalid
    };
  });
};

export const cartTotal = (entries) => entries.reduce((sum, entry) => sum + entry.total, 0);
export const cartCount = (entries) => entries.reduce((sum, entry) => sum + entry.amount, 0);
export const cartPayload = (entries) => entries.map(({ key, amount }) => ({ key, amount }));
export const eligibleCategoryProducts = (products, isOwned = () => false) => (products || []).filter((product) => product && !hasOptions(product) && typeof product.price === 'number' && Number.isSafeInteger(product.price) && product.price >= 0).filter((product) => !isOwnedOnce(product) && !isOwned(product) && !unmetConditions(product));
export function addCategoryToCart(cart, products, category = '', isOwned = () => false, limit = 100) {
  const existing = new Set(cart.map(({ key }) => key));
  const result = [...cart];
  for (const product of eligibleCategoryProducts(products, isOwned)) {
    if (existing.has(product.key)) continue;
    existing.add(product.key);
    result.push({ key: product.key, amount: 1, product, groupKey: product.key, group: product, category });
  };
  return result;
};

export function removeCategoryFromCart(cart, products) {
  const keys = new Set((products || []).flatMap((product) => productOptions(product).map((option) => option.key)));
  return cart.filter((entry) => !keys.has(entry.key));
};