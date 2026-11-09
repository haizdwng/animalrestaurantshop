import { IconAlertTriangle, IconMinus, IconPlus, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import Tile from '@/features/shop/Tile';
import { cartCount, cartTotal, clampCartQuantity } from '@/features/shop/cartUtils';

function CompactQuantity({ value, max, disabled, onChange }) {
  return (
    <div className='flex h-8 items-center overflow-hidden rounded-lg border border-line bg-bg'>
      <button type='button' aria-label='Giảm số lượng' disabled={disabled || value <= 1} onClick={() => onChange(value - 1)} className='grid size-8 cursor-pointer place-items-center text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30'>
        <IconMinus size={14} />
      </button>
      <input
        type='number'
        min={1}
        max={max}
        inputMode='numeric'
        aria-label='Số lượng vật phẩm'
        value={value}
        disabled={disabled}
        onChange={(event) => onChange(clampCartQuantity(event.target.value, false, max))}
        className='w-16 min-w-0 bg-transparent text-center text-xs font-bold tabular-nums outline-none disabled:opacity-70'
      />
      <button type='button' aria-label='Tăng số lượng' disabled={disabled || value >= max} onClick={() => onChange(value + 1)} className='grid size-8 cursor-pointer place-items-center text-mute hover:bg-raise hover:text-fg disabled:cursor-not-allowed disabled:opacity-30'>
        <IconPlus size={14} />
      </button>
    </div>
  );
};

export default function CartDialog({ open, entries, coins, ready, buying, onClose, onQuantity, onRemove, onClear, onBuy, onTopUp, maxQuantity = 100 }) {
  const total = cartTotal(entries);
  const short = Math.max(0, total - coins);
  const invalid = entries.filter((entry) => entry.invalid);
  const canBuy = entries.length > 0 && ready && !buying && invalid.length === 0 && short === 0;

  return (
    <Dialog open={open} title='Giỏ hàng' onClose={() => !buying && onClose()}>
      <div className='flex items-center justify-between gap-3'>
        <p className='text-[11px] text-mute'>
          {formatNumber(entries.length)} loại vật phẩm · {formatNumber(cartCount(entries))} sản phẩm
        </p>
        {entries.length > 0 && (
          <button type='button' disabled={buying} onClick={onClear} className='flex shrink-0 cursor-pointer items-center gap-1 text-[11px] font-bold text-mute transition hover:text-bad disabled:opacity-40'>
            <IconTrash size={14} /> Xóa tất cả
          </button>
        )}
      </div>

      {entries.length === 0 ? (
        <div className='flex flex-col items-center gap-2 rounded-xl border border-dashed border-line py-8 text-center text-xs text-mute'>
          <IconShoppingCart size={30} stroke={1.5} /> Chưa có vật phẩm nào trong giỏ.
        </div>
      ) : (
        <ul className='space-y-2'>
          {entries.map((entry) => (
            <li key={String(entry.id)} className={`rounded-xl border bg-bg p-3 ${entry.invalid ? 'border-bad/40' : 'border-line'}`}>
              <div className='flex items-start gap-3'>
                <Tile p={entry.product} />
                <div className='min-w-0 flex-1'>
                  <p className='truncate text-[10px] text-mute'>{entry.category}</p>
                  <p className='line-clamp-2 text-xs font-bold'>{entry.product.name}</p>
                  {typeof entry.product.description === 'string' && entry.product.description.trim() && (
                    <p className='mt-1 line-clamp-2 whitespace-pre-line wrap-break-word text-[11px] leading-relaxed text-mute' title={entry.product.description.trim()}>{entry.product.description.trim()}</p>
                  )}
                  <p className='mt-1 flex items-center gap-1 text-[11px] text-coin'>
                    <Coin size={13} /> {formatNumber(entry.price)} / cái
                  </p>
                </div>
                <button type='button' aria-label={`Xóa ${entry.product.name} khỏi giỏ`} title='Xóa vật phẩm' disabled={buying} onClick={() => onRemove(entry.id)} className='grid size-7 shrink-0 cursor-pointer place-items-center rounded-lg text-mute hover:bg-bad/10 hover:text-bad disabled:opacity-40'>
                  <IconX size={16} />
                </button>
              </div>
              <div className='mt-2.5 flex items-center justify-between gap-2 border-t border-line pt-2.5'>
                {entry.product.once ? (
                  <span className='rounded-lg border border-line bg-raise px-2.5 py-1.5 text-[11px] font-medium text-mute'>Chỉ mua một lần</span>
                ) : (
                  <CompactQuantity value={entry.quantity} max={maxQuantity} disabled={buying || !ready} onChange={(value) => onQuantity(entry.id, value)} />
                )}
                <span className='flex items-center gap-1 text-xs font-bold text-coin tabular-nums'>
                  <Coin size={14} /> {formatNumber(entry.total)}
                </span>
              </div>
              {entry.invalid && <p className='mt-2 flex items-center gap-1.5 text-[11px] text-bad'><IconAlertTriangle size={14} /> {entry.invalid}</p>}
            </li>
          ))}
        </ul>
      )}

      {entries.length > 0 && (
        <>
          <dl className='space-y-2 rounded-xl border border-line bg-bg p-3.5 text-xs'>
            <div className='flex items-center justify-between text-mute'><dt>Số dư hiện tại</dt><dd className='tabular-nums'>{formatNumber(coins)}</dd></div>
            <div className='flex items-center justify-between text-mute'><dt>Số dư sau khi mua</dt><dd className={`tabular-nums ${short ? 'text-bad' : ''}`}>{short ? `Thiếu ${formatNumber(short)}` : formatNumber(coins - total)}</dd></div>
            <div className='flex items-center justify-between border-t border-line pt-2.5'>
              <dt className='font-extrabold'>Tổng thanh toán</dt>
              <dd className='flex items-center gap-1.5 text-lg font-extrabold text-coin tabular-nums'><Coin size={18} /> {formatNumber(total)}</dd>
            </div>
          </dl>
          {!ready && <p className='rounded-lg bg-raise p-2.5 text-[11px] text-mute'>Đang tải hoặc kiểm tra dữ liệu cửa hàng. Vui lòng tải lại trước khi mua.</p>}
          {invalid.length > 0 && (
            <p className='flex items-start gap-2 rounded-lg bg-bad/10 p-3 text-[11px] text-bad'>
              <IconAlertTriangle size={16} className='shrink-0' /> Giỏ có {invalid.length} vật phẩm chưa hợp lệ. Hãy xóa hoặc điều chỉnh trước khi mua.
            </p>
          )}
          {short > 0 && (
            <Button variant='ghost' className='w-full text-coin!' disabled={buying} onClick={onTopUp}>
              <Coin size={16} /> Thiếu {formatNumber(short)} xu — Mua thêm
            </Button>
          )}
          <Button className='w-full' disabled={!canBuy} loading={buying} onClick={onBuy}>
            <IconShoppingCart size={17} /> Mua tất cả · {formatNumber(entries.length)} loại vật phẩm
          </Button>
        </>
      )}
    </Dialog>
  );
};