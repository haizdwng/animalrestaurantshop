import { API_BASE_URL, REQUEST_TIMEOUT } from '@/shared/configuration/environment';

const TOKEN_KEY = 'token';

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (t) => localStorage.setItem(TOKEN_KEY, t);
export const hasToken = () => !!localStorage.getItem(TOKEN_KEY);
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, data = {}) {
    super(message);
    this.name = 'ApiError';
    Object.assign(this, data);
  };
};

let onUnauthorized = () => {};
export const setUnauthorizedHandler = (fn) => (onUnauthorized = fn);

async function http(method, path, body) {
  const isForm = body instanceof FormData;
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    const res = await fetch(API_BASE_URL + path, {
      method,
      headers: { ...(!isForm && body !== undefined && { 'Content-Type': 'application/json' }), ...(token && { token }) },
      body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
      signal: controller.signal
    });
    if (res.status === 204) return { success: true };
    let data;
    try {
      data = await res.json();
    } catch {
      data = { success: false, message: `Máy chủ phản hồi không hợp lệ (${res.status})` };
    };
    if (!data || typeof data !== 'object') {
      data = { success: false, message: `Máy chủ phản hồi không hợp lệ (${res.status})` };
    };
    data.status = res.status;
    if (res.status === 401) data = { ...data, success: false, code: 'UNAUTHORIZED' };
    return data;
  } catch (error) {
    return {
      success: false,
      code: error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK',
      message: error?.name === 'AbortError'
        ? 'Máy chủ phản hồi quá lâu — hãy thử lại'
        : 'Không kết nối được máy chủ — có thể máy chủ chưa cho phép tên miền này (CORS)'
    };
  } finally {
    clearTimeout(timeout);
  };
};

export async function call(method, path, body, { auth = true } = {}) {
  const r = await http(method, path, body);
  if (!r || r.success !== true) {
    if (r && !r.code && /xác thực|đăng nhập lại|unauthori|token/i.test(r.message || '')) r.code = 'UNAUTHORIZED';
    const err = new ApiError(r?.message || 'Đã có lỗi xảy ra', r || {});
    if (auth && err.code === 'UNAUTHORIZED') {
      clearToken();
      onUnauthorized(err);
    };
    throw err;
  };
  if (r.token) setToken(r.token);
  return r;
};

export const enc = encodeURIComponent;