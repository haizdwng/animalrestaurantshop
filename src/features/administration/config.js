import { IconDatabase, IconDeviceGamepad2, IconMessages, IconTicket, IconUsers } from '@tabler/icons-react';
import { IconBuildingStore, IconFileText, IconMusic, IconUser } from '@tabler/icons-react';
import { compareByTime } from '@/shared/library/format';

export const ADMIN_TABS = [
  ['giftcodes', 'Mã đổi thưởng', IconTicket],
  ['users', 'Người dùng', IconUsers],
  ['players', 'Người chơi', IconDeviceGamepad2],
  ['chat', 'Trò chuyện', IconMessages],
  ['data', 'Dữ liệu', IconDatabase]
];

export const GIFT_CODE_PAGE_SIZE = 10;
export const EMPTY_GIFT_CODE = { code: '', date: '', coin: '' };

export const USER_SORTS = [
  ['created-desc', 'Ngày tạo · mới nhất', compareByTime('createdAt', -1)],
  ['created-asc', 'Ngày tạo · cũ nhất', compareByTime('createdAt', 1)],
  ['updated-desc', 'Ngày sửa · mới nhất', compareByTime('updatedAt', -1)],
  ['updated-asc', 'Ngày sửa · cũ nhất', compareByTime('updatedAt', 1)],
  ['username-asc', 'Tên đăng nhập · A → Z', (a, b) => String(a.username).localeCompare(String(b.username))],
  ['username-desc', 'Tên đăng nhập · Z → A', (a, b) => String(b.username).localeCompare(String(a.username))],
  ['coin-desc', 'Xu · nhiều nhất', (a, b) => b.coin - a.coin],
  ['coin-asc', 'Xu · ít nhất', (a, b) => a.coin - b.coin]
];
export const USER_PAGE_SIZE = 10;
export const COIN_PRESETS = [100, 500, 1000, 5000];
export const EMPTY_USER_FORM = { openid: '', username: '', password: '', coin: '' };

export const PLAYER_TABS = [
  ['player', 'Người chơi', IconUser],
  ['friends', 'Bạn bè', IconUsers],
  ['record', 'Dữ liệu', IconDatabase]
];
export const PLAYER_PAGE_SIZE = 10;

export const DATA_TABS = [
  ['shop', 'Cửa hàng', IconBuildingStore],
  ['musicians', 'Khách mời', IconMusic],
  ['texts', 'Văn bản', IconFileText],
  ['data', 'Dữ liệu', IconDatabase]
];