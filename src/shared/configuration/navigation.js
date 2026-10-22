import { IconBuildingStore, IconPalette, IconSettings, IconUserCircle } from '@tabler/icons-react';

export const NAV = [
  ['shop', 'Cửa hàng', IconBuildingStore],
  ['avatar', 'Ảnh đại diện', IconPalette],
  ['user', 'Tài khoản', IconUserCircle]
];
export const ADMIN_NAV = [
  ['administrator', 'Quản trị viên', IconSettings]
];
export const DEFAULT_TAB = 'shop';
export const TAB_KEYS = [...NAV, ...ADMIN_NAV].map((n) => n[0]);
export const getNavigationItemsForRole = (admin) => (admin ? [NAV[0], NAV[1], ...ADMIN_NAV, NAV[2]] : NAV);