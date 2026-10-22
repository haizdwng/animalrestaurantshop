import { IconPencil } from '@tabler/icons-react';
import { Button } from '@/shared/components/ui';

export default function FieldRow({ label, children, onEdit, Icon }) {
  return (
    <div className='flex items-center gap-3 px-4 py-3.5 sm:px-5'>
      <span className='grid size-9 shrink-0 place-items-center rounded-lg bg-raise text-mute'>
        <Icon size={17} />
      </span>
      <div className='min-w-0 flex-1'>
        <p className='text-[10px] text-mute'>{label}</p>
        <div className='mt-0.5 truncate text-sm font-bold'>{children}</div>
      </div>
      {onEdit && (
        <Button variant='quiet' size='sm' onClick={onEdit}>
          <IconPencil size={13} /> Sửa
        </Button>
      )}
    </div>
  );
};