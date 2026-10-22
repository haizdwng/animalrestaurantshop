import { IconArrowBackUp, IconArrowForwardUp, IconDice5, IconRefresh, IconRotateClockwise2, IconTrash, IconZoomIn, IconZoomOut } from '@tabler/icons-react';
import { ROTATE_STEP, SCALE } from '@/features/avatar/config';

function IconBtn({ label, Icon, ...p }) {
  return (
    <button
      type='button'
      {...p}
      title={label}
      aria-label={label}
      className='grid h-9 w-full cursor-pointer place-items-center rounded-lg border border-line bg-raise text-fg transition hover:border-mute focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-lime active:scale-95 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:border-line disabled:active:scale-100'
    >
      <Icon size={17} />
    </button>
  );
};

export default function AvatarToolbar({ selected, canUndo, canRedo, dispatch }) {
  const id = selected?.id;
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
    </div>
  );
};