export const optionMode = (group) => Array.isArray(group?.singleOptions) ? 'singleOptions' : Array.isArray(group?.multipleOptions) ? 'multipleOptions' : null;
export const hasOptions = (group) => optionMode(group) !== null;
export const productOptions = (group) => hasOptions(group) ? group[optionMode(group)] : group ? [group] : [];
export const isOnce = (product, group = product) => (product?.once ?? group?.once) === true;

const isOwned = (value) => value === true || (typeof value === 'number' && value > 0) || (typeof value === 'string' && value.trim().length > 0);

export const isOwnedOnce = (product, group = product) => isOnce(product, group) && (isOwned(product?.owned) || (product !== group && group?.once === true && isOwned(group.owned)));

export const isFullyOwned = (product, group = product) => isOwnedOnce(product, group) || (!isOnce(product, group) && optionMode(group) !== 'singleOptions' && product?.owned === true);

const EXACT_BUY_KEYS = new Set(['money_skipAdCard', 'money_checkInCard', 'yuer', 'terrace_bottle', 'magnifier', 'freeWish', 'Ad_x15', 'pigeon_endTime', 'InviteCard', 'CallCard', 'seed', 'dreamSeed', 'BattleOrder15']);
const BUY_PREFIXES = ['courtyard_21_', 'doll_', 'vt_', 'fish_', 'Garden_', 'shiwu_', 'wanju_', 'takeOutFood_', 'customer_', 'booth_', 'npc_', 'food_', 'buffetFood_', 'Musician_', 'avatar_', 'specialty_fish_'];
const MEMORIAL_BUY_PREFIXES = ['waimai_che_', 'Meorial_', 'Momorial_', 'Memoria_'];
export const isBuyItemsSupported = (key) => typeof key === 'string' && (EXACT_BUY_KEYS.has(key) || BUY_PREFIXES.some((prefix) => key.startsWith(prefix)) || key.endsWith('_prop') || key.toLowerCase().startsWith('mail_') || key.toLowerCase().startsWith('memorial_') || MEMORIAL_BUY_PREFIXES.some((prefix) => key.startsWith(prefix)));
export const hasValidPrice = (product) => Number.isSafeInteger(product?.price) && product.price >= 0;
export const getConditions = (product, group = product) => [
  ...(Array.isArray(group?.conditions) ? group.conditions : []),
  ...(product === group ? [] : Array.isArray(product?.conditions) ? product.conditions : [])
];
export const unmetConditions = (product, group = product) => getConditions(product, group).some((condition) => condition?.already !== true);

export function getTimeStatus(product, group = product, now = Date.now()) {
  const layers = product === group ? [group] : [group, product];
  for (const layer of layers) {
    const { startTime, endTime } = layer || {};
    if (startTime !== undefined && (!Number.isSafeInteger(startTime) || startTime < 0)) return { available: false, state: 'invalid', boundary: null };
    if (endTime !== undefined && (!Number.isSafeInteger(endTime) || endTime < 0)) return { available: false, state: 'invalid', boundary: null };
    if (startTime !== undefined && endTime !== undefined && startTime >= endTime) return { available: false, state: 'invalid', boundary: null };
  };
  const start = Math.max(...layers.map((layer) => layer?.startTime ?? 0));
  const end = Math.min(...layers.map((layer) => layer?.endTime ?? Infinity));
  if (start >= end) return { available: false, state: 'invalid', boundary: null };
  if (now < start) return { available: false, state: 'upcoming', boundary: start };
  if (now >= end) return { available: false, state: 'expired', boundary: end };
  return { available: true, state: 'active', boundary: Number.isFinite(end) ? end : null };
};

export const formatShopDate = (timestamp) => new Intl.DateTimeFormat('vi-VN', {
  hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit', year: 'numeric'
}).format(new Date(timestamp));
export function getTimeMessage(product, group = product, now = Date.now()) {
  const status = getTimeStatus(product, group, now);
  if (status.state === 'upcoming') return `Mở bán từ ${formatShopDate(status.boundary)}`;
  if (status.state === 'expired') return `Đã kết thúc bán lúc ${formatShopDate(status.boundary)}`;
  if (status.state === 'invalid') return 'Thời gian bán không hợp lệ';
  if (status.boundary !== null) return `Kết thúc bán lúc ${formatShopDate(status.boundary)}`;
  return '';
};

const normalizeLimit = (limit) => limit === undefined || limit === Infinity ? Infinity : Number.isSafeInteger(limit) && limit > 0 ? limit : 0;
export const getPurchaseLimit = (product, group = product, accountLimit = 100) => Math.min(
  isFullyOwned(product, group) ? 0 : isOnce(product, group) ? 1 : Infinity,
  normalizeLimit(product?.limit), normalizeLimit(group?.limit), normalizeLimit(accountLimit)
);
export function clampCartQuantity(value, limit = 100) {
  if (limit < 1) return 0;
  const number = Number(value);
  return Math.max(1, Math.min(limit, Number.isFinite(number) ? Math.trunc(number) : 1));
};
export function getGroupRemaining(cart, group, selectedKey) {
  if (!hasOptions(group)) return Infinity;
  const limit = normalizeLimit(group.limit);
  if (limit === Infinity) return Infinity;
  const used = cart.reduce((sum, entry) => sum + (entry.groupKey === group.key && entry.key !== selectedKey ? entry.amount : 0), 0);
  return Math.max(0, limit - used);
};

export function indexShop(tabs) {
  const index = new Map();
  for (const tab of tabs || []) {
    for (const group of tab.products || []) {
      for (const product of productOptions(group)) {
        if (!product?.key) continue;
        if (!index.has(product.key)) index.set(product.key, []);
        index.get(product.key).push({ product, group, category: tab.name });
      };
    };
  };
  return index;
};

export function getPurchaseSignature(product, group = product) {
  return JSON.stringify({
    price: product?.price,
    once: isOnce(product, group),
    owned: product?.owned,
    parentOnceOwned: product !== group && group.once === true ? group.owned : null,
    productLimit: product?.limit ?? null,
    groupLimit: group?.limit ?? null,
    optionMode: optionMode(group),
    groupKey: hasOptions(group) ? group.key : null,
    conditions: getConditions(product, group).map(({ name, already }) => ({ name, already })),
    startTime: [group?.startTime ?? null, product === group ? null : product?.startTime ?? null],
    endTime: [group?.endTime ?? null, product === group ? null : product?.endTime ?? null]
  });
};
export function getConflictingKeys(tabs) {
  const conflicts = new Set();
  for (const [key, candidates] of indexShop(tabs)) {
    const signature = getPurchaseSignature(candidates[0].product, candidates[0].group);
    if (candidates.some(({ product, group }) => getPurchaseSignature(product, group) !== signature)) conflicts.add(key);
  };
  return conflicts;
};
export function isAvailable(product, group = product, conflicts = new Set(), now = Date.now()) {
  return !!product?.key && isBuyItemsSupported(product.key) && hasValidPrice(product) && !isFullyOwned(product, group) && !unmetConditions(product, group) && !conflicts.has(product.key) && getPurchaseLimit(product, group) >= 1 && getTimeStatus(product, group, now).available;
};

export function putInCart(cart, product, amount, category = '', accountLimit = 100,
  group = product, conflicts = new Set(), now = Date.now()) {
  if (!isAvailable(product, group, conflicts, now)) return cart;
  const exclusive = optionMode(group) === 'singleOptions' || (optionMode(group) === 'multipleOptions' && group.limit === 1);
  const remainingCart = exclusive ? cart.filter((entry) => entry.groupKey !== group.key || entry.key === product.key) : cart;
  const limit = Math.min(getPurchaseLimit(product, group, accountLimit), getGroupRemaining(remainingCart, group, product.key));
  if (limit < 1) return cart;
  const entry = { key: product.key, amount: clampCartQuantity(amount, limit), groupKey: group.key, product, group, category };
  const found = remainingCart.findIndex((other) => other.key === entry.key);
  if (found < 0) return [...remainingCart, entry];
  return remainingCart.map((other, index) => index === found ? entry : other);
};
export function changeCartQuantity(cart, key, amount, accountLimit = 100) {
  return cart.map((entry) => {
    if (entry.key !== key) return entry;
    const limit = Math.min(getPurchaseLimit(entry.product, entry.group, accountLimit), getGroupRemaining(cart, entry.group, key));
    return limit < 1 ? entry : { ...entry, amount: clampCartQuantity(amount, limit) };
  });
};
export function resolveCart(cart, tabs, accountLimit = 100, now = Date.now()) {
  const index = indexShop(tabs);
  const conflicts = getConflictingKeys(tabs);
  return cart.map((entry) => {
    const matches = index.get(entry.key) || [];
    const latest = matches.find((candidate) => candidate.group.key === entry.groupKey) || matches[0];
    const product = latest?.product || entry.product;
    const group = latest?.group || entry.group;
    const limit = getPurchaseLimit(product, group, accountLimit);
    const groupItems = cart.filter((item) => item.groupKey === group?.key);
    const groupAmount = groupItems.reduce((sum, item) => sum + item.amount, 0);
    let invalid = '';
    if (!latest) invalid = 'Vật phẩm không còn trong cửa hàng';
    else if (conflicts.has(entry.key)) invalid = 'Mã vật phẩm trùng với cấu hình khác nhau';
    else if (!isBuyItemsSupported(entry.key)) invalid = 'Chức năng mua mã vật phẩm này chưa được buyItems hỗ trợ';
    else if (isFullyOwned(product, group)) invalid = 'Đã đạt mức sở hữu tối đa';
    else if (unmetConditions(product, group)) invalid = 'Chưa đáp ứng điều kiện mua';
    else if (!getTimeStatus(product, group, now).available) invalid = getTimeMessage(product, group, now);
    else if (optionMode(group) === 'singleOptions' && new Set(groupItems.map((item) => item.key)).size > 1) invalid = 'Chỉ chọn một loại trong nhóm';
    else if (!Number.isSafeInteger(entry.amount) || entry.amount < 1 || entry.amount > limit || (hasOptions(group) && groupAmount > normalizeLimit(group.limit))) invalid = 'Số lượng vượt giới hạn mỗi lần mua';
    const price = hasValidPrice(product) ? product.price : 0;
    const total = price * entry.amount;
    if (!hasValidPrice(product) || !Number.isSafeInteger(total)) invalid = 'Giá vật phẩm không hợp lệ';
    return { ...entry, product, group, category: latest?.category || entry.category, price, total, invalid, limit };
  });
};
export const cartTotal = (entries) => entries.reduce((sum, entry) => sum + entry.total, 0);
export const cartCount = (entries) => entries.reduce((sum, entry) => sum + entry.amount, 0);
export const cartPayload = (entries) => entries.map(({ key, amount }) => ({ key, amount }));
export const eligibleCategoryProducts = (products, conflicts = new Set(), now = Date.now()) => (products || []).filter((product) => !hasOptions(product) && isAvailable(product, product, conflicts, now));
export function addCategoryToCart(cart, products, category = '', accountLimit = 100, conflicts = new Set(), now = Date.now()) {
  let updated = cart;
  for (const product of eligibleCategoryProducts(products, conflicts, now)) {
    if (updated.some((entry) => entry.key === product.key)) continue;
    updated = putInCart(updated, product, 1, category, accountLimit, product, conflicts, now);
  };
  return updated;
};
export function removeCategoryFromCart(cart, products) {
  const keys = new Set((products || []).flatMap((product) => productOptions(product).map((choice) => choice.key)));
  return cart.filter((entry) => !keys.has(entry.key));
};

function incrementOwned(product, amount, group = product) {
  if (isOnce(product, group)) return { ...product, owned: true };
  if (typeof product.owned === 'number') return { ...product, owned: product.owned + amount };
  return product;
};
function incrementDollOwned(product, amount) {
  const remaining = Math.max(0, product.limit - amount);
  const next = incrementOwned(product, amount);
  if (remaining === 0) {
    const { limit: unused, ...rest } = next;
    return { ...rest, owned: true };
  };
  return { ...next, limit: remaining };
};

export function applyPurchaseToTabs(tabs, purchasedItems) {
  const amounts = new Map(purchasedItems.map(({ key, amount }) => [key, amount]));
  return tabs.map((tab) => ({
    ...tab,
    products: tab.products.map((group) => {
      if (!hasOptions(group)) {
        const amount = amounts.get(group.key);
        if (!amount) return group;
        return tab.id === 'dolls' ? incrementDollOwned(group, amount) : incrementOwned(group, amount);
      };
      const mode = optionMode(group);
      const options = productOptions(group);
      const purchased = options.filter((option) => amounts.has(option.key));
      if (!purchased.length) return group;
      if (mode === 'singleOptions') {
        const selected = purchased[0];
        return {
          ...group,
          owned: typeof group.owned === 'string' ? (selected.name || selected.key) : typeof group.owned === 'boolean' ? true : group.owned,
          singleOptions: options.map((option) => ({
            ...option,
            owned: typeof option.owned === 'boolean' ? option.key === selected.key : (amounts.has(option.key) ? incrementOwned(option, amounts.get(option.key), group).owned : option.owned)
          }))
        };
      };
      const updatedOptions = options.map((option) => {
        const amount = amounts.get(option.key);
        return amount ? incrementOwned(option, amount, group) : option;
      });
      return {
        ...group,
        owned: typeof group.owned === 'number' && updatedOptions.every((option) => typeof option.owned === 'number') ? updatedOptions.reduce((sum, option) => sum + option.owned, 0) : group.owned,
        multipleOptions: updatedOptions
      };
    })
  }));
};