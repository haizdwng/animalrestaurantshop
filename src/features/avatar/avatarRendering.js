import { BACKGROUNDS, FACES, ROLES, imageUrl } from '@/features/avatar/manifest';
import { EXPORT_SIZE, STAGE } from '@/features/avatar/config';
import { CLOSE_RADIUS, getCloseButtonPosition, getItemSize } from '@/features/avatar/geometry';
import { areAllImagesLoaded, getCachedImage, preloadImages } from '@/features/avatar/imageLoading';

export const getAvatarLayerIdentifiers = (avatarDocument) => [
  BACKGROUNDS[avatarDocument.background],
  ROLES[avatarDocument.role],
  FACES[avatarDocument.role][avatarDocument.emoji]
];
export const getAvatarDocumentImageUrls = (avatarDocument) => [
  ...getAvatarLayerIdentifiers(avatarDocument),
  ...avatarDocument.items.map((item) => item.src)
].map(imageUrl);

let cachedBaseLayer = { key: '', canvas: null };
function drawBaseLayer(avatarDocument, pixelSize) {
  const cacheKey = `${avatarDocument.background}|${avatarDocument.role}|${avatarDocument.emoji}|${pixelSize}`;
  if (cachedBaseLayer.key === cacheKey) return cachedBaseLayer.canvas;
  const baseImages = getAvatarLayerIdentifiers(avatarDocument).map((imageIdentifier) => getCachedImage(imageUrl(imageIdentifier)));
  if (baseImages.some((image) => !image)) return null;
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = pixelSize;
  const canvasContext = canvas.getContext('2d');
  canvasContext.imageSmoothingQuality = 'high';
  baseImages.forEach((image) => canvasContext.drawImage(image, 0, 0, pixelSize, pixelSize));
  cachedBaseLayer = { key: cacheKey, canvas };
  return canvas;
};

function drawSelection(canvasContext, selectedItem, userInterfaceScale) {
  const itemSize = getItemSize(selectedItem);
  if (!itemSize) return;
  canvasContext.save();
  canvasContext.translate(selectedItem.x, selectedItem.y);
  canvasContext.rotate((selectedItem.rotation * Math.PI) / 180);
  canvasContext.scale(selectedItem.scale, selectedItem.scale);
  canvasContext.lineWidth = (2 * userInterfaceScale) / selectedItem.scale;
  canvasContext.strokeStyle = '#d4ff3a';
  canvasContext.setLineDash([(8 * userInterfaceScale) / selectedItem.scale]);
  canvasContext.strokeRect(-itemSize.w / 2, -itemSize.h / 2, itemSize.w, itemSize.h);
  canvasContext.restore();

  const getCloseButtonPositionition = getCloseButtonPosition(selectedItem);
  const closeButtonRadius = CLOSE_RADIUS * userInterfaceScale;
  const closeLineOffset = closeButtonRadius * 0.4;
  canvasContext.fillStyle = '#ff5d47';
  canvasContext.beginPath();
  canvasContext.arc(getCloseButtonPositionition.x, getCloseButtonPositionition.y, closeButtonRadius, 0, Math.PI * 2);
  canvasContext.fill();
  canvasContext.strokeStyle = '#0c0d0f';
  canvasContext.lineWidth = 2 * userInterfaceScale;
  canvasContext.setLineDash([]);
  canvasContext.beginPath();
  canvasContext.moveTo(getCloseButtonPositionition.x - closeLineOffset, getCloseButtonPositionition.y - closeLineOffset);
  canvasContext.lineTo(getCloseButtonPositionition.x + closeLineOffset, getCloseButtonPositionition.y + closeLineOffset);
  canvasContext.moveTo(getCloseButtonPositionition.x + closeLineOffset, getCloseButtonPositionition.y - closeLineOffset);
  canvasContext.lineTo(getCloseButtonPositionition.x - closeLineOffset, getCloseButtonPositionition.y + closeLineOffset);
  canvasContext.stroke();
};

export function drawAvatar(canvasContext, avatarDocument, { selectedId = null, userInterfaceScale = 1 } = {}) {
  const pixelSize = canvasContext.canvas.width;
  canvasContext.setTransform(1, 0, 0, 1, 0, 0);
  canvasContext.clearRect(0, 0, pixelSize, pixelSize);
  const mergedBaseLayer = drawBaseLayer(avatarDocument, pixelSize);
  if (mergedBaseLayer) canvasContext.drawImage(mergedBaseLayer, 0, 0);
  else getAvatarLayerIdentifiers(avatarDocument).forEach((imageIdentifier) => {
    const image = getCachedImage(imageUrl(imageIdentifier));
    if (image) canvasContext.drawImage(image, 0, 0, pixelSize, pixelSize);
  });

  canvasContext.setTransform(pixelSize / STAGE, 0, 0, pixelSize / STAGE, 0, 0);
  canvasContext.imageSmoothingQuality = 'high';
  for (const item of avatarDocument.items) {
    const image = getCachedImage(imageUrl(item.src));
    if (!image) continue;
    canvasContext.save();
    canvasContext.translate(item.x, item.y);
    canvasContext.rotate((item.rotation * Math.PI) / 180);
    canvasContext.scale(item.scale, item.scale);
    canvasContext.drawImage(image, -image.naturalWidth / 2, -image.naturalHeight / 2);
    canvasContext.restore();
  };
  const selectedItem = avatarDocument.items.find((item) => item.id === selectedId);
  if (selectedItem) drawSelection(canvasContext, selectedItem, userInterfaceScale);
};

export async function renderAvatarToBlob(avatarDocument, exportSize = EXPORT_SIZE) {
  const imageUrls = getAvatarDocumentImageUrls(avatarDocument);
  if (!areAllImagesLoaded(imageUrls)) await preloadImages(imageUrls);
  const canvas = document.createElement('canvas');
  canvas.width = canvas.height = exportSize;
  const canvasContext = canvas.getContext('2d');
  canvasContext.fillStyle = '#fff';
  canvasContext.fillRect(0, 0, exportSize, exportSize);
  const avatarLayerCanvas = document.createElement('canvas');
  avatarLayerCanvas.width = avatarLayerCanvas.height = exportSize;
  drawAvatar(avatarLayerCanvas.getContext('2d'), avatarDocument);
  canvasContext.drawImage(avatarLayerCanvas, 0, 0);
  return new Promise((resolve, reject) => {
    canvas.toBlob((imageBlob) => (imageBlob ? resolve(imageBlob) : reject(new Error('Không tạo được ảnh'))), 'image/png');
  });
};