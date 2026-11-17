export const hasOptions = (product) => Array.isArray(product?.options) && product.options.length > 0;
export const productOptions = (product) => hasOptions(product) ? product.options : [product];
export const isOnce = (product, group = product) => (product?.once ?? group?.once) === true;

export const isOwnedOnce = (product, group = product) => {
  if (!isOnce(product, group)) return false;
  const owned = product?.owned;
  return owned === true || (typeof owned === 'number' && owned > 0) || (typeof owned === 'string' && owned.length > 0);
};

export const hasValidPrice = (product) => Number.isSafeInteger(product?.price) && product.price >= 0;
export const getConditions = (product, group = product) => [
  ...(Array.isArray(group?.conditions) ? group.conditions : []),
  ...(product === group ? [] : Array.isArray(product?.conditions) ? product.conditions : [])
];
export const unmetConditions = (product, group = product) => getConditions(product, group).some((condition) => condition?.already !== true);

const positiveLimit = (value) => Number.isSafeInteger(value) && value > 0 ? value : Infinity;
export const getPurchaseLimit = (product, group = product, accountLimit = 100) => Math.min(
  isOnce(product, group) ? 1 : Infinity,
  positiveLimit(product?.limit),
  positiveLimit(group?.limit),
  positiveLimit(accountLimit)
);

export const clampCartQuantity = (value, limit = 100) => {
  const number = Number(value);
  const integer = Number.isFinite(number) ? Math.trunc(number) : 1;
  return Math.max(1, Math.min(limit, integer));
};

export const getGroupRemaining = (cart, group, selectedKey) => {
  if (!hasOptions(group) || !Number.isSafeInteger(group.limit) || group.limit < 1) return Infinity;
  const usedByOthers = cart.reduce((sum, entry) => sum + (entry.groupKey === group.key && entry.key !== selectedKey ? entry.amount : 0), 0);
  return Math.max(0, group.limit - usedByOthers);
};

export function indexShop(tabs) {
  const index = new Map();
  for (const tab of tabs || []) {
    for (const group of tab.products || []) {
      for (const product of productOptions(group)) {
        if (!product?.key || !hasValidPrice(product)) continue;
        const entries = index.get(product.key) || [];
        entries.push({ product, group, category: tab.name });
        index.set(product.key, entries);
      };
    };
  };
  return index;
};

export function getConflictingKeys(tabs) {
  const keys = new Set();
  for (const [key, entries] of indexShop(tabs)) {
    const first = entries[0];
    if (entries.some(({ product, group }) => product.price !== first.product.price || isOnce(product, group) !== isOnce(first.product, first.group) || isOwnedOnce(product, group) !== isOwnedOnce(first.product, first.group) || unmetConditions(product, group) !== unmetConditions(first.product, first.group))) keys.add(key);
  };
  return keys;
};

export function isAvailable(product, group = product, conflicts = new Set()) {
  return !!product?.key && hasValidPrice(product) && !isOwnedOnce(product, group) && !unmetConditions(product, group) && !conflicts.has(product.key);
};

export function putInCart(cart, product, amount, category = '', accountLimit = 100, group = product, conflicts = new Set()) {
  if (!isAvailable(product, group, conflicts)) return cart;

  const replaceSibling = hasOptions(group) && group.limit === 1;
  const result = replaceSibling ? cart.filter((entry) => entry.groupKey !== group.key || entry.key === product.key) : cart;
  const remaining = getGroupRemaining(result, group, product.key);
  const limit = Math.min(getPurchaseLimit(product, group, accountLimit), remaining);
  if (limit < 1) return cart;

  const entry = { key: product.key, amount: clampCartQuantity(amount, limit), groupKey: group.key, product, group, category };
  const existing = result.findIndex((item) => item.key === product.key);
  if (existing < 0) return [...result, entry];
  return result.map((item, index) => index === existing ? entry : item);
};

export function changeCartQuantity(cart, key, amount, accountLimit = 100) {
  return cart.map((entry) => {
    if (entry.key !== key) return entry;
    const limit = Math.min(getPurchaseLimit(entry.product, entry.group, accountLimit), getGroupRemaining(cart, entry.group, key));
    return limit < 1 ? entry : { ...entry, amount: clampCartQuantity(amount, limit) };
  });
};

export function resolveCart(cart, tabs, accountLimit = 100) {
  const index = indexShop(tabs);
  const conflicts = getConflictingKeys(tabs);
  return cart.map((entry) => {
    const matches = index.get(entry.key) || [];
    const latest = matches.find((candidate) => candidate.group.key === entry.groupKey) || matches[0];
    const product = latest?.product || entry.product;
    const group = latest?.group || entry.group;
    const limit = getPurchaseLimit(product, group, accountLimit);
    const groupAmount = cart.reduce((sum, item) => sum + (item.groupKey === entry.groupKey ? item.amount : 0), 0);
    let invalid = '';
    if (!latest) invalid = 'Vật phẩm không còn trong cửa hàng';
    else if (conflicts.has(entry.key)) invalid = 'Mã vật phẩm trùng với cấu hình khác nhau';
    else if (isOwnedOnce(product, group)) invalid = 'Vật phẩm đã sở hữu';
    else if (unmetConditions(product, group)) invalid = 'Chưa đáp ứng điều kiện mua';
    else if (!Number.isSafeInteger(entry.amount) || entry.amount < 1 || entry.amount > limit || groupAmount > (hasOptions(group) ? positiveLimit(group.limit) : Infinity)) invalid = 'Số lượng vượt giới hạn mỗi lần mua';
    const price = hasValidPrice(product) ? product.price : 0;
    const total = price * entry.amount;
    if (!hasValidPrice(product) || !Number.isSafeInteger(total)) invalid = 'Giá vật phẩm không hợp lệ';
    return { ...entry, product, group, category: latest?.category || entry.category, price, total, invalid, limit };
  });
};

export const cartTotal = (entries) => entries.reduce((sum, entry) => sum + entry.total, 0);
export const cartCount = (entries) => entries.reduce((sum, entry) => sum + entry.amount, 0);
export const cartPayload = (entries) => entries.map(({ key, amount }) => ({ key, amount }));

export const eligibleCategoryProducts = (products, conflicts = new Set()) => (products || []).filter((product) => !hasOptions(product) && isAvailable(product, product, conflicts));
export function addCategoryToCart(cart, products, category = '', accountLimit = 100, conflicts = new Set()) {
  let result = cart;
  for (const product of eligibleCategoryProducts(products, conflicts)) {
    if (result.some((entry) => entry.key === product.key)) continue;
    result = putInCart(result, product, 1, category, accountLimit, product, conflicts);
  };
  return result;
};

export function removeCategoryFromCart(cart, products) {
  const keys = new Set((products || []).flatMap((product) => productOptions(product).map((option) => option.key)));
  return cart.filter((entry) => !keys.has(entry.key));
};

const incrementOwned = (product, amount, group = product) => {
  if (isOnce(product, group)) return { ...product, owned: true };
  if (typeof product.owned === 'number') return { ...product, owned: product.owned + amount };
  return product;
};

export function applyPurchaseToTabs(tabs, purchasedItems) {
  const amounts = new Map(purchasedItems.map(({ key, amount }) => [key, amount]));
  return tabs.map((tab) => ({
    ...tab,
    products: tab.products.map((group) => {
      if (!hasOptions(group)) {
        const amount = amounts.get(group.key);
        return amount ? incrementOwned(group, amount) : group;
      };

      const selection = group.options.find((option) => amounts.has(option.key));
      if (!selection) return group;

      if (typeof group.owned === 'string' || (typeof group.owned === 'boolean' && group.options.every((option) => typeof option.owned === 'boolean'))) return {
        ...group,
        owned: selection.name || selection.key,
        options: group.options.map((option) => ({ ...option, owned: option.key === selection.key }))
      };

      const options = group.options.map((option) => {
        const amount = amounts.get(option.key);
        return amount ? incrementOwned(option, amount, group) : option;
      });
      const allNumeric = options.every((option) => typeof option.owned === 'number');
      const owned = allNumeric ? options.reduce((sum, option) => sum + option.owned, 0) : group.owned;
      return { ...group, owned, options };
    })
  }));
};