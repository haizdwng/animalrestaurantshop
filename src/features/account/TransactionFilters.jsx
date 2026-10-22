import { IconFilter, IconSearch, IconX } from '@tabler/icons-react';
import { PageSizeSelect, Select, SortSelect } from '@/shared/components/ui';
import { STATUS } from '@/shared/components/payment/StatusBadge';
import { TX_SORTS } from '@/features/account/config';

export default function TransactionFilters({ list, statuses, q, onQ, status, onStatus, size, onSize, sort, onSort }) {
  return (
    <div className='grid grid-cols-2 gap-2 border-b border-line p-3 sm:grid-cols-[auto_1fr_auto] sm:px-5'>
      <label className='col-span-2 flex h-10 items-center gap-2 rounded-lg border border-line bg-panel px-3 focus-within:border-lime sm:col-span-3'>
        <IconSearch size={15} className='shrink-0 text-mute' />
        <input value={q} onChange={(e) => onQ(e.target.value)} placeholder='Tìm theo mã giao dịch…' autoCapitalize='none' spellCheck={false} className='min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-mute/50 sm:text-sm' />
        {q && (
          <button onClick={() => onQ('')} aria-label='Xoá tìm kiếm' className='grid size-6 cursor-pointer place-items-center rounded-md text-mute hover:bg-raise hover:text-fg'>
            <IconX size={14} />
          </button>
        )}
      </label>
      <Select label='Lọc trạng thái' Icon={IconFilter} value={status} onChange={onStatus}>
        <option value='all'>Tất cả trạng thái</option>
        {statuses.map((k) => (
          <option key={k} value={k}>
            {STATUS[k]?.label || k} ({(list || []).filter((t) => t.status === k).length})
          </option>
        ))}
      </Select>
      <PageSizeSelect value={size} onChange={onSize} className='sm:order-last' />
      <SortSelect sorts={TX_SORTS} value={sort} onChange={onSort} className='col-span-2 sm:col-span-1' />
    </div>
  );
};