import { call } from '@/shared/library/api/client';
import { normShop } from '@/shared/library/api/normalize';
import { compressJsonGZip } from '@/shared/library/compression/gzip';

export const MAX_QTY = 100;
export const ADMIN_MAX_QTY = 100000;
const MAX_COMPRESSED_BYTES = 256 * 1024;
const MAX_BODY_BYTES = 1024 * 1024;

export const getShop = async () => {
  const response = await call('GET', '/user/shop');
  return { ...response, tabs: normShop(response.shop) };
};

export const buy = async (items) => {
  if (!Array.isArray(items) || !items.length || items.length > 5000 || items.some((item) => !item || Object.keys(item).length !== 4 || !['category', 'key', 'amount', 'selections'].every((key) => Object.hasOwn(item, key)) || typeof item.category !== 'string' || typeof item.key !== 'string' || !Number.isSafeInteger(item.amount) || item.amount < 1 || !item.selections || typeof item.selections !== 'object' || Array.isArray(item.selections))) throw new Error('Danh sách vật phẩm không hợp lệ');
  const body = { items };
  if (new TextEncoder().encode(JSON.stringify(body)).byteLength > MAX_BODY_BYTES) throw new Error('Đơn hàng vượt giới hạn 1 MiB');
  const compressed = await compressJsonGZip(body);
  if (compressed.byteLength > MAX_COMPRESSED_BYTES) throw new Error('Đơn hàng nén vượt giới hạn 256 KiB');
  return call('POST', '/user/shop', compressed, { contentEncoding: 'gzip', coin: true });
};