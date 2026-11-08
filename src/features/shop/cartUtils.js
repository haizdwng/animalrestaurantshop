export const clampCartQuantity = (value, once = false, limit = 100) => {
  const number = Number(value);
  return Math.max(1, Math.min(once ? 1 : limit, Number.isFinite(number) ? Math.trunc(number) : 1));
};

export function putInCart(cart, product, quantity, category = '') {
  const entry = {
    id: product.id,
    quantity: clampCartQuantity(quantity, product.once),
    product,
    category
  };
  const index = cart.findIndex(({ id }) => String(id) === String(product.id));
  if (index === -1) return [...cart, entry];
  return cart.map((existing, i) => i === index ? entry : existing);
};

export function changeCartQuantity(cart, id, quantity) {
  return cart.map((entry) => String(entry.id) === String(id) ? { ...entry, quantity: clampCartQuantity(quantity, entry.product.once) } : entry);
};

export function resolveCart(cart, tabs, isOwned = () => false) {
  const loaded = Array.isArray(tabs);
  const productIndex = new Map();
  for (const tab of tabs || []) {
    for (const product of tab.products || []) productIndex.set(String(product.id), { product, category: tab.name });
  };
  return cart.map((entry) => {
    const latest = productIndex.get(String(entry.id));
    const product = latest?.product || entry.product;
    const price = Math.max(0, Number(product?.price) || 0);
    let invalid = '';
    if (loaded && !latest) invalid = 'Vật phẩm không còn trong cửa hàng';
    else if (loaded && (product.owned || isOwned(product))) invalid = 'Vật phẩm đã được mua';
    else if (loaded && product.conditions?.some((condition) => condition?.already === false)) invalid = 'Chưa đáp ứng điều kiện mua';
    else if (entry.quantity > (product.once ? 1 : 100)) invalid = 'Số lượng vượt giới hạn';
    return {
      ...entry,
      product,
      category: latest?.category || entry.category,
      price,
      total: price * entry.quantity,
      invalid
    };
  });
};

export const cartTotal = (entries) => entries.reduce((sum, entry) => sum + entry.total, 0);
export const cartCount = (entries) => entries.reduce((sum, entry) => sum + entry.quantity, 0);
export const cartPayload = (entries) => entries.map(({ id, quantity }) => ({ id, quantity }));