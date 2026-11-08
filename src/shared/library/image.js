import { ApiError } from '@/shared/library/api/client';

export function fileToAvatar(file) {
  if (!file?.type?.startsWith('image/')) throw new ApiError('Hãy chọn file ảnh');
  if (file.size > 8 * 1024 * 1024) throw new ApiError('Ảnh tối đa 8MB');
  return file;
};