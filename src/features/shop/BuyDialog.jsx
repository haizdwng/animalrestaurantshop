import { useState } from 'react';
import { IconCheck, IconLock, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import { hasPrice } from '@/features/shop/shopUtilities';
import QuantityPicker from '@/features/shop/QuantityPicker';
import Tile from '@/features/shop/Tile';
import { clampCartQuantity } from '@/features/shop/cartUtils';

export default function BuyDialog({ item, category, user, cartQuantity = 0, cartTotal = 0, maxQuantity = 100, onAdd, onRemove, onClose, onTopUp }) {
  const [qty, setQty] = useState(() => clampCartQuantity(cartQuantity || 1, item?.once, maxQuantity));
  const description = typeof item?.description === 'string' ? item.description.trim() : '';
  const once = !!item?.once;
  const priced = hasPrice(item);
  const conditions = Array.isArray(item?.conditions) ? item.conditions : [];
  const blocked = conditions.some((condition) => condition?.already === false);
  const hasCurrent = item?.current !== undefined && item?.current !== null;
  const maxQty = once ? 1 : maxQuantity;
  const total = priced ? item.price * qty : 0;
  const newCartTotal = cartTotal - (priced ? item.price * cartQuantity : 0) + total;
  const short = Math.max(0, newCartTotal - user.coins);
  const remove = () => {
    if (!item || !cartQuantity) return;
    onRemove(item.id);
    onClose();
  };
  const add = () => {
    if (!item || blocked) return;
    onAdd(item, once ? 1 : qty, category);
    onClose();
  };

  return (
    <Dialog open={!!item} title={cartQuantity ? once ? 'Vật phẩm đã thêm' : 'Chỉnh sửa vật phẩm' : 'Thêm vào giỏ hàng'} onClose={onClose}>
      {item && (
        <>
          <div className='flex items-center gap-3'>
            <Tile p={item} size='lg' />
            <div className='min-w-0'>
              <p className='text-[10px] text-mute'>{category}</p>
              <p className='text-base leading-tight font-extrabold'>{item.name}</p>
              <p className='mt-1 flex items-center gap-1.5 text-[11px] text-mute'>
                {item.id}
                {priced && (
                  <>
                    · <Coin size={12} /> <span className='text-coin'>{formatNumber(item.price)}</span>{!once &&  ' / cái'}
                  </>
                )}
              </p>
            </div>
          </div>

          {description && (
            <div className='rounded-xl border border-line bg-bg p-3'>
              <p className='mb-1.5 text-[11px] font-bold'>Mô tả vật phẩm</p>
              <p className='whitespace-pre-wrap wrap-break-word text-xs leading-relaxed text-mute'>{description}</p>
            </div>
          )}

          {hasCurrent && (
            <div className='flex items-center justify-between rounded-lg border border-line bg-bg px-3 py-2.5 text-xs'>
              <span className='text-mute'>Đã có</span>
              <strong className='tabular-nums'>{formatNumber(Number(item.current) || 0)}</strong>
            </div>
          )}

          {conditions.length > 0 && (
            <div className='space-y-2 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Điều kiện</p>
              <ul className='space-y-2'>
                {conditions.map((condition, index) => {
                  const satisfied = condition?.already === true;
                  return (
                    <li key={`${condition?.name || 'condition'}-${index}`} className='flex items-start gap-2 text-xs'>
                      {satisfied ? <IconCheck size={16} stroke={2.6} className='mt-0.5 shrink-0 text-ok' /> : <IconX size={16} stroke={2.6} className='mt-0.5 shrink-0 text-bad' />}
                      <span className={satisfied ? 'text-mute' : 'text-fg'}>{condition?.name || 'Điều kiện chưa được mô tả'}</span>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}

          {!once && (
            <QuantityPicker value={qty} max={maxQty} disabled={blocked} onChange={setQty} onEnter={add} />
          )}

          <dl className='space-y-2 rounded-xl bg-bg p-4 text-xs'>
            <div className='flex items-center justify-between'>
              <dt className='font-bold'>Tổng số xu</dt>
              <dd className='flex items-center gap-1.5 text-lg font-extrabold tabular-nums text-coin'>
                <Coin size={18} /> {formatNumber(total)}
              </dd>
            </div>
          </dl>

          {short > 0 && (
            <div className='flex items-center justify-between gap-2 rounded-lg border border-coin/30 bg-coin/10 px-3 py-2 text-[11px]'>
              <span className='text-coin'>Giỏ hàng sẽ thiếu {formatNumber(short)} xu</span>
              <button type='button' onClick={onTopUp} className='shrink-0 cursor-pointer font-bold text-coin underline underline-offset-2'>Mua thêm xu</button>
            </div>
          )}
          <div className={`grid gap-2 ${cartQuantity && !once ? 'grid-cols-2' : ''}`}>
            {cartQuantity > 0 && (
              <Button variant='ghost' className='w-full px-2! text-[11px]! text-bad!' onClick={remove}>
                <IconTrash size={16} /> Xóa khỏi giỏ hàng
              </Button>
            )}
            {(!once || !cartQuantity) && (
              <Button className='w-full px-2! text-[11px]!' disabled={blocked} onClick={add}>
                {blocked ? <IconLock size={16} /> : <IconShoppingCart size={16} />}
                {blocked ? 'Chưa đủ điều kiện' : cartQuantity ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};