import { IconCat, IconCrown, IconMoodSmile, IconPhoto, IconSparkles } from '@tabler/icons-react';
import { ACCESSORIES_A, ACCESSORIES_B, BACKGROUNDS, FACES, ROLES } from '@/features/avatar/manifest';

export const STAGE = 740;
export const EXPORT_SIZE = 512;
export const MAX_ITEMS = 5;
export const SCALE = { min: 0.4, max: 2, step: 0.1 };
export const ROTATE_STEP = 15;
export const HISTORY_LIMIT = 50;
export const DRAFT_KEY = 'avatar';
export const PIXEL_RATIO = Math.min(2, window.devicePixelRatio || 1);

export const TABS = [
  { key: 'role', label: 'Nhân vật', Icon: IconCat, hint: 'Chọn nhân vật', ids: () => ROLES },
  { key: 'emoji', label: 'Biểu cảm', Icon: IconMoodSmile, hint: 'Chọn biểu cảm của nhân vật', ids: (role) => FACES[role] },
  { key: 'itemA', label: 'Phụ kiện A', Icon: IconCrown, ids: () => ACCESSORIES_A },
  { key: 'itemB', label: 'Phụ kiện B', Icon: IconSparkles, ids: () => ACCESSORIES_B },
  { key: 'background', label: 'Nền', Icon: IconPhoto, hint: 'Chọn ảnh nền', ids: () => BACKGROUNDS }
];

export const isItemTab = (key) => key === 'itemA' || key === 'itemB';