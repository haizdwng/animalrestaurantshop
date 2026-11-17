import { call } from '@/shared/library/api/client';
import { withUser } from '@/shared/library/api/auth';
import { normShop } from '@/shared/library/api/normalize';
import { compressJsonGZip } from '@/shared/library/compression/gzip';

export const MAX_QTY = 100;
export const ADMIN_MAX_QTY = 100000;

export const getShop = async () => {
  const response = await call('GET', '/user/shop');
  return { ...response, tabs: normShop(response.shop) };
};

export const buy = async (items) => {
  const body = await compressJsonGZip({ items });
  return withUser(await call('POST', '/user/shop', body, { contentEncoding: 'gzip' }));
};