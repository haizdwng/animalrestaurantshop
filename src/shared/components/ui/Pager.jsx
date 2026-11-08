import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';

export default function Pager({ page, pages, size, total, onPage }) {
  return (
    <div className='flex flex-wrap items-center justify-between gap-2 text-[11px] text-mute'>
      <span className='tabular-nums'>
        {((page - 1) * size + 1).toLocaleString('vi-VN')}–{Math.min(page * size, total).toLocaleString('vi-VN')} / {total.toLocaleString('vi-VN')}
      </span>
      <div className='flex items-center gap-1'>
        <Button variant='ghost' size='sm' className='px-2!' disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label='Trang trước'>
          <IconChevronLeft size={14} />
        </Button>
        <span className='min-w-16 text-center font-bold text-fg tabular-nums'>
          {page} / {pages}
        </span>
        <Button variant='ghost' size='sm' className='px-2!' disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label='Trang sau'>
          <IconChevronRight size={14} />
        </Button>
      </div>
    </div>
  );
};