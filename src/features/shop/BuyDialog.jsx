import { useEffect, useState } from 'react';
import { IconCheck, IconLock, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog } from '@/shared/components/ui';
import { hasPrice } from '@/features/shop/shopUtilities';
import { clampCartQuantity, hasOptions, isOnce, isOwnedOnce, productOptions, unmetConditions } from '@/features/shop/cartUtils';
import QuantityPicker from '@/features/shop/QuantityPicker';
import Tile from '@/features/shop/Tile';

export default function BuyDialog({ item, category, user, cartQuantities = new Map(), cartTotal = 0, maxQuantity = 100, onAdd, onRemove, onClose, onTopUp }) {
  const options = item ? productOptions(item) : [];
  const [selectedKey, setSelectedKey] = useState(() => options.find((option) => !isOwnedOnce(option, item))?.key || options[0]?.key || '');
  const [quantity, setQuantity] = useState(1);
  const selected = options.find((option) => option.key === selectedKey) || options[0];
  const amountInCart = selected ? cartQuantities.get(selected.key) || 0 : 0;
  const once = isOnce(selected, item);
  const owned = isOwnedOnce(selected, item);
  const conditions = [
    ...(Array.isArray(item?.conditions) ? item.conditions : []),
    ...(selected !== item && Array.isArray(selected?.conditions) ? selected.conditions : [])
  ];
  const blocked = owned || unmetConditions(selected, item);
  const priced = hasPrice(selected);
  const amount = once ? 1 : quantity;
  const subtotal = priced ? selected.price * amount : 0;
  const newCartTotal = cartTotal - (priced ? selected.price * amountInCart : 0) + subtotal;
  const shortage = Math.max(0, newCartTotal - Number(user?.coins || 0));

  useEffect(() => {
    setQuantity(clampCartQuantity(amountInCart || 1, once, maxQuantity));
  }, [selectedKey, amountInCart, once, maxQuantity]);

  const add = () => {
    if (!item || !selected || !priced || blocked) return;
    onAdd(selected, amount, category, item);
    onClose();
  };
  const remove = () => {
    if (!amountInCart || !selected) return;
    onRemove(selected.key);
    onClose();
  };

  return (
    <Dialog open={!!item} title={amountInCart ? once ? 'Vật phẩm đã thêm' : 'Chỉnh sửa vật phẩm' : 'Thêm vào giỏ hàng'} onClose={onClose}>
      {item && selected && (
        <>
          <div className='flex items-center gap-3'>
            <Tile p={item} size='lg' />
            <div className='min-w-0'>
              <p className='text-[10px] text-mute'>{category}</p>
              <p className='text-base leading-tight font-extrabold'>{item.name || item.key}</p>
              <p className='mt-1 text-[11px] text-mute'>{item.key}</p>
              {item.owned !== undefined && (
                <p className='mt-1 text-[11px] text-mute'>
                  {typeof item.owned === 'number' ? `Đang có: ${formatNumber(item.owned)}` : typeof item.owned === 'string' && item.owned ? `Hiện tại: ${item.owned}` : item.once && item.owned === true ? 'Đã sở hữu' : ''}
                </p>
              )}
            </div>
          </div>

          {hasOptions(item) && (
            <div className='space-y-2'>
              <label htmlFor='shop-variant' className='text-[11px] font-bold'>Chọn loại vật phẩm</label>
              <select id='shop-variant' value={selected.key} onChange={(event) => setSelectedKey(event.target.value)}
                className='h-11 w-full min-w-0 rounded-lg border border-line bg-bg px-3 text-xs text-fg outline-none focus:border-lime'>
                {options.map((option) => (
                  <option key={option.key} value={option.key}>{option.name || option.key}{option.owned === true && isOnce(option, item) ? ' · Đã mua' : typeof option.owned === 'number' ? ` · Có ${formatNumber(option.owned)}` : option.owned === true ? ' · Đang chọn' : ''}</option>
                ))}
              </select>
              <div className='flex flex-wrap items-center justify-between gap-2 rounded-lg bg-bg px-3 py-2 text-[11px]'>
                <span className='min-w-0 text-mute'>{selected.key}</span>
                <span className='font-bold text-coin'>{priced ? formatNumber(selected.price) + ' xu' : 'Không có giá'}</span>
              </div>
            </div>
          )}

          {typeof selected.owned === 'number' && <p className='text-[11px] text-mute'>Số lượng đang có: {formatNumber(selected.owned)}</p>}
          {conditions.length > 0 && (
            <div className='space-y-2 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Điều kiện</p>
              <ul className='space-y-2'>
                {conditions.map((condition, index) => {
                  const satisfied = condition?.already === true;
                  return <li key={`${condition?.name || 'condition'}-${index}`} className='flex items-start gap-2 text-xs'>
                    {satisfied ? <IconCheck size={16} stroke={2.6} className='mt-0.5 shrink-0 text-ok' /> : <IconX size={16} stroke={2.6} className='mt-0.5 shrink-0 text-bad' />}
                    <span className={satisfied ? 'text-mute' : 'text-fg'}>{condition?.name || 'Điều kiện chưa được mô tả'}</span>
                  </li>;
                })}
              </ul>
            </div>
          )}
          {owned && <p className='rounded-lg bg-ok/10 p-3 text-xs text-ok'>Vật phẩm này đã được sở hữu.</p>}
          {once ? <p className='flex items-center gap-2 rounded-lg border border-dashed border-line p-3 text-[11px] text-mute'><IconLock size={15} /> Vật phẩm chỉ mua được một lần</p>
            : <QuantityPicker value={quantity} max={maxQuantity} disabled={blocked} onChange={setQuantity} onEnter={add} />}

          <dl className='rounded-xl bg-bg p-4 text-xs'>
            <div className='flex items-center justify-between'>
              <dt className='font-bold'>Thành tiền</dt>
              <dd className='flex items-center gap-1.5 text-lg font-extrabold tabular-nums text-coin'><Coin size={18} /> {formatNumber(subtotal)}</dd>
            </div>
          </dl>
          {shortage > 0 && !blocked && (
            <div className='flex items-center justify-between gap-2 rounded-lg border border-coin/30 bg-coin/10 px-3 py-2 text-[11px]'>
              <span className='text-coin'>Giỏ hàng sẽ thiếu {formatNumber(shortage)} xu</span>
              <button type='button' onClick={onTopUp} className='shrink-0 cursor-pointer font-bold text-coin underline underline-offset-2'>Mua thêm xu</button>
            </div>
          )}
          <div className={`grid gap-2 ${amountInCart > 0 && !once ? 'grid-cols-2' : ''}`}>
            {amountInCart > 0 && <Button variant='ghost' className='w-full px-2! text-[11px]! text-bad!' onClick={remove}><IconTrash size={16} /> Xóa khỏi giỏ</Button>}
            {(!once || !amountInCart) && (
              <Button className='w-full px-2! text-[11px]!' disabled={blocked || !priced} onClick={add}>
                {blocked ? <IconLock size={16} /> : <IconShoppingCart size={16} />}
                {owned ? 'Đã sở hữu' : blocked ? 'Chưa đủ điều kiện' : !priced ? 'Không thể mua' : amountInCart ? 'Cập nhật giỏ hàng' : 'Thêm vào giỏ hàng'}
              </Button>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};