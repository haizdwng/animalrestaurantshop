const DEFAULT_API_BASE_URL = import.meta.env.DEV
  ? 'http://localhost:3000/api'
  : 'https://animalrestauranttools.vercel.app/api';
const DEFAULT_REQUEST_TIMEOUT = 300000;

const configuredTimeout = Number(import.meta.env.VITE_API_TIMEOUT_MS);

export const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL || DEFAULT_API_BASE_URL).replace(/\/+$/, '');
export const REQUEST_TIMEOUT = Number.isFinite(configuredTimeout) && configuredTimeout > 0
  ? configuredTimeout
  : DEFAULT_REQUEST_TIMEOUT;