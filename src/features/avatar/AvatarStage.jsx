import { useEffect, useRef, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { Skeleton, Spinner } from '@/shared/components/ui';
import { PIXEL_RATIO, STAGE } from '@/features/avatar/config';
import { getAvatarDocumentImageUrls, drawAvatar } from '@/features/avatar/avatarRendering';
import { hitTest, doesPointHitCloseButton } from '@/features/avatar/geometry';
import { areAllImagesLoaded, preloadImages } from '@/features/avatar/imageLoading';

const dist = (a, b) => Math.hypot(a.x - b.x, a.y - b.y);
const angle = (a, b) => Math.atan2(b.y - a.y, b.x - a.x);
const PX = STAGE * PIXEL_RATIO;

export default function AvatarStage({ doc, selectedId, dispatch }) {
  const canvasRef = useRef(null);
  const live = useRef({ doc, selectedId });
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastWheel = useRef(0);
  const [painted, setPainted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState(false);
  const [width, setWidth] = useState(0);

  useEffect(() => {
    live.current = { doc, selectedId };
  });

  useEffect(() => {
    const ro = new ResizeObserver(([e]) => setWidth(Math.round(e.contentRect.width)));
    ro.observe(canvasRef.current);
    return () => ro.disconnect();
  }, []);

  useEffect(() => {
    let stale = false;
    let raf = 0;
    const urls = getAvatarDocumentImageUrls(doc);

    const paint = () => {
      const c = canvasRef.current;
      if (stale || !c) return;
      drawAvatar(c.getContext('2d'), doc, { selectedId, uiScale: STAGE / (c.clientWidth || STAGE) });
      setPainted(true);
    };
    const schedule = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(paint);
    };

    if (areAllImagesLoaded(urls)) {
      setLoading(false);
      setMissing(false);
      schedule();
    } else {
      setLoading(true);
      preloadImages(urls).then(() => {
        if (stale) return;
        setLoading(false);
        setMissing(!areAllImagesLoaded(urls));
        schedule();
      });
    };
    return () => {
      stale = true;
      cancelAnimationFrame(raf);
    };
  }, [doc, selectedId, width]);

  useEffect(() => {
    const c = canvasRef.current;
    const onWheel = (e) => {
      const { doc: d, selectedId: id } = live.current;
      const item = d.items.find((i) => i.id === id);
      if (!item) return;
      e.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current > 400) dispatch({ type: 'checkpoint' });
      lastWheel.current = now;
      dispatch({ type: 'patch', id, patch: { scale: item.scale * Math.exp(-e.deltaY * 0.0015) } });
    };
    c.addEventListener('wheel', onWheel, { passive: false });
    return () => c.removeEventListener('wheel', onWheel);
  }, [dispatch]);

  const toStage = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: ((e.clientX - r.left) * STAGE) / r.width, y: ((e.clientY - r.top) * STAGE) / r.height };
  };

  const onPointerDown = (e) => {
    const c = canvasRef.current;
    const p = toStage(e);
    const { doc: d, selectedId: sid } = live.current;
    c.setPointerCapture(e.pointerId);
    pointers.current.set(e.pointerId, p);

    const sel = d.items.find((i) => i.id === sid);
    if (pointers.current.size === 2 && sel) {
      const [a, b] = [...pointers.current.values()];
      gesture.current = { type: 'pinch', id: sel.id, d0: dist(a, b) || 1, a0: angle(a, b), s0: sel.scale, r0: sel.rotation, started: false };
      return;
    };
    if (sel && doesPointHitCloseButton(sel, p, STAGE / c.clientWidth)) {
      dispatch({ type: 'remove', id: sel.id });
      pointers.current.clear();
      gesture.current = null;
      return;
    };
    const hit = hitTest(d.items, p);
    dispatch({ type: 'select', id: hit?.id ?? null });
    gesture.current = hit ? { type: 'drag', id: hit.id, dx: hit.x - p.x, dy: hit.y - p.y, started: false } : null;
  };

  const onPointerMove = (e) => {
    const g = gesture.current;
    if (!g || !pointers.current.has(e.pointerId)) return;
    const p = toStage(e);
    pointers.current.set(e.pointerId, p);

    if (g.type === 'drag' && pointers.current.size === 1) {
      if (!g.started) dispatch({ type: 'checkpoint' });
      g.started = true;
      dispatch({ type: 'patch', id: g.id, patch: { x: p.x + g.dx, y: p.y + g.dy } });
    } else if (g.type === 'pinch' && pointers.current.size >= 2) {
      const [a, b] = [...pointers.current.values()];
      if (!g.started) dispatch({ type: 'checkpoint' });
      g.started = true;
      dispatch({ type: 'patch', id: g.id, patch: { scale: (g.s0 * dist(a, b)) / g.d0, rotation: g.r0 + ((angle(a, b) - g.a0) * 180) / Math.PI } });
    };
  };

  const onPointerUp = (e) => {
    pointers.current.delete(e.pointerId);
    if (pointers.current.size < 2 && gesture.current?.type === 'pinch') gesture.current = null;
    if (pointers.current.size === 0) gesture.current = null;
  };

  return (
    <div className='relative aspect-square w-full overflow-hidden rounded-2xl bg-raise ring-1 ring-line'>
      <canvas
        ref={canvasRef}
        width={PX}
        height={PX}
        aria-label='Khung tạo avatar: kéo phụ kiện để di chuyển'
        className='block size-full touch-none select-none'
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      />
      {!painted && <Skeleton className='absolute inset-0 rounded-none' />}
      {painted && loading && (
        <span className='absolute top-2 right-2 grid size-7 place-items-center rounded-full bg-bg/80 backdrop-blur-sm'>
          <Spinner size={16} className='text-lime' />
        </span>
      )}
      {missing && (
        <p className='absolute inset-x-0 bottom-0 flex items-center gap-1.5 bg-bad/90 px-2 py-1 text-[10px] font-bold text-bg'>
          <IconPhotoOff size={13} className='shrink-0' /> Thiếu ảnh
        </p>
      )}
    </div>
  );
};