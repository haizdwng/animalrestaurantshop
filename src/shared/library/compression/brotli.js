export async function compressJsonBrotli(value) {
  const input = new TextEncoder().encode(JSON.stringify(value));
  const { default: brotliPromise } = await import('brotli-wasm');
  const brotli = await brotliPromise;
  return brotli.compress(input, { quality: 4 });
};