import { mkdir, readFile } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ACCESSORIES_A, ACCESSORIES_B, BACKGROUNDS, FACES, ROLES, ROLE_SLUGS } from '../src/features/avatar/manifest.js';
import sharp from 'sharp';

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..');
const SOURCE = 'https://restaurant-h5-web.dhgames.com/static/img/';
const OUTPUT = join(ROOT, 'public', 'images', 'avatars');
const THUMBNAIL_SIZE = 192;
const PNG_OPTIONS = { compressionLevel: 9, adaptiveFiltering: true };
const CONCURRENCY = 6;
const RETRIES = 3;

const sources = JSON.parse(await readFile(join(ROOT, 'scripts/avatar.json'), 'utf8'));
const sleep = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const jobs = [];
const check = (name, actual, expected) => {
  if (actual !== expected) throw new Error(`${name}: manifest cần ${expected} ảnh nhưng avatar.json có ${actual}`);
};

check('backgrounds', sources.backgrounds.length, BACKGROUNDS.length);
check('accessoriesA', sources.accessoriesA.length, ACCESSORIES_A.length);
check('accessoriesB', sources.accessoriesB.length, ACCESSORIES_B.length);
BACKGROUNDS.forEach((id, index) => jobs.push({ id, file: sources.backgrounds[index] }));
ACCESSORIES_A.forEach((id, index) => jobs.push({ id, file: sources.accessoriesA[index] }));
ACCESSORIES_B.forEach((id, index) => jobs.push({ id, file: sources.accessoriesB[index] }));
ROLE_SLUGS.forEach((slug, roleIndex) => {
  const roleFile = sources.roles[slug];
  check(`faces/${slug}`, sources.faces[slug]?.length, FACES[roleIndex].length);
  jobs.push({ id: ROLES[roleIndex], file: roleFile, overlay: sources.faces[slug][0] });
  FACES[roleIndex].forEach((id, faceIndex) => jobs.push({ id, file: sources.faces[slug][faceIndex], under: roleFile }));
});

async function fetchSource(file) {
  for (let attempt = 1; ; attempt++) {
    try {
      const response = await fetch(SOURCE + file, { cache: 'no-store' });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const imageBuffer = Buffer.from(await response.arrayBuffer());
      await sharp(imageBuffer).metadata();
      return imageBuffer;
    } catch (error) {
      if (attempt === RETRIES) throw new Error(`${file}: ${error.message}`);
      await sleep(500 * attempt);
    };
  };
};

async function composite(bottomImage, topImage) {
  const { width, height } = await sharp(bottomImage).metadata();
  const resizedTop = await sharp(topImage).resize(width, height, { fit: 'fill' }).png().toBuffer();
  return sharp(bottomImage).composite([{ input: resizedTop }]).png().toBuffer();
};

async function build({ id, file, under, overlay }) {
  const fullPath = join(OUTPUT, `${id}.png`);
  const thumbnailPath = join(OUTPUT, 'thumbnails', `${id}.png`);
  const [ownImage, bottomImage, topImage] = await Promise.all([
    fetchSource(file),
    under ? fetchSource(under) : null,
    overlay ? fetchSource(overlay) : null
  ]);

  await mkdir(dirname(fullPath), { recursive: true });
  await mkdir(dirname(thumbnailPath), { recursive: true });
  await sharp(ownImage).png(PNG_OPTIONS).toFile(fullPath);

  let thumbnailSource = ownImage;
  if (bottomImage) thumbnailSource = await composite(bottomImage, ownImage);
  else if (topImage) thumbnailSource = await composite(ownImage, topImage);
  const isBackground = id.startsWith('backgrounds/');

  await sharp(thumbnailSource).resize(THUMBNAIL_SIZE, THUMBNAIL_SIZE, {
    fit: isBackground ? 'cover' : 'contain',
    background: { r: 0, g: 0, b: 0, alpha: 0 }
  }).png(PNG_OPTIONS).toFile(thumbnailPath);
};

await mkdir(OUTPUT, { recursive: true });
const stats = { success: 0, failed: [] };
let nextJob = 0;

const worker = async () => {
  while (nextJob < jobs.length) {
    const job = jobs[nextJob++];
    try {
      await build(job);
      stats.success += 1;
    } catch (error) {
      stats.failed.push(`${job.id} ← ${error.message}`);
    };
    process.stdout.write(`\r${stats.success + stats.failed.length}/${jobs.length}`);
  };
};

await Promise.all(Array.from({ length: CONCURRENCY }, worker));
console.log(`\nĐã tạo: ${stats.success} · Lỗi: ${stats.failed.length} → ${OUTPUT}`);
if (stats.failed.length) {
  console.error('Lỗi:\n' + stats.failed.join('\n'));
  process.exit(1);
};