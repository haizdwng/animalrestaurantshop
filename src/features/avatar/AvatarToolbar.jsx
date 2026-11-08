import { useEffect } from 'react';
import { toast } from '@/shared/components/ui';
import { IconArrowBackUp, IconArrowForwardUp, IconDice5, IconRefresh, IconRotateClockwise2, IconTrash, IconZoomIn, IconZoomOut, IconCopy, IconClipboard } from '@tabler/icons-react';
import { ROTATE_STEP, SCALE } from '@/features/avatar/config';
import DrawingTools from '@/features/avatar/DrawingTools';

function IconBtn({ label, Icon, ...props }) {
  return (
    <button
      type='button'
      {...props}
      title={label}
      aria-label={label}
      className='grid h-9 w-full cursor-pointer place-items-center rounded-lg border border-line bg-raise text-fg transition hover:border-mute focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:active:scale-100'
    >
      <Icon size={17} />
    </button>
  );
};

function encodeBase64(value) {
  const bytes = new TextEncoder().encode(JSON.stringify(value));
  let binary = '';
  for (let i = 0; i < bytes.length; i += 0x8000) binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  return btoa(binary);
};

function decodeBase64(value) {
  const binary = atob(value.trim());
  const bytes = Uint8Array.from(binary, (char) => char.charCodeAt(0));
  return JSON.parse(new TextDecoder().decode(bytes));
};

function isEditableTarget(target) {
  return target instanceof HTMLElement && (target.isContentEditable || target.closest('input, textarea, select, [contenteditable="true"]'));
};

export default function AvatarToolbar({ selected, canUndo, canRedo, dispatch, doc, tool, onTool, brush, onBrush, eraserSize, onEraserSize }) {
  const id = selected?.id;
  const copyDesign = async () => {
    try {
      const encoded = encodeBase64({
        version: 1,
        ...doc
      });
      await navigator.clipboard.writeText(encoded);
      toast('Đã sao chép mã thiết kế');
    } catch {
      toast('Không thể sao chép mã thiết kế', 'err');
    };
  };

  const pasteDesign = async () => {
    try {
      const encoded = await navigator.clipboard.readText();
      const data = decodeBase64(encoded);
      if (!data || data.version !== 1) throw new Error('Mã thiết kế không hợp lệ');
      if (!Number.isInteger(data.background) || !Number.isInteger(data.role) || !Number.isInteger(data.emoji) || !Array.isArray(data.items)) throw new Error('Dữ liệu thiết kế không hợp lệ');
      dispatch({ type: 'load', doc: data });
      toast('Đã dán thiết kế thành công');
    } catch (error) {
      toast(error.name === 'NotAllowedError' ? 'Không có quyền truy cập bộ nhớ tạm' : error.message === 'Mã thiết kế không hợp lệ' || error.message === 'Dữ liệu thiết kế không hợp lệ' ? error.message : 'Bộ nhớ tạm không chứa mã thiết kế hợp lệ', 'err');
    };
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (!event.ctrlKey || event.altKey || event.metaKey || isEditableTarget(event.target)) return;
      const key = event.key.toLowerCase();
      if (key === 'c') {
        if (window.getSelection()?.toString()) return;
        event.preventDefault();
        copyDesign();
      };
      if (key === 'v') {
        event.preventDefault();
        pasteDesign();
      };
      if (key === 'z' || key === 'y') {
        event.preventDefault();
        dispatch({ type: key === 'y' || event.shiftKey ? 'redo' : 'undo' });
      };
    };

    const handleWheel = (event) => {
      if (!event.ctrlKey || isEditableTarget(event.target)) return;
      event.preventDefault();
      if (!selected) return;
      const direction = event.deltaY < 0 ? 1 : -1;
      const nextScale = selected.scale + direction * SCALE.step;
      if (nextScale < SCALE.min || nextScale > SCALE.max) return;
      dispatch({
        type: 'adjust',
        id,
        dScale: direction * SCALE.step
      });
    };
    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('wheel', handleWheel);
    };
  }, [selected, id, dispatch, copyDesign, pasteDesign]);

  return (
    <div role='toolbar' aria-label='Công cụ chỉnh sửa' className='grid grid-cols-4 gap-1.5 md:grid-cols-8'>
      <DrawingTools
        tool={tool}
        onTool={onTool}
        brush={brush}
        onBrush={onBrush}
        eraserSize={eraserSize}
        onEraserSize={onEraserSize}
        hasStrokes={doc.strokes.length > 0}
        onClear={() => dispatch({ type: 'clear-strokes' })}
      />
      <IconBtn label='Hoàn tác' Icon={IconArrowBackUp} disabled={!canUndo} onClick={() => dispatch({ type: 'undo' })} />
      <IconBtn label='Làm lại' Icon={IconArrowForwardUp} disabled={!canRedo} onClick={() => dispatch({ type: 'redo' })} />
      <IconBtn label='Phóng to' Icon={IconZoomIn} disabled={!selected || selected.scale >= SCALE.max} onClick={() => dispatch({ type: 'adjust', id, dScale: SCALE.step })} />
      <IconBtn label='Thu nhỏ' Icon={IconZoomOut} disabled={!selected || selected.scale <= SCALE.min} onClick={() => dispatch({ type: 'adjust', id, dScale: -SCALE.step })} />
      <IconBtn label='Xoay' Icon={IconRotateClockwise2} disabled={!selected} onClick={() => dispatch({ type: 'adjust', id, dRotation: ROTATE_STEP })} />
      <IconBtn label='Xóa phụ kiện đang chọn' Icon={IconTrash} disabled={!selected} onClick={() => dispatch({ type: 'remove', id })} />
      <IconBtn label='Ngẫu nhiên' Icon={IconDice5} onClick={() => dispatch({ type: 'random' })} />
      <IconBtn label='Làm lại từ đầu' Icon={IconRefresh} onClick={() => dispatch({ type: 'reset' })} />
      <IconBtn label='Sao chép thiết kế' Icon={IconCopy} onClick={copyDesign} />
      <IconBtn label='Dán thiết kế' Icon={IconClipboard} onClick={pasteDesign} />
    </div>
  );
};