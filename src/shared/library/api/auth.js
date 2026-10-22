import { ApiError, call, clearToken, setToken } from '@/shared/library/api/client';
import { pickUser } from '@/shared/library/api/normalize';

export const getMe = async () => {
  const r = await call('GET', '/user', undefined, { auth: false });
  if (!r.user && !r.username) throw new ApiError(r.message || 'Không lấy được thông tin tài khoản');
  return { ...r, user: pickUser(r) };
};

export async function withUser(r) {
  const user = pickUser(r);
  if (user) return { ...r, user };
  try {
    return { ...r, user: (await getMe()).user };
  } catch {
    return r;
  };
};

export async function login(username, password) {
  const r = await call('POST', '/login', { username, password }, { auth: false });
  if (!r.token) throw new ApiError(r.message || 'Máy chủ không trả về token đăng nhập');
  setToken(r.token);
  const me = await getMe();
  if (!me.user) throw new ApiError('Không lấy được thông tin tài khoản');
  return { ...r, user: me.user };
};
export const signupOtp = (data) => call('POST', '/signup/otp', data, { auth: false });
export const signup = async (data) => withUser(await call('POST', '/signup', data, { auth: false }));
export const passwordOtp = (data) => call('POST', '/password/otp', data, { auth: false });
export const resetPassword = (data) => call('POST', '/password', data, { auth: false });
export const logout = () => clearToken();