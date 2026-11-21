import { IconFilter } from '@tabler/icons-react';
import { SearchInput, Select, SortSelect } from '@/shared/components/ui';
import { STATUS } from '@/shared/components/payment/StatusBadge';
import { TX_SORTS } from '@/features/account/config';

export default function TransactionFilters({ list, statuses, q, onQ, status, onStatus, sort, onSort }) {
  return (
    <div className='grid grid-cols-2 gap-2 border-b border-line p-3 sm:px-5'>
      <SearchInput label='Tìm giao dịch' placeholder='Tìm theo mã giao dịch…' value={q} onChange={onQ} className='col-span-2' />
      <Select label='Lọc trạng thái' Icon={IconFilter} value={status} onChange={onStatus}>
        <option value='all'>Tất cả trạng thái</option>
        {statuses.map((key) => <option key={key} value={key}>{STATUS[key]?.label || key} ({(list || []).filter((transaction) => transaction.status === key).length})</option>)}
      </Select>
      <SortSelect sorts={TX_SORTS} value={sort} onChange={onSort} />
    </div>
  );
};