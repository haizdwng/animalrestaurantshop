import { ApiError, call, clearToken, setToken } from '@/shared/library/api/client';
import { pickUser } from '@/shared/library/api/normalize';

export const getMe = async () => {
  const response = await call('GET', '/user', undefined, { auth: false });
  if (!response.user && !response.username) throw new ApiError(response.message || 'Không lấy được thông tin tài khoản');
  return { ...response, user: pickUser(response) };
};

export async function withUser(response) {
  try {
    const { user } = await getMe();
    return { ...response, user };
  } catch {
    const { user: _partialUser, ...result } = response;
    return result;
  };
};

export async function login(username, password) {
  const response = await call('POST', '/login', { username, password }, { auth: false });
  if (!response.token) throw new ApiError(response.message || 'Máy chủ không trả về token đăng nhập');
  setToken(response.token);
  const { user } = await getMe();
  if (!user) throw new ApiError('Không lấy được thông tin tài khoản');
  return { ...response, user };
};
export const signupOtp = (data) => call('POST', '/signup/otp', data, { auth: false });
export const signup = async (data) => withUser(await call('POST', '/signup', data, { auth: false }));
export const passwordOtp = (data) => call('POST', '/password/otp', data, { auth: false });
export const resetPassword = (data) => call('POST', '/password', data, { auth: false });
export const logout = () => clearToken();