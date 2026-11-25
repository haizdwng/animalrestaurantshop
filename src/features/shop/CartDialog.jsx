import { IconAlertTriangle, IconPencil, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import Tile from '@/features/shop/Tile';
import QuantityPicker from '@/features/shop/QuantityPicker';
import { cartCount, cartTotal, lineMaximum } from '@/features/shop/cartUtils';

export default function CartDialog({ open, entries, coins, ready, buying, requestPending = false, accountLimit = 100, onClose, onQuantity, onEdit, onRemove, onClear, onBuy, onTopUp }) {
  const total = cartTotal(entries);
  const shortage = Math.max(0, total - Number(coins || 0));
  const invalid = entries.filter((entry) => entry.invalid);
  const canBuy = entries.length > 0 && ready && !buying && !requestPending && invalid.length === 0 && shortage === 0 && Number.isSafeInteger(total) && entries.length <= 5000;

  return (
    <Dialog open={open} title='Giỏ hàng' onClose={() => !buying && onClose()}>
      <div className='space-y-3'>
        <div className='flex items-center justify-between gap-3'>
          <p className='text-[11px] text-mute'>{formatNumber(entries.length)} dòng · {formatNumber(cartCount(entries))} vật phẩm</p>
          {entries.length > 0 && <Button variant='quiet' size='sm' disabled={buying} onClick={onClear} className='text-bad!'><IconTrash size={14} /> Xóa tất cả</Button>}
        </div>
        {entries.length === 0 ? <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-8 text-center text-xs text-mute'><IconShoppingCart size={30} stroke={1.5} /> Chưa có vật phẩm nào trong giỏ.</div> : (
          <ul className='max-h-[55dvh] space-y-2 overflow-y-auto overscroll-contain pr-1'>
            {entries.map((entry) => {
              const max = lineMaximum(entry, entries, accountLimit);
              return <li key={entry.lineId} className={`rounded-xl border bg-bg p-3 ${entry.invalid ? 'border-bad/40' : 'border-line'}`}>
                <div className='flex items-start gap-3'>
                  <Tile p={entry.node} />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-[10px] text-mute'>{entry.category}</p>
                    <p className='line-clamp-2 text-xs font-bold'>{entry.node?.name || entry.key}</p>
                    {entry.labels.length > 0 && <p className='mt-1 text-[11px] text-mute'>{entry.labels.join(' · ')}</p>}
                    <p className='mt-1 flex items-center gap-1 text-[11px] text-coin'><Coin size={13} /> {formatNumber(entry.unitPrice)} xu / {entry.node?.unit || 'cái'}</p>
                  </div>
                  <button type='button' aria-label={`Xóa ${entry.node?.name || entry.key} khỏi giỏ`} disabled={buying} onClick={() => onRemove(entry.lineId)} className='grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-mute hover:bg-bad/10 hover:text-bad disabled:opacity-50'><IconX size={16} /></button>
                </div>
                <div className='mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-line pt-3'>
                  <div className='flex min-w-0 flex-wrap items-center gap-2'>
                    <Button variant='ghost' size='sm' disabled={buying} onClick={() => onEdit(entry)}><IconPencil size={15} /> Sửa</Button>
                    <div className='w-36 max-w-full'>
                      <QuantityPicker compact value={entry.amount} max={Math.max(1, max)} disabled={buying || max < 1} onChange={(amount) => onQuantity(entry.lineId, amount)} />
                    </div>
                  </div>
                  <span className='flex items-center gap-1 text-xs font-bold text-coin tabular-nums'><Coin size={14} /> {formatNumber(entry.subtotal)}</span>
                </div>
                {entry.invalid && <p role='alert' className='mt-2 flex items-start gap-1.5 text-[11px] text-bad'><IconAlertTriangle size={14} className='shrink-0' /> {entry.invalid}</p>}
              </li>;
            })}
          </ul>
        )}
        {entries.length > 0 && <>
          <dl className='space-y-2 rounded-xl border border-line bg-bg p-3.5 text-xs'>
            <div className='flex items-center justify-between text-mute'><dt>Số dư hiện tại</dt><dd>{formatNumber(coins)}</dd></div>
            <div className='flex items-center justify-between text-mute'><dt>Sau khi mua</dt><dd className={shortage ? 'text-bad' : ''}>{shortage ? `Thiếu ${formatNumber(shortage)}` : formatNumber(coins - total)}</dd></div>
            <div className='flex items-center justify-between border-t border-line pt-2.5'><dt className='font-extrabold'>Tổng thanh toán</dt><dd className='flex items-center gap-1 text-lg font-extrabold text-coin'><Coin size={18} /> {formatNumber(total)}</dd></div>
          </dl>
          {invalid.length > 0 && <p className='flex items-start gap-2 text-[11px] text-bad'><IconAlertTriangle size={16} /> {invalid.length} dòng không hợp lệ. Hãy chỉnh sửa hoặc xóa chúng trước khi mua.</p>}
          {shortage > 0 && <Button variant='ghost' disabled={buying} onClick={onTopUp} className='w-full text-coin!'>Thiếu {formatNumber(shortage)} xu · Mua thêm</Button>}
          <Button requestAction className='w-full' loading={buying} disabled={!canBuy} onClick={onBuy}><IconShoppingCart size={17} /> Mua tất cả · {formatNumber(entries.length)} dòng</Button>
        </>}
      </div>
    </Dialog>
  );
};