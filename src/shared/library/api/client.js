import { API_BASE_URL, REQUEST_TIMEOUT } from '@/shared/configuration/environment';

const TOKEN_KEY = 'token';
const UNAUTHORIZED = 'UNAUTHORIZED';

let activeRequests = 0;
let activeCoinRequests = 0;
let requestQueue = Promise.resolve();
let onUnauthorized = () => {};
let unauthorizedNotified = false;
const requestListeners = new Set();

function notifyRequestListeners() {
  for (const listener of requestListeners) listener();
};

export function subscribeToRequests(listener) {
  requestListeners.add(listener);
  return () => requestListeners.delete(listener);
};

export const getPendingRequestCount = () => activeRequests;
export const getPendingCoinRequestCount = () => activeCoinRequests;

function trackRequest(coin) {
  activeRequests += 1;
  if (coin) activeCoinRequests += 1;
  notifyRequestListeners();

  let finished = false;
  return () => {
    if (finished) return;
    finished = true;
    activeRequests -= 1;
    if (coin) activeCoinRequests -= 1;
    notifyRequestListeners();
  };
};

function enqueueRequest(task, { track = true, coin = false } = {}) {
  const finish = track ? trackRequest(coin) : () => {};
  const operation = requestQueue.then(task);
  requestQueue = operation.catch(() => {});
  return operation.finally(finish);
};

export const getToken = () => localStorage.getItem(TOKEN_KEY) || '';
export const setToken = (token) => {
  localStorage.setItem(TOKEN_KEY, token);
  unauthorizedNotified = false;
};
export const hasToken = () => Boolean(getToken());
export const clearToken = () => localStorage.removeItem(TOKEN_KEY);

export class ApiError extends Error {
  constructor(message, details = {}) {
    super(message);
    this.name = 'ApiError';
    Object.assign(this, details);
  };
};

export const setUnauthorizedHandler = (handler) => { onUnauthorized = handler; };

function makeApiError(payload, httpStatus, auth) {
  const data = payload && typeof payload === 'object' ? payload : {};
  const unauthorized = httpStatus === 401 || data.code === UNAUTHORIZED;
  const code = unauthorized ? UNAUTHORIZED : data.code || 'API_ERROR';
  const error = new ApiError(data.message || `Yêu cầu thất bại (${httpStatus})`, {
    ...data,
    code,
    status: httpStatus
  });

  if (auth && unauthorized) {
    clearToken();
    if (!unauthorizedNotified) {
      unauthorizedNotified = true;
      onUnauthorized(error);
    };
  };
  return error;
};

function networkError(error) {
  if (error instanceof ApiError) return error;
  if (error?.name === 'AbortError') return new ApiError('Máy chủ phản hồi quá lâu — hãy thử lại', { code: 'TIMEOUT' });
  return new ApiError('Không kết nối được máy chủ — hãy kiểm tra kết nối mạng', { code: 'NETWORK' });
};

async function readJson(response, auth) {
  if (response.status === 204) return { success: true };

  let data;
  try {
    data = await response.json();
  } catch {
    throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ phản hồi không hợp lệ' }, response.status, auth);
  };

  if (!data || typeof data !== 'object' || Array.isArray(data)) throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ phản hồi không hợp lệ' }, response.status, auth);
  if (!response.ok || data.success !== true) throw makeApiError(data, response.status, auth);
  if (data.token) setToken(data.token);
  return data;
};

async function readStream(response, onProgress, auth) {
  if (response.status === 204) return { success: true };

  if (!response.ok) {
    let data;
    try {
      data = await response.json();
    } catch {
      data = { code: 'HTTP_ERROR', message: `Máy chủ xử lý yêu cầu thất bại (${response.status})` };
    };
    throw makeApiError(data, response.status, auth);
  };
  if (!response.body) throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ không hỗ trợ truyền dữ liệu streaming' }, response.status, auth);

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = '';
  let result = null;

  function processLine(line) {
    if (!line.trim()) return;
    let event;
    try {
      event = JSON.parse(line);
    } catch {
      throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ trả về dữ liệu streaming không hợp lệ' }, response.status, auth);
    };
    if (!event || typeof event !== 'object') throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ trả về dữ liệu streaming không hợp lệ' }, response.status, auth);
    switch (event.type) {
      case 'progress':
        onProgress?.(event.progress, event.message, event);
        break;
      case 'error':
        throw makeApiError(event, response.status, auth);
      case 'success':
        result = { ...event, success: true };
        break;
      default:
        break;
    };
  };

  try {
    while (true) {
      const { done, value } = await reader.read();
      buffer += decoder.decode(value || new Uint8Array(), { stream: !done });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';
      for (const line of lines) processLine(line);
      if (done) break;
    };
    if (buffer.trim()) processLine(buffer);
    if (!result) throw makeApiError({ code: 'INVALID_RESPONSE', message: 'Máy chủ kết thúc xử lý mà không trả kết quả' }, response.status, auth);
    if (result.token) setToken(result.token);
    return result;
  } finally {
    reader.releaseLock();
  };
};

async function executeRequest(method, path, body, parser, { auth = true, track = true, coin = false, contentEncoding, timeout = REQUEST_TIMEOUT } = {}) {
  return enqueueRequest(async () => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), timeout);
    const isForm = body instanceof FormData;
    const isBinary = body instanceof Uint8Array;

    try {
      const token = getToken();
      const response = await fetch(API_BASE_URL + path, {
        method,
        cache: 'no-store',
        headers: {
          ...(!isForm && body !== undefined && { 'Content-Type': 'application/json' }),
          ...(contentEncoding && { 'Content-Encoding': contentEncoding }),
          ...(token && { token })
        },
        body: body === undefined ? undefined : isForm || isBinary ? body : JSON.stringify(body),
        signal: controller.signal
      });
      return await parser(response, auth);
    } catch (error) {
      throw networkError(error);
    } finally {
      clearTimeout(timer);
    };
  }, { track, coin });
};

export function call(method, path, body, options = {}) {
  return executeRequest(method, path, body, readJson, options);
};

export function callStream(method, path, body, onProgress, options = {}) {
  return executeRequest(method, path, body, (response, auth) => readStream(response, onProgress, auth), options);
};

export const enc = encodeURIComponent;