import { IconFilter } from '@tabler/icons-react';
import { PageSizeSelect, SearchInput, Select, SortSelect } from '@/shared/components/ui';
import { STATUS } from '@/shared/components/payment/StatusBadge';
import { TX_SORTS } from '@/features/account/config';

export default function TransactionFilters({ list, statuses, q, onQ, status, onStatus, size, onSize, sort, onSort }) {
  return (
    <div className='grid grid-cols-2 gap-2 border-b border-line p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:px-5'>
      <SearchInput label='Tìm giao dịch' placeholder='Tìm theo mã giao dịch…' value={q} onChange={onQ} className='col-span-2 sm:col-span-3' />
      <Select label='Lọc trạng thái' Icon={IconFilter} value={status} onChange={onStatus}>
        <option value='all'>Tất cả trạng thái</option>
        {statuses.map((key) => <option key={key} value={key}>{STATUS[key]?.label || key} ({(list || []).filter((transaction) => transaction.status === key).length})</option>)}
      </Select>
      <PageSizeSelect value={size} onChange={onSize} className='sm:order-last' />
      <SortSelect sorts={TX_SORTS} value={sort} onChange={onSort} className='col-span-2 sm:col-span-1' />
    </div>
  );
};