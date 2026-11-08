import { call } from '@/shared/library/api/client';
import { withUser } from '@/shared/library/api/auth';
import { normShop } from '@/shared/library/api/normalize';

export const MAX_QTY = 100;

export const getShop = async () => {
  const r = await call('GET', '/user/shop');
  return { ...r, tabs: normShop(r.shop) };
};
export const buy = async (id, quantity) => withUser(await call('POST', '/user/shop', { id, quantity }));