import { call, enc } from '@/shared/library/api/client';
import { normAdminUser } from '@/shared/library/api/normalize';

export const adminUsers = async () => {
  const r = await call('GET', '/administrator/users');
  const list = Array.isArray(r.users) ? r.users : Array.isArray(r.data) ? r.data : Array.isArray(r) ? r : Object.values(r).find(Array.isArray) || [];
  return { ...r, users: list.map(normAdminUser) };
};
export const adminCreateUser = (data) => call('POST', '/administrator/users', data);
export const adminDeleteUser = (id) => call('DELETE', `/administrator/users/${enc(id)}`);
export const adminEditUser = (id, patch) => call('PATCH', `/administrator/users/${enc(id)}`, patch);
export const adminAddCoin = (id, coin) => call('POST', `/administrator/users/${enc(id)}/coin`, { coin });
export const adminPlayers = async () => {
  const r = await call('GET', '/administrator/players');
  const list = Array.isArray(r) ? r : Array.isArray(r.players) ? r.players : Array.isArray(r.data) ? r.data : Object.values(r).find(Array.isArray) || [];
  return { ...r, players: list.map((player) => ({ ...player, openid: player.openid ?? player.openId ?? player._id ?? player.id ?? '' })) };
};
export const adminEditPlayer = (openid, patch) => call('PATCH', `/administrator/players/${enc(openid)}`, patch);
export const adminUpdatePlayerAvatar = (openid, avatar) => {
  const form = new FormData();
  form.append('avatar', avatar, avatar?.name || 'avatar');
  return call('PATCH', `/administrator/players/${enc(openid)}/avatar`, form);
};
export const adminGiftCodes = async () => {
  const r = await call('GET', '/administrator/giftcodes');
  const list = Array.isArray(r) ? r : Array.isArray(r.giftcodes) ? r.giftcodes : Array.isArray(r.data) ? r.data : Object.values(r).find(Array.isArray) || [];
  const ids = (value) => (Array.isArray(value) ? value : []).map((entry) => typeof entry === 'object' ? entry?._id ?? entry?.id : entry).map(String).filter(Boolean);
  return { ...r, giftcodes: list.map((item) => ({ ...item, users: ids(item.users), used: ids(item.used) })) };
};
export const adminCreateGiftCode = (data) => call('POST', '/administrator/giftcodes', data);
export const adminEditGiftCode = (code, patch) => call('PATCH', `/administrator/giftcodes/${enc(code)}`, patch);
export const adminDeleteGiftCode = (code) => call('DELETE', `/administrator/giftcodes/${enc(code)}`);
export const adminPlayer = (openid) => call('GET', `/administrator/players/${enc(openid)}`);
export const adminRecord = (openid) => call('GET', `/administrator/players/${enc(openid)}/record`);
export const adminSaveRecord = (openid, record) => call('PATCH', `/administrator/players/${enc(openid)}/record`, { record });
export const adminEncryptRecordValue = (openid, type, value, key) => call('POST', `/administrator/players/${enc(openid)}/record/encrypt`, { type, ...(type === 'v1' ? { key } : {}), value });
export const adminDecryptRecordValue = (openid, type, value) => call('POST', `/administrator/players/${enc(openid)}/record/decrypt`, { type, value });
export const adminData = (name) => call('GET', `/administrator/data/${name}`);
export const adminSaveData = (name, value) => call('PATCH', `/administrator/data/${name}`, { [name]: value });
export const adminAddPlayerStar = (openid, star) => call('POST', `/administrator/players/${enc(openid)}/star`, { star });