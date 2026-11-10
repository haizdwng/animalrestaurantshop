export async function compressJsonGZip(value) {
  const encoded = new TextEncoder().encode(JSON.stringify(value));
  const stream = new CompressionStream('gzip');
  const output = new Blob([encoded]).stream().pipeThrough(stream);
  return new Uint8Array(await new Response(output).arrayBuffer())
};