import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react';
import Button from '@/shared/components/ui/Button';

export default function Pager({ page, pages, size, total, onPage }) {
  const first = total === 0 ? 0 : (page - 1) * size + 1;
  const last = Math.min(page * size, total);
  return (
    <nav aria-label='Phân trang' className='flex flex-wrap items-center justify-between gap-2 text-xs text-mute'>
      <p className='tabular-nums'>{first.toLocaleString('vi-VN')}–{last.toLocaleString('vi-VN')} / {total.toLocaleString('vi-VN')}</p>
      <div className='flex items-center gap-2'>
        <Button variant='ghost' size='sm' className='px-2!' disabled={page <= 1} onClick={() => onPage(page - 1)} aria-label='Trang trước'>
          <IconChevronLeft size={16} />
        </Button>
        <span className='min-w-16 text-center font-bold text-fg tabular-nums' aria-live='polite'>{page} / {Math.max(1, pages)}</span>
        <Button variant='ghost' size='sm' className='px-2!' disabled={page >= pages} onClick={() => onPage(page + 1)} aria-label='Trang sau'>
          <IconChevronRight size={16} />
        </Button>
      </div>
    </nav>
  );
};