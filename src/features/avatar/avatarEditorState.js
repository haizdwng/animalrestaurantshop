import { ACCESSORIES, BACKGROUNDS, FACES, ROLES } from '@/features/avatar/manifest';
import { DRAWING_SIZE, HISTORY_LIMIT, MAX_ITEMS, MAX_STROKES, MAX_STROKE_POINTS, SCALE, STAGE } from '@/features/avatar/config';
import { isAvatarPhoto } from '@/features/avatar/avatarPhoto';

export const INITIAL_DOC = { background: 0, role: 0, emoji: 0, photo: null, items: [], strokes: [] };
export const initialState = (doc = INITIAL_DOC) => ({ doc, past: [], future: [], selectedId: null });

const KNOWN = new Set(ACCESSORIES);
const clamp = (value, minimum, maximum) => Math.min(maximum, Math.max(minimum, value));
const inRange = (index, length) => Number.isInteger(index) && index >= 0 && index < length;
const num = (value, fallback) => (Number.isFinite(value) ? value : fallback);
const pick = (length) => Math.floor(Math.random() * length);
const validColor = (color) => typeof color === 'string' && /^#[\da-f]{6}$/i.test(color);
const fixPoint = (point) => Array.isArray(point) && Number.isFinite(point[0]) && Number.isFinite(point[1]) ? [Math.round(clamp(point[0], 0, STAGE) * 10) / 10, Math.round(clamp(point[1], 0, STAGE) * 10) / 10] : null;

let sequence = 0;
const newId = () => `i${Date.now().toString(36)}${sequence++}`;

const fixItem = (item) => ({
  id: newId(),
  src: item.src,
  x: clamp(num(item.x, STAGE / 2), 0, STAGE),
  y: clamp(num(item.y, STAGE / 2), 0, STAGE),
  scale: clamp(num(item.scale, 1), SCALE.min, SCALE.max),
  rotation: ((num(item.rotation, 0) % 360) + 360) % 360
});

const fixStroke = (stroke) => {
  if (!stroke || (stroke.tool !== 'brush' && stroke.tool !== 'eraser') || !Array.isArray(stroke.points)) return null;
  const points = stroke.points.slice(0, MAX_STROKE_POINTS).map(fixPoint).filter(Boolean);
  if (!points.length) return null;
  return {
    id: newId(),
    tool: stroke.tool,
    size: clamp(num(stroke.size, 16), DRAWING_SIZE.min, DRAWING_SIZE.max),
    opacity: stroke.tool === 'brush' ? clamp(num(stroke.opacity, 100), 1, 100) : 100,
    color: validColor(stroke.color) ? stroke.color : '#d4ff3a',
    points
  };
};

export function sanitizeDoc(raw) {
  if (!raw || typeof raw !== 'object') return INITIAL_DOC;
  const background = inRange(raw.background, BACKGROUNDS.length) ? raw.background : 0;
  const role = inRange(raw.role, ROLES.length) ? raw.role : 0;
  const emoji = inRange(raw.emoji, FACES[role].length) ? raw.emoji : 0;
  const photo = isAvatarPhoto(raw.photo) ? raw.photo : null;
  const items = (Array.isArray(raw.items) ? raw.items : []).filter((item) => item && KNOWN.has(item.src)).slice(0, MAX_ITEMS).map(fixItem);
  const strokes = (Array.isArray(raw.strokes) ? raw.strokes : []).slice(0, MAX_STROKES).map(fixStroke).filter(Boolean);
  return { background, role, emoji, photo, items, strokes };
};

const push = (list, doc) => [...list, doc].slice(-HISTORY_LIMIT);
const commit = (state, doc, extra = {}) => ({ ...state, ...extra, doc, past: push(state.past, state.doc), future: [] });
const keepSelection = (doc, id) => (doc.items.some((item) => item.id === id) ? id : null);
const mapItem = (doc, id, transform) => ({ ...doc, items: doc.items.map((item) => (item.id === id ? { ...fixItem(transform(item)), id } : item)) });

export function reducer(state, action) {
  const { doc } = state;
  switch (action.type) {
    case 'photo':
      return isAvatarPhoto(action.photo) && action.photo !== doc.photo ? commit(state, { ...doc, photo: action.photo }, { selectedId: null }) : state;
    case 'remove-photo':
      return doc.photo ? commit(state, { ...doc, photo: null }, { selectedId: null }) : state;
    case 'background':
      return action.index === doc.background && !doc.photo ? state : commit(state, { ...doc, background: action.index, photo: null });
    case 'role':
      return action.index === doc.role && !doc.photo ? state : commit(state, { ...doc, role: action.index, emoji: 0, photo: null });
    case 'emoji':
      return action.index === doc.emoji && !doc.photo ? state : commit(state, { ...doc, emoji: action.index, photo: null });
    case 'toggle': {
      const existing = doc.items.find((item) => item.src === action.src);
      if (existing) return commit(state, { ...doc, items: doc.items.filter((item) => item !== existing) }, { selectedId: state.selectedId === existing.id ? null : state.selectedId });
      if (doc.items.length >= MAX_ITEMS) return state;
      const offset = doc.items.length * 24;
      const item = fixItem({ src: action.src, x: STAGE / 2 + offset, y: STAGE / 2 + offset });
      return commit(state, { ...doc, items: [...doc.items, item] }, { selectedId: item.id });
    };
    case 'remove':
      return commit(state, { ...doc, items: doc.items.filter((item) => item.id !== action.id) }, { selectedId: state.selectedId === action.id ? null : state.selectedId });
    case 'select': {
      if (action.id === state.selectedId) return state;
      const item = doc.items.find((item) => item.id === action.id);
      if (!item) return { ...state, selectedId: null };
      return { ...state, selectedId: item.id, doc: { ...doc, items: [...doc.items.filter((entry) => entry !== item), item] } };
    };
    case 'checkpoint':
      return { ...state, past: push(state.past, doc), future: [] };
    case 'patch':
      return { ...state, doc: mapItem(doc, action.id, (item) => ({ ...item, ...action.patch })) };
    case 'adjust':
      return commit(state, mapItem(doc, action.id, (item) => ({ ...item, scale: item.scale + (action.dScale || 0), rotation: item.rotation + (action.dRotation || 0) })));
    case 'stroke-start': {
      if (doc.strokes.length >= MAX_STROKES) return state;
      const stroke = fixStroke(action.stroke);
      return stroke ? commit(state, { ...doc, strokes: [...doc.strokes, { ...stroke, id: action.stroke.id }] }, { selectedId: null }) : state;
    };
    case 'stroke-points': {
      const stroke = doc.strokes.at(-1);
      if (!stroke || stroke.id !== action.id || stroke.points.length >= MAX_STROKE_POINTS) return state;
      const points = [...stroke.points];
      for (const original of action.points) {
        const point = fixPoint(original);
        if (!point) continue;
        const last = points.at(-1);
        if (Math.hypot(point[0] - last[0], point[1] - last[1]) < 0.7) continue;
        points.push(point);
        if (points.length >= MAX_STROKE_POINTS) break;
      };
      if (points.length === stroke.points.length) return state;
      return { ...state, doc: { ...doc, strokes: [...doc.strokes.slice(0, -1), { ...stroke, points }] } };
    };
    case 'clear-strokes':
      return doc.strokes.length ? commit(state, { ...doc, strokes: [] }) : state;
    case 'undo': {
      if (!state.past.length) return state;
      const previous = state.past.at(-1);
      return { ...state, doc: previous, past: state.past.slice(0, -1), future: push(state.future, doc), selectedId: keepSelection(previous, state.selectedId) };
    };
    case 'redo': {
      if (!state.future.length) return state;
      const next = state.future.at(-1);
      return { ...state, doc: next, future: state.future.slice(0, -1), past: push(state.past, doc), selectedId: keepSelection(next, state.selectedId) };
    };
    case 'reset':
      return commit(state, { ...doc, photo: null, background: 0, items: [], strokes: [] }, { selectedId: null });
    case 'random': {
      const role = pick(ROLES.length);
      const items = [...ACCESSORIES].sort(() => Math.random() - 0.5).slice(0, pick(4)).map((src, index) => fixItem({ src, x: STAGE / 2 + index * 24, y: STAGE / 2 + index * 24 }));
      return commit(state, { background: pick(BACKGROUNDS.length), role, emoji: pick(FACES[role].length), photo: null, items, strokes: [] }, { selectedId: null });
    };
    case 'load':
      return commit(state, sanitizeDoc(action.doc), { selectedId: null });
    default:
      return state;
  };
};