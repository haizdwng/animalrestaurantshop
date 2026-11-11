import { IconBuildingStore, IconSettings, IconUserCircle } from '@tabler/icons-react';

const DEFAULT_DESTINATION = '/shop';
const AUTHENTICATION_PATH = /^\/(?:login|register|forgot)(?:\/|$)/i;

export const NAV = [
  ['shop', 'Cửa hàng', IconBuildingStore],
  ['user', 'Tài khoản', IconUserCircle]
];
export const ADMIN_NAV = [
  ['administrator', 'Quản trị viên', IconSettings]
];
export const DEFAULT_TAB = 'shop';
export const TAB_KEYS = [...NAV, ...ADMIN_NAV].map((n) => n[0]);
export const getNavigationItemsForRole = (admin) => (admin ? [NAV[0], ...ADMIN_NAV, NAV[1]] : NAV);

const getSafeDestination = (destination) => {
  if (typeof destination !== 'string' || !destination.startsWith('/') || destination.startsWith('//')) return DEFAULT_DESTINATION;
  if (destination.includes('\\') || /[\u0000-\u001f\u007f]/.test(destination)) return DEFAULT_DESTINATION;
  if (AUTHENTICATION_PATH.test(destination.split(/[?#]/, 1)[0])) return DEFAULT_DESTINATION;
  return destination;
};

export const getRequestedDestination = (search) => {
  const parameters = new URLSearchParams(search);
  return getSafeDestination(parameters.get('next') || parameters.get('redirect'));
};

export const getLoginDestination = (location) => {
  const destination = location.pathname === '/' ? getRequestedDestination(location.search) : getSafeDestination(`${location.pathname}${location.search}${location.hash}`);
  return `/login?next=${encodeURIComponent(destination)}`;
};