import { IconAlertTriangle, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import Tile from '@/features/shop/Tile';
import QuantityPicker from '@/features/shop/QuantityPicker';
import { cartCount, cartTotal, getGroupRemaining, isOnce } from '@/features/shop/cartUtils';

export default function CartDialog({ open, entries, coins, ready, buying, onClose, onQuantity, onRemove, onClear, onBuy, onTopUp }) {
  const total = cartTotal(entries);
  const shortage = Math.max(0, total - coins);
  const invalid = entries.filter((entry) => entry.invalid);
  const canBuy = entries.length > 0 && ready && !buying && invalid.length === 0 && shortage === 0 && Number.isSafeInteger(total);

  return (
    <Dialog open={open} title='Giỏ hàng' onClose={() => !buying && onClose()}>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-[11px] text-mute'>{formatNumber(entries.length)} loại · {formatNumber(cartCount(entries))} vật phẩm</p>
        {entries.length > 0 && <Button variant='quiet' size='sm' disabled={buying} onClick={onClear} className='text-bad!'><IconTrash size={14} /> Xóa tất cả</Button>}
      </div>
      {entries.length === 0 ? (
        <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-8 text-center text-xs text-mute'><IconShoppingCart size={30} stroke={1.5} /> Chưa có vật phẩm nào trong giỏ.</div>
      ) : (
        <ul className='space-y-2'>
          {entries.map((entry) => {
            const once = isOnce(entry.product, entry.group);
            const remaining = getGroupRemaining(entries, entry.group, entry.key);
            const limit = Math.max(1, Math.min(entry.limit, remaining));
            return (
              <li key={entry.key} className={`rounded-xl border bg-bg p-3 ${entry.invalid ? 'border-bad/40' : 'border-line'}`}>
                <div className='flex items-start gap-3'>
                  <Tile p={entry.product} />
                  <div className='min-w-0 flex-1'>
                    <p className='truncate text-[10px] text-mute'>{entry.category}{entry.group.key !== entry.key ? ` · ${entry.group.name || entry.group.key}` : ''}</p>
                    <p className='line-clamp-2 text-xs font-bold'>{entry.product.name || entry.product.key}</p>
                    <p className='mt-0.5 truncate text-[10px] text-mute'>{entry.key}</p>
                    <p className='mt-1 flex items-center gap-1 text-[11px] text-coin'><Coin size={13} /> {formatNumber(entry.price)} / vật phẩm</p>
                  </div>
                  <button type='button' aria-label={`Xóa ${entry.product.name || entry.key} khỏi giỏ`} title='Xóa khỏi giỏ' disabled={buying} onClick={() => onRemove(entry.key)} className='grid size-8 shrink-0 cursor-pointer place-items-center rounded-lg text-mute transition hover:bg-bad/10 hover:text-bad focus-visible:outline-2 focus-visible:outline-lime disabled:opacity-40'><IconX size={16} /></button>
                </div>
                <div className='mt-3 flex items-center justify-between gap-2 border-t border-line pt-3'>
                  {once ? (
                    <span className='text-[11px] text-mute'>Chỉ mua một lần</span>
                  ) : limit === 1 ? (
                    <span className='text-[11px] text-mute'>Mỗi lần mua 1</span>
                  ) : (
                    <QuantityPicker compact value={entry.amount} max={limit} disabled={buying || !ready} onChange={(value) => onQuantity(entry.key, value)} />
                  )}
                  <span className='flex items-center gap-1 text-xs font-bold text-coin tabular-nums'><Coin size={14} /> {formatNumber(entry.total)}</span>
                </div>
                {entry.invalid && <p role='alert' className='mt-2 flex items-start gap-1.5 text-[11px] text-bad'><IconAlertTriangle size={14} className='mt-0.5 shrink-0' /> {entry.invalid}</p>}
              </li>
            );
          })}
        </ul>
      )}
      {entries.length > 0 && (
        <>
          <dl className='space-y-2 rounded-xl border border-line bg-bg p-3.5 text-xs'>
            <div className='flex items-center justify-between text-mute'><dt>Số dư hiện tại</dt><dd className='tabular-nums'>{formatNumber(coins)}</dd></div>
            <div className='flex items-center justify-between text-mute'><dt>Sau khi mua</dt><dd className={`tabular-nums ${shortage ? 'text-bad' : ''}`}>{shortage ? `Thiếu ${formatNumber(shortage)}` : formatNumber(coins - total)}</dd></div>
            <div className='flex items-center justify-between border-t border-line pt-2.5'><dt className='font-extrabold'>Tổng thanh toán</dt><dd className='flex items-center gap-1.5 text-lg font-extrabold text-coin tabular-nums'><Coin size={18} /> {formatNumber(total)}</dd></div>
          </dl>
          {!ready && <p className='rounded-lg border border-line bg-raise p-3 text-[11px] text-mute'>Cửa hàng chưa sẵn sàng, vui lòng kiểm tra lại.</p>}
          {invalid.length > 0 && <p role='alert' className='flex items-start gap-2 rounded-lg border border-bad/30 bg-bad/10 p-3 text-[11px] text-bad'><IconAlertTriangle size={16} className='shrink-0' /> {invalid.length} vật phẩm chưa hợp lệ; hãy điều chỉnh trước khi mua.</p>}
          {shortage > 0 && <Button variant='ghost' className='w-full text-coin!' disabled={buying} onClick={onTopUp}><Coin size={16} /> Thiếu {formatNumber(shortage)} xu · Mua thêm</Button>}
          <Button className='w-full' disabled={!canBuy} loading={buying} onClick={onBuy}><IconShoppingCart size={17} /> Mua tất cả · {formatNumber(entries.length)} loại</Button>
        </>
      )}
    </Dialog>
  );
};