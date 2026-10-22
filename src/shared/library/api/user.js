import { call } from '@/shared/library/api/client';
import { withUser } from '@/shared/library/api/auth';

export const updateUser = async (patch) => withUser(await call('PATCH', '/user', patch));
export const openidOtp = (openid) => call('POST', '/user/openid/otp', { openid });
export const changeOpenid = async (openid, otp) => withUser(await call('PATCH', '/user/openid', { openid, otp }));
export const redeemGiftCode = async (code) => withUser(await call('POST', '/user/giftcode', { code }));
export const getFriendLink = () => call('GET', '/user/links/friend');
export const getBuffetLink = () => call('GET', '/user/links/buffet');
export const checkShopReady = () => call('GET', '/user/shop/ready');

export async function updateAvatar(image) {
  const blob = typeof image === 'string' ? await (await fetch(image)).blob() : image;
  if (blob.size > 8 * 1024 * 1024) throw new Error('Ảnh đại diện không được vượt quá 8MB');
  if (!['image/jpeg', 'image/png'].includes(blob.type)) throw new Error('Ảnh đại diện chỉ được chấp nhận định dạng JPG, JPEG hoặc PNG');
  const fd = new FormData();
  fd.append('avatar', blob, `avatar.${blob.type.split('/')[1]}`);
  const r = await withUser(await call('PATCH', '/user/avatar', fd));
  return r;
};