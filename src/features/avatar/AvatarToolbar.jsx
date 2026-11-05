import { useEffect } from 'react';
import { toast } from '@/shared/components/ui';
import { IconArrowBackUp, IconArrowForwardUp, IconDice5, IconRefresh, IconRotateClockwise2, IconTrash, IconZoomIn, IconZoomOut, IconCopy, IconClipboard } from '@tabler/icons-react';
import { ROTATE_STEP, SCALE } from '@/features/avatar/config';

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

export default function AvatarToolbar({ selected, canUndo, canRedo, dispatch, doc }) {
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
      toast(error.name === 'NotAllowedError' ? 'Không có quyền truy cập clipboard' : error.message === 'Mã thiết kế không hợp lệ' || error.message === 'Dữ liệu thiết kế không hợp lệ' ? error.message : 'Clipboard không chứa mã thiết kế hợp lệ', 'err');
    };
  };

  return (
    <div role='toolbar' aria-label='Công cụ chỉnh sửa' className='grid grid-cols-4 gap-1.5 md:grid-cols-8'>
      <IconBtn label='Hoàn tác (Ctrl+Z)' Icon={IconArrowBackUp} disabled={!canUndo} onClick={() => dispatch({ type: 'undo' })} />
      <IconBtn label='Làm lại (Ctrl+Shift+Z)' Icon={IconArrowForwardUp} disabled={!canRedo} onClick={() => dispatch({ type: 'redo' })} />
      <IconBtn label='Phóng to' Icon={IconZoomIn} disabled={!selected || selected.scale >= SCALE.max} onClick={() => dispatch({ type: 'adjust', id, dScale: SCALE.step })} />
      <IconBtn label='Thu nhỏ' Icon={IconZoomOut} disabled={!selected || selected.scale <= SCALE.min} onClick={() => dispatch({ type: 'adjust', id, dScale: -SCALE.step })} />
      <IconBtn label='Xoay' Icon={IconRotateClockwise2} disabled={!selected} onClick={() => dispatch({ type: 'adjust', id, dRotation: ROTATE_STEP })} />
      <IconBtn label='Xóa phụ kiện đang chọn (Delete)' Icon={IconTrash} disabled={!selected} onClick={() => dispatch({ type: 'remove', id })} />
      <IconBtn label='Ngẫu nhiên' Icon={IconDice5} onClick={() => dispatch({ type: 'random' })} />
      <IconBtn label='Làm lại từ đầu' Icon={IconRefresh} onClick={() => dispatch({ type: 'reset' })} />
      <IconBtn label='Sao chép mã Base64' Icon={IconCopy} onClick={copyDesign} />
      <IconBtn label='Dán mã Base64' Icon={IconClipboard} onClick={pasteDesign} />
    </div>
  );
};