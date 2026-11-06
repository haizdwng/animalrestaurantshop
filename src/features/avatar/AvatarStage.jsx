import { useEffect, useRef, useState } from 'react';
import { IconPhotoOff } from '@tabler/icons-react';
import { Skeleton, Spinner } from '@/shared/components/ui';
import { PIXEL_RATIO, STAGE } from '@/features/avatar/config';
import { getAvatarDocumentImageUrls, drawAvatar } from '@/features/avatar/avatarRendering';
import { hitTest, doesPointHitCloseButton } from '@/features/avatar/geometry';
import { areAllImagesLoaded, preloadImages } from '@/features/avatar/imageLoading';

const dist = (first, second) => Math.hypot(first.x - second.x, first.y - second.y);
const angle = (first, second) => Math.atan2(second.y - first.y, second.x - first.x);
const PIXEL_SIZE = STAGE * PIXEL_RATIO;

export default function AvatarStage({ doc, selectedId, dispatch }) {
  const canvasRef = useRef(null);
  const live = useRef({ doc, selectedId, images: new Map() });
  const pointers = useRef(new Map());
  const gesture = useRef(null);
  const lastWheel = useRef(0);
  const [painted, setPainted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [missing, setMissing] = useState(false);
  const [width, setWidth] = useState(0);
  const [loadedAssets, setLoadedAssets] = useState({ key: '', images: new Map() });
  const imageUrls = getAvatarDocumentImageUrls(doc);
  const imageKey = imageUrls.join('|');
  const images = loadedAssets.key === imageKey ? loadedAssets.images : new Map();

  useEffect(() => {
    live.current = { doc, selectedId, images };
  });

  useEffect(() => {
    const observer = new ResizeObserver(([entry]) => setWidth(Math.round(entry.contentRect.width)));
    observer.observe(canvasRef.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    let stale = false;
    setLoading(true);
    setLoadedAssets({ key: '', images: new Map() });

    preloadImages(imageUrls).then((loadedImages) => {
      if (stale) return;
      setLoadedAssets({ key: imageKey, images: loadedImages });
      setMissing(!areAllImagesLoaded(imageUrls, loadedImages));
      setLoading(false);
    });

    return () => stale = true;
  }, [imageKey]);

  useEffect(() => {
    if (loadedAssets.key !== imageKey) return;
    let animationFrame = 0;
    const paint = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      drawAvatar(canvas.getContext('2d'), doc, {
        selectedId,
        userInterfaceScale: STAGE / (canvas.clientWidth || STAGE),
        images: loadedAssets.images
      });
      setPainted(true);
    };
    animationFrame = requestAnimationFrame(paint);
    return () => cancelAnimationFrame(animationFrame);
  }, [doc, selectedId, width, imageKey, loadedAssets]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const onWheel = (event) => {
      const { doc: currentDoc, selectedId: currentSelectedId } = live.current;
      const item = currentDoc.items.find((entry) => entry.id === currentSelectedId);
      if (!item) return;
      event.preventDefault();
      const now = Date.now();
      if (now - lastWheel.current > 400) dispatch({ type: 'checkpoint' });
      lastWheel.current = now;
      dispatch({ type: 'patch', id: currentSelectedId, patch: { scale: item.scale * Math.exp(-event.deltaY * 0.0015) } });
    };
    canvas.addEventListener('wheel', onWheel, { passive: false });
    return () => canvas.removeEventListener('wheel', onWheel);
  }, [dispatch]);

  const toStage = (event) => {
    const rect = canvasRef.current.getBoundingClientRect();
    return { x: ((event.clientX - rect.left) * STAGE) / rect.width, y: ((event.clientY - rect.top) * STAGE) / rect.height };
  };

  const onPointerDown = (event) => {
    const canvas = canvasRef.current;
    const point = toStage(event);
    const { doc: currentDoc, selectedId: currentSelectedId, images: currentImages } = live.current;
    canvas.setPointerCapture(event.pointerId);
    pointers.current.set(event.pointerId, point);

    const selectedItem = currentDoc.items.find((item) => item.id === currentSelectedId);
    if (pointers.current.size === 2 && selectedItem) {
      const [first, second] = [...pointers.current.values()];
      gesture.current = { type: 'pinch', id: selectedItem.id, initialDistance: dist(first, second) || 1, initialAngle: angle(first, second), initialScale: selectedItem.scale, initialRotation: selectedItem.rotation, started: false };
      return;
    };
    if (selectedItem && doesPointHitCloseButton(selectedItem, point, STAGE / canvas.clientWidth, currentImages)) {
      dispatch({ type: 'remove', id: selectedItem.id });
      pointers.current.clear();
      gesture.current = null;
      return;
    };

    const hitItem = hitTest(currentDoc.items, point, currentImages);
    dispatch({ type: 'select', id: hitItem?.id ?? null });
    gesture.current = hitItem ? { type: 'drag', id: hitItem.id, offsetX: hitItem.x - point.x, offsetY: hitItem.y - point.y, started: false } : null;
  };

  const onPointerMove = (event) => {
    const currentGesture = gesture.current;
    if (!currentGesture || !pointers.current.has(event.pointerId)) return;
    const point = toStage(event);
    pointers.current.set(event.pointerId, point);

    if (currentGesture.type === 'drag' && pointers.current.size === 1) {
      if (!currentGesture.started) dispatch({ type: 'checkpoint' });
      currentGesture.started = true;
      dispatch({ type: 'patch', id: currentGesture.id, patch: { x: point.x + currentGesture.offsetX, y: point.y + currentGesture.offsetY } });
    } else if (currentGesture.type === 'pinch' && pointers.current.size >= 2) {
      const [first, second] = [...pointers.current.values()];
      if (!currentGesture.started) dispatch({ type: 'checkpoint' });
      currentGesture.started = true;
      dispatch({
        type: 'patch',
        id: currentGesture.id,
        patch: {
          scale: (currentGesture.initialScale * dist(first, second)) / currentGesture.initialDistance,
          rotation: currentGesture.initialRotation + ((angle(first, second) - currentGesture.initialAngle) * 180) / Math.PI
        }
      });
    };
  };

  const onPointerUp = (event) => {
    pointers.current.delete(event.pointerId);
    if (pointers.current.size < 2 && gesture.current?.type === 'pinch') gesture.current = null;
    if (pointers.current.size === 0) gesture.current = null;
  };

  return (
    <div className='relative aspect-square w-full overflow-hidden rounded-2xl bg-raise ring-1 ring-line'>
      <canvas
        ref={canvasRef}
        width={PIXEL_SIZE}
        height={PIXEL_SIZE}
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