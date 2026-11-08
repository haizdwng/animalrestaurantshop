import { compareByTime } from '@/shared/library/format';

export const TX_SORTS = [
  ['created-desc', 'Ngày tạo · mới nhất', compareByTime('createdAt', -1)],
  ['created-asc', 'Ngày tạo · cũ nhất', compareByTime('createdAt', 1)],
  ['updated-desc', 'Ngày cập nhật · mới nhất', compareByTime('updatedAt', -1)],
  ['updated-asc', 'Ngày cập nhật · cũ nhất', compareByTime('updatedAt', 1)],
  ['amount-desc', 'Số tiền · lớn nhất', (a, b) => Number(b.amount || 0) - Number(a.amount || 0)],
  ['amount-asc', 'Số tiền · nhỏ nhất', (a, b) => Number(a.amount || 0) - Number(b.amount || 0)]
];
export const TX_PAGE_SIZE = 10;