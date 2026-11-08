import { API_BASE_URL, REQUEST_TIMEOUT } from '@/shared/configuration/environment';

const TOKEN_KEY = 'token';
let activeRequests = 0;
let activeCoinRequests = 0;
const requestListeners = new Set();
const coinRequestListeners = new Set();
let requestQueue = Promise.resolve();

function enqueueRequest(fn) {
  const run = requestQueue.then(() => fn());
  requestQueue = run.catch(() => {});
  return run;
};

function notifyRequestListeners() {
  requestListeners.forEach((listener) => listener());
};

export const subscribeToRequests = (listener) => {
  requestListeners.add(listener);
  return () => requestListeners.delete(listener);
};

export const getPendingRequestCount = () => activeRequests;
export const subscribeToCoinRequests = (listener) => {
  coinRequestListeners.add(listener);
  return () => coinRequestListeners.delete(listener);
};

export const getPendingCoinRequestCount = () => activeCoinRequests;

function trackRequest(coin = false) {
  activeRequests += 1;
  notifyRequestListeners();
  if (coin) {
    activeCoinRequests += 1;
    coinRequestListeners.forEach((listener) => listener());
  };
  let finished = false;
  return () => {
    if (finished) return;
    finished = true;
    activeRequests = Math.max(0, activeRequests - 1);
    notifyRequestListeners();
    if (coin) {
      activeCoinRequests = Math.max(0, activeCoinRequests - 1);
      coinRequestListeners.forEach((listener) => listener());
    };
  };
};

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (token) => localStorage.setItem(TOKEN_KEY, token);
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
export const setUnauthorizedHandler = (handler) => (onUnauthorized = handler);

async function http(method, path, body, { track = true, coin = false } = {}) {
  return enqueueRequest(async () => {
    const finishRequest = track ? trackRequest(coin) : () => {};
    const isForm = body instanceof FormData;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), REQUEST_TIMEOUT);

    try {
      const token = localStorage.getItem(TOKEN_KEY);
      const response = await fetch(API_BASE_URL + path, {
        method,
        cache: 'no-store',
        headers: {
          ...(!isForm && body !== undefined && { 'Content-Type': 'application/json' }),
          ...(token && { token })
        },
        body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
        signal: controller.signal
      });

      if (response.status === 204) return { success: true };
      let data;
      try {
        data = await response.json();
      } catch {
        data = { success: false, message: `Máy chủ phản hồi không hợp lệ (${response.status})` };
      };
      if (!data || typeof data !== 'object') data = { success: false, message: `Máy chủ phản hồi không hợp lệ (${response.status})` };
      data.status = response.status;
      if (response.status === 401) data = { ...data, success: false, code: 'UNAUTHORIZED' };
      return data;
    } catch (error) {
      return {
        success: false,
        code: error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK',
        message: error?.name === 'AbortError' ? 'Máy chủ phản hồi quá lâu — hãy thử lại' : 'Không kết nối được máy chủ — có thể máy chủ chưa cho phép tên miền này (CORS)'
      };
    } finally {
      clearTimeout(timeout);
      finishRequest();
    };
  });
};

export async function call(method, path, body, { auth = true, track = true, coin = false } = {}) {
  const response = await http(method, path, body, { track, coin });
  if (!response || response.success !== true) {
    if (response && !response.code && /xác thực|đăng nhập lại|unauthori|token/i.test(response.message || '')) response.code = 'UNAUTHORIZED';
    const error = new ApiError(response?.message || 'Đã có lỗi xảy ra', response || {});
    if (auth && error.code === 'UNAUTHORIZED') {
      clearToken();
      onUnauthorized(error);
    };
    throw error;
  };
  if (response.token) setToken(response.token);
  return response;
};

export async function callStream(method, path, body, onProgress, { auth = true, timeout = REQUEST_TIMEOUT } = {}) {
  return enqueueRequest(async () => {
    const finishRequest = trackRequest();
    const isForm = body instanceof FormData;
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    let reader;

    const handleError = (data = {}) => {
      if (data.status === 401) data = { ...data, success: false, code: 'UNAUTHORIZED' };
      if (!data.code && /xác thực|đăng nhập lại|unauthori|token/i.test(data.message || '')) data.code = 'UNAUTHORIZED';
      const error = new ApiError(data.message || 'Đã có lỗi xảy ra', data);
      if (auth && error.code === 'UNAUTHORIZED') {
        clearToken();
        onUnauthorized(error);
      };
      return error;
    };

    try {
      const token = getToken();
      const response = await fetch(API_BASE_URL + path, {
        method,
        cache: 'no-store',
        headers: {
          ...(!isForm && body !== undefined && { 'Content-Type': 'application/json' }),
          ...(token && { token })
        },
        body: body === undefined ? undefined : isForm ? body : JSON.stringify(body),
        signal: controller.signal
      });

      if (response.status === 204) return { success: true, status: 204 };
      if (!response.body) throw handleError({ message: 'Máy chủ không hỗ trợ truyền dữ liệu streaming', status: response.status });

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      let result = null;
      const processLine = (line) => {
        if (!line.trim()) return;
        let data;
        try {
          data = JSON.parse(line);
        } catch {
          throw handleError({ message: 'Máy chủ trả về dữ liệu streaming không hợp lệ', status: response.status });
        };
        if (data.type === 'progress') {
          onProgress?.(data.progress, data.message, data);
          return;
        };
        if (data.type === 'error') throw handleError({ ...data, status: response.status });
        if (data.type === 'success') result = { ...data, success: true, status: response.status };
      };

      while (true) {
        const { done, value } = await reader.read();
        buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';
        for (const line of lines) processLine(line);
        if (done) break;
      };

      if (buffer.trim()) processLine(buffer);
      if (!response.ok) throw handleError({ message: 'Máy chủ xử lý yêu cầu thất bại', status: response.status });
      if (!result) throw handleError({ message: 'Máy chủ kết thúc xử lý mà không trả kết quả', status: response.status });
      return result;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error?.name === 'AbortError') throw new ApiError('Máy chủ phản hồi quá lâu — hãy thử lại', { code: 'TIMEOUT' });
      throw new ApiError('Không kết nối được máy chủ — hãy kiểm tra kết nối mạng', { code: 'NETWORK' });
    } finally {
      clearTimeout(timer);
      if (reader) reader.releaseLock();
      finishRequest();
    };
  });
};

export const enc = encodeURIComponent;