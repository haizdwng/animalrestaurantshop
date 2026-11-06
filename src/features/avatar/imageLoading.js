const attempt = (url, cors) => new Promise((resolve, reject) => {
  const image = new Image();
  if (cors) image.crossOrigin = 'anonymous';
  image.onload = () => resolve(image);
  image.onerror = reject;
  image.src = url;
});

export function loadImage(url) {
  return attempt(url, true).catch(() => attempt(url, false));
};

export async function preloadImages(urls) {
  const uniqueUrls = [...new Set(urls)];
  const results = await Promise.allSettled(uniqueUrls.map(async (url) => [url, await loadImage(url)]));
  return new Map(results.filter((result) => result.status === 'fulfilled').map((result) => result.value));
};

export const areAllImagesLoaded = (urls, images) => urls.every((url) => images?.has(url));