export const ROLE_SLUGS = ['adao',  'ahua',  'duoduo',  'goutui',  'guazi',  'gumi',  'haidewei',  'jidan',  'jiji',  'miaoxiaochu',  'pidan',  'tuding',  'wangcai',  'xiaoju',  'xiaowang',  'mijiu',  'ayan',  'pingping',  'pupu',  'xiaofei',  'ahei'];
export const BACKGROUND_COUNT = 25;
export const FACES_PER_ROLE = 5;
export const ACCESSORY_A_COUNT = 25;
export const ACCESSORY_B_COUNT = 22;

const pad = (n) => String(n).padStart(2, '0');
const seq = (count, make) => Array.from({ length: count }, (_, i) => make(i + 1));

export const BACKGROUNDS = seq(BACKGROUND_COUNT, (n) => `backgrounds/background-${pad(n)}`);
export const ROLES = ROLE_SLUGS.map((slug) => `roles/${slug}`);
export const FACES = ROLE_SLUGS.map((slug) => seq(FACES_PER_ROLE, (n) => `faces/${slug}-${n}`));
export const ACCESSORIES_A = seq(ACCESSORY_A_COUNT, (n) => `accessories/a-${pad(n)}`);
export const ACCESSORIES_B = seq(ACCESSORY_B_COUNT, (n) => `accessories/b-${pad(n)}`);
export const ACCESSORIES = [...ACCESSORIES_A, ...ACCESSORIES_B];

const BASE = `${import.meta.env.BASE_URL}images/avatars/`;

export const imageUrl = (id) => `${BASE}${id}.png`;
export const thumbnailUrl = (id) => `${BASE}thumbnails/${id}.png`;

const cap = (s) => s[0].toUpperCase() + s.slice(1);

export function labelOf(id) {
  const [kind, name] = id.split('/');
  if (kind === 'roles') return cap(name);
  if (kind === 'backgrounds') return `Nền ${Number(name.split('-')[1])}`;
  if (kind === 'faces') {
    const [slug, n] = name.split('-');
    return `${cap(slug)} · biểu cảm ${n}`;
  };
  return `Phụ kiện ${name[0].toUpperCase()}${Number(name.slice(2))}`;
};

export const roleSlug = (roleIndex) => ROLE_SLUGS[roleIndex];