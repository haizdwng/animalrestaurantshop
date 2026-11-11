const ACCEPTED_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_BYTES = 8 * 1024 * 1024;
const OUTPUT_SIZE = 960;

export async function prepareAvatarPhoto(file) {
  if (!file || !ACCEPTED_TYPES.has(file.type)) throw new Error('Chỉ hỗ trợ ảnh JPG, PNG hoặc WebP');
  if (file.size > MAX_FILE_BYTES) throw new Error('Ảnh tải lên tối đa 8 MB');

  const url = URL.createObjectURL(file);
  try {
    const image = await new Promise((resolve, reject) => {
      const candidate = new Image();
      candidate.onload = () => resolve(candidate);
      candidate.onerror = () => reject(new Error('Không đọc được ảnh đã chọn'));
      candidate.src = url;
    });
    if (!image.naturalWidth || !image.naturalHeight) throw new Error('Ảnh không hợp lệ');

    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = OUTPUT_SIZE;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('Trình duyệt không hỗ trợ xử lý ảnh');

    const crop = Math.min(image.naturalWidth, image.naturalHeight);
    const left = (image.naturalWidth - crop) / 2;
    const top = (image.naturalHeight - crop) / 2;
    context.imageSmoothingEnabled = true;
    context.imageSmoothingQuality = 'high';
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    context.drawImage(image, left, top, crop, crop, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    return canvas.toDataURL('image/jpeg', 0.85);
  } finally {
    URL.revokeObjectURL(url);
  };
};

export const isAvatarPhoto = (value) => typeof value === 'string' && value.length < 3_000_000 && /^data:image\/(?:jpeg|png|webp);base64,[A-Za-z0-9+/=]+$/i.test(value);