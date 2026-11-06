import { imageUrl } from '@/features/avatar/manifest';

export function getItemSize(item, images) {
  const image = images?.get(imageUrl(item.src));
  return image ? { w: image.naturalWidth, h: image.naturalHeight } : null;
};

const degreesToRadians = (degrees) => (degrees * Math.PI) / 180;

export function convertLocalPointToWorld(item, localPoint) {
  const radians = degreesToRadians(item.rotation);
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const scaledX = localPoint.x * item.scale;
  const scaledY = localPoint.y * item.scale;
  return { x: item.x + scaledX * cosine - scaledY * sine, y: item.y + scaledX * sine + scaledY * cosine };
};

export function convertWorldPointToLocal(item, worldPoint) {
  const radians = degreesToRadians(-item.rotation);
  const cosine = Math.cos(radians);
  const sine = Math.sin(radians);
  const deltaX = worldPoint.x - item.x;
  const deltaY = worldPoint.y - item.y;
  return { x: (deltaX * cosine - deltaY * sine) / item.scale, y: (deltaX * sine + deltaY * cosine) / item.scale };
};

export function hitTest(items, worldPoint, images) {
  for (let itemIndex = items.length - 1; itemIndex >= 0; itemIndex--) {
    const item = items[itemIndex];
    const itemSize = getItemSize(item, images);
    if (!itemSize) continue;
    const localPoint = convertWorldPointToLocal(item, worldPoint);
    if (Math.abs(localPoint.x) <= itemSize.w / 2 && Math.abs(localPoint.y) <= itemSize.h / 2) return item;
  };
  return null;
};

export function getCloseButtonPosition(item, images) {
  const itemSize = getItemSize(item, images);
  return itemSize ? convertLocalPointToWorld(item, { x: itemSize.w / 2, y: -itemSize.h / 2 }) : null;
};

export const CLOSE_RADIUS = 13;
export function doesPointHitCloseButton(item, worldPoint, userInterfaceScale, images) {
  const closeButtonPosition = getCloseButtonPosition(item, images);
  return !!closeButtonPosition
    && Math.hypot(worldPoint.x - closeButtonPosition.x, worldPoint.y - closeButtonPosition.y) <= (CLOSE_RADIUS + 8) * userInterfaceScale;
};