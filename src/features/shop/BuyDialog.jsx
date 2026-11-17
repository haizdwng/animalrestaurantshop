import { useEffect, useId, useState } from 'react';
import { IconCheck, IconLock, IconShoppingCart, IconTrash, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog, Select } from '@/shared/components/ui';
import { clampCartQuantity, getConditions, getPurchaseLimit, getGroupRemaining, hasOptions, hasValidPrice, isOnce, isOwnedOnce, productOptions, unmetConditions, optionMode, getTimeStatus, getTimeMessage, formatShopDate } from '@/features/shop/cartUtils';
import QuantityPicker from '@/features/shop/QuantityPicker';
import Tile from '@/features/shop/Tile';

export default function BuyDialog({ item, category, user, entries = [], cartTotal = 0, maxQuantity = 100, now = Date.now(), conflictingKeys = new Set(), onAdd, onRemove, onClose, onTopUp }) {
  const variantSelectId = useId();
  const options = item ? productOptions(item) : [];
  const [selectedKey, setSelectedKey] = useState(() => (optionMode(item) === 'singleOptions' ? options.find((option) => option.owned === true) : options.find((option) => !isOwnedOnce(option, item)))?.key || options[0]?.key || '');
  const [amount, setAmount] = useState(1);
  const selected = options.find((option) => option.key === selectedKey) || options[0];
  const selectedInCart = entries.find((entry) => entry.key === selected?.key);
  const cartAmount = selectedInCart?.amount || 0;
  const once = isOnce(selected, item);
  const ownedOnce = isOwnedOnce(selected, item);
  const conflict = conflictingKeys.has(selected?.key);
  const blockedByConditions = unmetConditions(selected, item);
  const time = getTimeStatus(selected, item, now);
  const timeMessage = getTimeMessage(selected, item, now);
  const available = !ownedOnce && !conflict && !blockedByConditions && time.available && hasValidPrice(selected);
  const conditions = selected ? getConditions(selected, item) : [];
  const mode = optionMode(item);
  const exclusive = mode === 'singleOptions' || (mode === 'multipleOptions' && item.limit === 1);
  const groupRoom = exclusive ? (Number.isSafeInteger(item.limit) ? item.limit : Infinity) : getGroupRemaining(entries, item, selected?.key);
  const limit = selected ? Math.min(getPurchaseLimit(selected, item, maxQuantity), groupRoom) : 0;
  const quantity = once ? 1 : clampCartQuantity(amount, Math.max(1, limit));
  const total = hasValidPrice(selected) ? selected.price * quantity : 0;
  const replaced = exclusive ? entries.filter((entry) => entry.groupKey === item.key && entry.key !== selected?.key) : [];
  const replacedTotal = replaced.reduce((sum, entry) => sum + entry.total, 0);
  const nextCartTotal = cartTotal - (selectedInCart?.total || 0) - replacedTotal + total;
  const shortage = Math.max(0, nextCartTotal - (user?.coins || 0));

  useEffect(() => {
    setAmount(clampCartQuantity(cartAmount || 1, Math.max(1, limit)));
  }, [selectedKey, cartAmount, limit]);

  const add = () => {
    if (!selected || !available || limit < 1) return;
    onAdd(selected, quantity, category, item);
    onClose();
  };
  const remove = () => {
    if (!cartAmount || !selected) return;
    onRemove(selected.key);
    onClose();
  };

  return (
    <Dialog open={!!item} title={cartAmount ? 'Cập nhật giỏ hàng' : 'Chi tiết vật phẩm'} onClose={onClose}>
      {item && selected && (
        <>
          <div className='flex items-center gap-3'>
            <Tile p={item} size='lg' />
            <div className='min-w-0 flex-1'>
              <p className='text-[11px] text-mute'>{category}</p>
              <p className='text-base leading-tight font-extrabold'>{item.name || item.key}</p>
              <p className='mt-1 truncate text-[11px] text-mute' title={item.key}>{item.key}</p>
              {typeof item.owned === 'string' && item.owned && <p className='mt-1 text-[11px] text-coin'>Đang chọn: {item.owned}</p>}
              {typeof item.owned === 'number' && <p className='mt-1 text-[11px] text-mute'>Đã có: {formatNumber(item.owned)}</p>}
            </div>
          </div>

          {hasOptions(item) && (
            <div className='space-y-1.5'>
              <label htmlFor={variantSelectId} className='block text-[11px] font-medium text-mute'>
                {mode === 'singleOptions' ? 'Chọn một lựa chọn duy nhất' : 'Chọn một loại để thêm vào giỏ'}
              </label>
              <Select id={variantSelectId} label='Lựa chọn vật phẩm' value={selected.key} onChange={setSelectedKey} className='h-11! w-full! bg-bg!'>
                {options.map((option) => (
                  <option key={option.key} value={option.key}>
                    {option.name || option.key}{typeof option.owned === 'number' ? ` · có ${formatNumber(option.owned)}` : option.owned === true && isOnce(option, item) ? ' · đã sở hữu' : option.owned === true ? ' · đang dùng' : ''}
                  </option>
                ))}
              </Select>
              <p className='text-[11px] text-mute'>
                {mode === 'singleOptions' ? 'Chỉ một lựa chọn trong nhóm được giữ trong mỗi đơn. Chọn loại khác sẽ thay thế loại trước đó.' : 'Có thể thêm nhiều loại khác nhau vào cùng đơn hàng, trong giới hạn số lượng của nhóm.'}
              </p>
            </div>
          )}

          <div className='flex items-center justify-between rounded-xl border border-line bg-bg p-3 text-xs'>
            <div className='min-w-0'>
              <p className='truncate font-bold' title={selected.key}>{selected.name || selected.key}</p>
              <p className='mt-0.5 truncate text-[10px] text-mute'>{selected.key}</p>
            </div>
            <p className='flex shrink-0 items-center gap-1 font-extrabold tabular-nums text-coin'><Coin size={15} /> {hasValidPrice(selected) ? formatNumber(selected.price) : '—'}</p>
          </div>

          {(item.startTime !== undefined || item.endTime !== undefined || selected.startTime !== undefined || selected.endTime !== undefined) && (
            <div className={`space-y-1 rounded-xl border p-3 text-[11px] ${time.available ? 'border-line bg-bg text-mute' : 'border-coin/40 bg-coin/10 text-coin'}`}>
              <p className='font-bold text-fg'>Thời gian mở bán</p>
              {(selected.startTime !== undefined || item.startTime !== undefined) && <p>Bắt đầu: {Number.isSafeInteger(Math.max(selected.startTime ?? 0, item.startTime ?? 0)) ? formatShopDate(Math.max(selected.startTime ?? 0, item.startTime ?? 0)) : 'Không hợp lệ'}</p>}
              {(selected.endTime !== undefined || item.endTime !== undefined) && <p>Kết thúc: {Number.isSafeInteger(Math.min(selected.endTime ?? Infinity, item.endTime ?? Infinity)) ? formatShopDate(Math.min(selected.endTime ?? Infinity, item.endTime ?? Infinity)) : 'Không hợp lệ'}</p>}
              {timeMessage && <p className='font-semibold'>{timeMessage}</p>}
            </div>
          )}

          {typeof selected.owned === 'number' && <p className='text-[11px] text-mute'>Số lượng đang có: {formatNumber(selected.owned)}</p>}
          {selected.owned === true && !once && <p className='rounded-lg border border-line bg-bg px-3 py-2 text-[11px] text-mute'>Đã sở hữu hoặc đang sử dụng. Bạn vẫn có thể mua tiếp vì vật phẩm này không giới hạn một lần.</p>}

          {conditions.length > 0 && (
            <div className='space-y-2 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Điều kiện mua</p>
              <ul className='space-y-2'>
                {conditions.map(({ name, already }, index) => (
                  <li key={`${name}-${index}`} className='flex items-start gap-2 text-xs'>
                    {already ? <IconCheck size={16} className='mt-0.5 shrink-0 text-ok' /> : <IconX size={16} className='mt-0.5 shrink-0 text-bad' />}
                    <span className={already ? 'text-mute' : 'text-fg'}>{name}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {conflict && <p role='alert' className='rounded-lg border border-bad/40 bg-bad/10 p-3 text-xs text-bad'>Mã vật phẩm xuất hiện với cấu hình khác nhau ở nhiều danh mục. Backend hiện không cho mua mã này.</p>}
          {ownedOnce && <p className='rounded-lg border border-ok/30 bg-ok/10 p-3 text-xs text-ok'>Vật phẩm đã sở hữu và chỉ được mua một lần.</p>}
          {limit < 1 && <p className='rounded-lg border border-bad/30 bg-bad/10 p-3 text-xs text-bad'>Đã đạt giới hạn số lượng của nhóm trong giỏ hàng.</p>}

          {once ? (
            <div className='flex items-center gap-2 rounded-lg border border-line bg-bg px-3 py-2.5 text-[11px] text-mute'><IconLock size={15} /> Chỉ được sở hữu một lần</div>
          ) : limit === 1 ? (
            <p className='rounded-lg border border-line bg-bg px-3 py-2.5 text-[11px] text-mute'>Mỗi lần mua tối đa 1 vật phẩm. Có thể mua lại ở lần tiếp theo.</p>
          ) : (
            <QuantityPicker value={quantity} max={Math.max(1, limit)} disabled={!available || limit < 1} onChange={setAmount} onEnter={add} />
          )}

          <div className='flex items-center justify-between rounded-xl border border-line bg-bg px-4 py-3'>
            <span className='text-xs font-bold'>Thành tiền</span>
            <span className='flex items-center gap-1 text-lg font-extrabold tabular-nums text-coin'><Coin size={18} /> {formatNumber(total)}</span>
          </div>
          {shortage > 0 && available && (
            <div className='flex items-center justify-between gap-2 rounded-lg border border-coin/30 bg-coin/10 p-3 text-[11px]'>
              <span className='text-coin'>Thiếu {formatNumber(shortage)} xu</span>
              <button type='button' onClick={onTopUp} className='cursor-pointer font-bold text-coin underline underline-offset-2'>Mua xu</button>
            </div>
          )}
          <div className={`grid gap-2 ${cartAmount > 0 && !once ? 'grid-cols-2' : ''}`}>
            {cartAmount > 0 && <Button variant='ghost' className='w-full text-bad!' onClick={remove}><IconTrash size={16} /> Xóa khỏi giỏ</Button>}
            {(!once || cartAmount === 0) && (
              <Button className='w-full' disabled={!available || limit < 1} onClick={add}>
                {available ? <IconShoppingCart size={16} /> : <IconLock size={16} />}
                {ownedOnce ? 'Đã mua' : conflict ? 'Mã không hợp lệ' : blockedByConditions ? 'Chưa đủ điều kiện' : !time.available ? 'Ngoài thời gian bán' : !hasValidPrice(selected) ? 'Không có giá' : limit < 1 ? 'Đã đủ số lượng' : cartAmount ? 'Cập nhật giỏ' : 'Thêm vào giỏ'}
              </Button>
            )}
          </div>
        </>
      )}
    </Dialog>
  );
};