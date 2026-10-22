const imageCache = new Map();

const attempt = (url, cors) => new Promise((resolve, reject) => {
  const img = new Image();
  if (cors) img.crossOrigin = 'anonymous';
  img.onload = () => resolve(img);
  img.onerror = reject;
  img.src = url;
});

export function loadImage(url) {
  let entry = imageCache.get(url);
  if (!entry) {
    entry = { img: null };
    entry.promise = attempt(url, true)
      .catch(() => attempt(url, false))
      .then((img) => (entry.img = img))
      .catch((e) => {
        imageCache.delete(url);
        throw e;
      });
    imageCache.set(url, entry);
  };
  return entry.promise;
};

export const getCachedImage = (url) => imageCache.get(url)?.img ?? null;
export const preloadImages = (urls) => Promise.allSettled(urls.map(loadImage));
export const areAllImagesLoaded = (urls) => urls.every((u) => getCachedImage(u));