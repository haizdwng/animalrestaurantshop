const DEFAULT_DESTINATION = '/shop';
const AUTHENTICATION_PATH = /^\/(?:login|register|forgot)(?:\/|$)/i;

export function getSafeDestination(destination) {
  if (typeof destination !== 'string' || !destination.startsWith('/') || destination.startsWith('//')) return DEFAULT_DESTINATION;
  if (destination.includes('\\') || /[\u0000-\u001f\u007f]/.test(destination)) return DEFAULT_DESTINATION;
  if (AUTHENTICATION_PATH.test(destination.split(/[?#]/, 1)[0])) return DEFAULT_DESTINATION;
  return destination;
};

export function getRequestedDestination(search) {
  const parameters = new URLSearchParams(search);
  return getSafeDestination(parameters.get('next') || parameters.get('redirect'));
};

export function getLoginDestination(location) {
  const destination = location.pathname === '/' ? getRequestedDestination(location.search) : getSafeDestination(`${location.pathname}${location.search}${location.hash}`);
  return `/login?next=${encodeURIComponent(destination)}`;
};