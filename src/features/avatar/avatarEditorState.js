import { ACCESSORIES, BACKGROUNDS, FACES, ROLES } from '@/features/avatar/manifest';
import { HISTORY_LIMIT, MAX_ITEMS, SCALE, STAGE } from '@/features/avatar/config';

export const INITIAL_DOC = { background: 0, role: 0, emoji: 0, items: [] };
export const initialState = (doc = INITIAL_DOC) => ({ doc, past: [], future: [], selectedId: null });

const KNOWN = new Set(ACCESSORIES);
const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v));
const inRange = (i, n) => Number.isInteger(i) && i >= 0 && i < n;
const num = (v, fallback) => (Number.isFinite(v) ? v : fallback);
const pick = (n) => Math.floor(Math.random() * n);

let seq = 0;
const newId = () => `i${Date.now().toString(36)}${seq++}`;

const fixItem = (it) => ({
  id: newId(),
  src: it.src,
  x: clamp(num(it.x, STAGE / 2), 0, STAGE),
  y: clamp(num(it.y, STAGE / 2), 0, STAGE),
  scale: clamp(num(it.scale, 1), SCALE.min, SCALE.max),
  rotation: ((num(it.rotation, 0) % 360) + 360) % 360
});

export function sanitizeDoc(raw) {
  if (!raw || typeof raw !== 'object') return INITIAL_DOC;
  const background = inRange(raw.background, BACKGROUNDS.length) ? raw.background : 0;
  const role = inRange(raw.role, ROLES.length) ? raw.role : 0;
  const emoji = inRange(raw.emoji, FACES[role].length) ? raw.emoji : 0;
  const items = (Array.isArray(raw.items) ? raw.items : []).filter((it) => it && KNOWN.has(it.src)).slice(0, MAX_ITEMS).map(fixItem);
  return { background, role, emoji, items };
};

const push = (list, doc) => [...list, doc].slice(-HISTORY_LIMIT);
const commit = (s, doc, extra = {}) => ({ ...s, ...extra, doc, past: push(s.past, s.doc), future: [] });
const keepSelection = (doc, id) => (doc.items.some((i) => i.id === id) ? id : null);
const mapItem = (doc, id, fn) => ({ ...doc, items: doc.items.map((it) => (it.id === id ? { ...fixItem(fn(it)), id } : it)) });

export function reducer(s, a) {
  const { doc } = s;
  switch (a.type) {
    case 'background':
      return a.index === doc.background ? s : commit(s, { ...doc, background: a.index });
    case 'role':
      return a.index === doc.role ? s : commit(s, { ...doc, role: a.index, emoji: 0 });
    case 'emoji':
      return a.index === doc.emoji ? s : commit(s, { ...doc, emoji: a.index });
    case 'toggle': {
      const existing = doc.items.find((i) => i.src === a.src);
      if (existing) return commit(s, { ...doc, items: doc.items.filter((i) => i !== existing) }, { selectedId: s.selectedId === existing.id ? null : s.selectedId });
      if (doc.items.length >= MAX_ITEMS) return s;
      const offset = doc.items.length * 24;
      const item = { ...fixItem({ src: a.src, x: STAGE / 2 + offset, y: STAGE / 2 + offset }) };
      return commit(s, { ...doc, items: [...doc.items, item] }, { selectedId: item.id });
    };
    case 'remove':
      return commit(s, { ...doc, items: doc.items.filter((i) => i.id !== a.id) }, { selectedId: s.selectedId === a.id ? null : s.selectedId });
    case 'select': {
      if (a.id === s.selectedId) return s;
      const item = doc.items.find((i) => i.id === a.id);
      if (!item) return { ...s, selectedId: null };
      return { ...s, selectedId: a.id, doc: { ...doc, items: [...doc.items.filter((i) => i !== item), item] } };
    };
    case 'checkpoint':
      return { ...s, past: push(s.past, doc), future: [] };
    case 'patch':
      return { ...s, doc: mapItem(doc, a.id, (it) => ({ ...it, ...a.patch })) };
    case 'adjust':
      return commit(s, mapItem(doc, a.id, (it) => ({ ...it, scale: it.scale + (a.dScale || 0), rotation: it.rotation + (a.dRotation || 0) })));
    case 'undo': {
      if (!s.past.length) return s;
      const prev = s.past[s.past.length - 1];
      return { ...s, doc: prev, past: s.past.slice(0, -1), future: push(s.future, doc), selectedId: keepSelection(prev, s.selectedId) };
    };
    case 'redo': {
      if (!s.future.length) return s;
      const next = s.future[s.future.length - 1];
      return { ...s, doc: next, future: s.future.slice(0, -1), past: push(s.past, doc), selectedId: keepSelection(next, s.selectedId) };
    };
    case 'reset':
      return commit(s, { ...doc, background: 0, items: [] }, { selectedId: null });
    case 'random': {
      const role = pick(ROLES.length);
      const items = [...ACCESSORIES].sort(() => Math.random() - 0.5).slice(0, pick(4)).map((src, i) => fixItem({ src, x: STAGE / 2 + i * 24, y: STAGE / 2 + i * 24 }));
      return commit(s, { background: pick(BACKGROUNDS.length), role, emoji: pick(FACES[role].length), items }, { selectedId: null });
    };
    case 'load':
      return initialState(sanitizeDoc(a.doc));
    default:
      return s;
  };
};