import { access, mkdir, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACCESSORIES_A, ACCESSORIES_B, BACKGROUNDS, FACES, ROLES, ROLE_SLUGS } from '../src/features/avatar/manifest.js';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'https://restaurant-h5-web.dhgames.com/static/img/';
const CACHE = join(ROOT, '.cache', 'images', 'avatars');
const OUT = join(ROOT, 'public', 'images', 'avatars');
const FORCE = process.argv.includes('--force');
const THUMBNAIL_SIZE = 192;
const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true };
const CONCURRENCY = 6;
const RETRIES = 3;

const sources = JSON.parse(await readFile(join(ROOT, 'scripts/avatar.json'), 'utf8'));
const exists = (p) => access(p).then(() => true, () => false);
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const pendingSources = new Map();

const jobs = [];
const check = (name, got, want) => {
  if (got !== want) throw new Error(`${name}: manifest cần ${want} ảnh nhưng avatar.json có ${got}`);
};
check('backgrounds', sources.backgrounds.length, BACKGROUNDS.length);
check('accessoriesA', sources.accessoriesA.length, ACCESSORIES_A.length);
check('accessoriesB', sources.accessoriesB.length, ACCESSORIES_B.length);
BACKGROUNDS.forEach((id, i) => jobs.push({ id, file: sources.backgrounds[i] }));
ACCESSORIES_A.forEach((id, i) => jobs.push({ id, file: sources.accessoriesA[i] }));
ACCESSORIES_B.forEach((id, i) => jobs.push({ id, file: sources.accessoriesB[i] }));
ROLE_SLUGS.forEach((slug, r) => {
  const roleFile = sources.roles[slug];
  check(`faces/${slug}`, sources.faces[slug]?.length, FACES[r].length);
  jobs.push({ id: ROLES[r], file: roleFile, overlay: sources.faces[slug][0] });
  FACES[r].forEach((id, f) => jobs.push({ id, file: sources.faces[slug][f], under: roleFile }));
});

async function fetchSource(file) {
  const dest = join(CACHE, file);
  if (pendingSources.has(file)) return pendingSources.get(file);

  const pending = (async () => {
    if (await exists(dest)) {
      try {
        await sharp(dest).metadata();
        return dest;
      } catch {
        await unlink(dest).catch(() => {});
      }
    }

    for (let i = 1; ; i++) {
      const temp = `${dest}.${process.pid}.${Date.now()}.tmp`;
      try {
        const res = await fetch(SOURCE + file);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        await writeFile(temp, Buffer.from(await res.arrayBuffer()));
        await sharp(temp).metadata();
        await rename(temp, dest);
        return dest;
      } catch (e) {
        await unlink(temp).catch(() => {});
        if (i === RETRIES) throw new Error(`${file}: ${e.message}`);
        await sleep(500 * i);
      }
    }
  })();
  pendingSources.set(file, pending);
  try {
    return await pending;
  } finally {
    pendingSources.delete(file);
  }
};

async function composite(bottomPath, topPath) {
  const { width, height } = await sharp(bottomPath).metadata();
  const top = await sharp(topPath).resize(width, height, { fit: 'fill' }).png().toBuffer();
  return sharp(bottomPath).composite([{ input: top }]).png().toBuffer();
};

async function build({ id, file, under, overlay }) {
  const full = join(OUT, `${id}.png`);
  const thumbnail = join(OUT, 'thumbnails', `${id}.png`);
  if (!FORCE && (await exists(full)) && (await exists(thumbnail))) return 'skip';

  const [own, bottom, top] = await Promise.all([fetchSource(file), under && fetchSource(under), overlay && fetchSource(overlay)]);
  await mkdir(dirname(full), { recursive: true });
  await mkdir(dirname(thumbnail), { recursive: true });

  await sharp(own).png(PNG_OPTIONS).toFile(full);

  let input = own;
  if (bottom) input = await composite(bottom, own);
  else if (top) input = await composite(own, top);
  const isBackground = id.startsWith('backgrounds/');
  await sharp(input)
    .resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, { fit: isBackground ? 'cover' : 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
    .png(PNG_OPTIONS)
    .toFile(thumbnail);
  return 'ok';
};

await mkdir(CACHE, { recursive: true });
const stats = { ok: 0, skip: 0, fail: [] };
let next = 0;
const worker = async () => {
  while (next < jobs.length) {
    const job = jobs[next++];
    try {
      stats[await build(job)]++;
    } catch (e) {
      stats.fail.push(`${job.id} ← ${e.message}`);
    }
    process.stdout.write(`\r${stats.ok + stats.skip + stats.fail.length}/${jobs.length}`);
  }
};
await Promise.all(Array.from({ length: CONCURRENCY }, worker));

console.log(`\nMới: ${stats.ok} · Đã có: ${stats.skip} · Lỗi: ${stats.fail.length} → ${OUT}`);
if (stats.fail.length) {
  console.error('Lỗi:\n' + stats.fail.join('\n'));
  process.exit(1);
}