import { useMemo, useState } from 'react';
import { IconReceipt, IconRefresh } from '@tabler/icons-react';
import { formatVietnameseDong } from '@/shared/library/format';
import { Button, Dialog, PagerSkeleton, RowSkeleton, Spinner, toast, toastError } from '@/shared/components/ui';
import PaymentDialog from '@/shared/components/payment/PaymentDialog';
import { STATUS } from '@/shared/components/payment/StatusBadge';
import { TX_PAGE_SIZE, TX_SORTS } from '@/features/account/config';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRemoteResource from '@/shared/hooks/useRemoteResource';
import TransactionFilters from '@/features/account/TransactionFilters';
import TransactionRow from '@/features/account/TransactionRow';
import * as api from '@/shared/library/api';

const SKELETON_WIDTHS = ['w-1/3', 'w-1/4', 'w-2/5'];

function ConfirmCancel({ tx, onClose, onConfirm }) {
  return (
    <Dialog open={!!tx} title='Huỷ giao dịch' onClose={onClose}>
      <p className='text-sm text-mute'>
        Huỷ giao dịch <b className='text-fg'>{tx?.code}</b> ({formatVietnameseDong(tx?.amount)})?
      </p>
      <div className='grid grid-cols-2 gap-2'>
        <Button variant='ghost' onClick={onClose}>
          Không
        </Button>
        <Button variant='danger' onClick={() => onConfirm(tx)}>
          Huỷ giao dịch
        </Button>
      </div>
    </Dialog>
  );
};

export default function Transactions({ onPaid }) {
  const { data: list, setData: setList, loading, error, reload: load } = useRemoteResource(async () => (await api.getTransactions()).transactions);
  const [open, setOpen] = useState(null);
  const [cancelling, setCancelling] = useState('');
  const [confirm, setConfirm] = useState(null);
  const [status, setStatus] = useState('all');
  const [q, setQ] = useState('');
  const [sort, setSort] = useState(TX_SORTS[0][0]);
  const [size, setSize] = useState(TX_PAGE_SIZE);

  const statuses = useMemo(() => [...new Set([...Object.keys(STATUS), ...(list || []).map((t) => t.status)])].filter(Boolean), [list]);
  const shown = useMemo(() => {
    if (!list) return list;
    const comparator = TX_SORTS.find((x) => x[0] === sort)?.[2] || TX_SORTS[0][2];
    return list.filter((t) => (status === 'all' || t.status === status) && String(t.code ?? '').toLowerCase().includes(q.trim().toLowerCase())).sort(comparator);
  }, [list, status, sort, q]);
  const { rows, pager } = usePaginatedData(shown, size, status + sort + q);

  const update = (tx) => {
    setList((l) => l?.map((t) => (t.code === tx.code ? { ...t, ...tx } : t)));
    setOpen((o) => (o?.code === tx.code ? { ...o, ...tx } : o));
  };
  const cancel = async (tx) => {
    setConfirm(null);
    setCancelling(tx.code);
    try {
      const r = await api.cancelTransaction(tx.code);
      update({ code: tx.code, status: 'cancelled' });
      toast(r.message, 'info');
    } catch (e) {
      toastError(e);
    } finally {
      setCancelling('');
    };
  };

  const emptyText = list?.length ? (q.trim() ? `Không tìm thấy giao dịch có mã “${q.trim()}”` : 'Không có giao dịch nào với trạng thái này') : 'Chưa có giao dịch mua xu nào';

  return (
    <section className='rounded-2xl border border-line bg-panel'>
      <h3 className='flex items-center gap-2 border-b border-line px-4 py-3 text-xs font-bold sm:px-5'>
        <IconReceipt size={16} className='text-coin' /> Giao dịch mua xu
        {list?.length > 0 && <span className='rounded bg-raise px-1.5 text-[10px] text-mute tabular-nums'>{list.length}</span>}
        <Button variant='quiet' size='sm' onClick={load} disabled={loading} aria-label='Làm mới' className='ml-auto size-8! px-2!'>
          {loading ? <Spinner size={14} /> : <IconRefresh size={14} />}
        </Button>
      </h3>
      {(list?.length > 0 || (!list && loading)) && <TransactionFilters list={list} statuses={statuses} q={q} onQ={setQ} status={status} onStatus={setStatus} size={size} onSize={setSize} sort={sort} onSort={setSort} />}
      {!list && loading ? (
        <>
          <ul aria-busy='true' className='divide-y divide-line'>
            {Array.from({ length: Math.min(size, 5) }).map((_, i) => (
              <RowSkeleton key={i} lead={false} w={SKELETON_WIDTHS[i % 3]} />
            ))}
          </ul>
          <div className='border-t border-line px-4 py-2.5 sm:px-5'>
            <PagerSkeleton />
          </div>
        </>
      ) : !list && error ? (
        <div className='p-6 text-center text-xs'>
          <p className='text-bad'>{error}</p>
          <Button variant='ghost' size='sm' onClick={load} className='mt-3'>
            Thử lại
          </Button>
        </div>
      ) : shown?.length ? (
        <ul className={`divide-y divide-line transition-opacity ${loading ? 'opacity-50' : ''}`}>
          {rows.map((t, index) => (
            <TransactionRow key={`${t.code || 'transaction'}-${index}`} tx={t} cancelling={cancelling === t.code} onPay={() => setOpen(t)} onCancel={() => setConfirm(t)} />
          ))}
        </ul>
      ) : (
        <p className='p-8 text-center text-xs text-mute'>{emptyText}</p>
      )}
      {pager && <div className='border-t border-line px-4 py-2.5 sm:px-5'>{pager}</div>}
      <ConfirmCancel tx={confirm} onClose={() => setConfirm(null)} onConfirm={cancel} />
      <PaymentDialog tx={open} onClose={() => setOpen(null)} onChange={update} onPaid={onPaid} />
    </section>
  );
};