import { useState } from 'react';
import { IconCheck, IconLock, IconX } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Dialog, toast, toastError } from '@/shared/components/ui';
import { hasPrice } from '@/features/shop/shopUtilities';
import QuantityPicker from '@/features/shop/QuantityPicker';
import Tile from '@/features/shop/Tile';
import * as api from '@/shared/library/api';

const ALREADY_OWNED = /đã (mua|sở hữu|có)|already/i;

export default function BuyDialog({ item, category, user, onUser, onOwned, onBought, onClose, onTopUp }) {
  const [qty, setQty] = useState(1);
  const [buying, setBuying] = useState(false);

  const once = !!item?.once;
  const priced = hasPrice(item);
  const conditions = Array.isArray(item?.conditions) ? item.conditions : [];
  const blocked = conditions.some((condition) => condition?.already === false);
  const hasCurrent = item?.current !== undefined && item?.current !== null;
  const maxQty = once ? 1 : item ? Math.max(1, priced && item.price > 0 ? Math.min(api.MAX_QTY, Math.floor(user.coins / item.price)) : api.MAX_QTY) : 1;
  const total = priced ? item.price * qty : 0;
  const short = priced ? total - user.coins : 0;

  const confirm = async () => {
    if (buying || blocked || short > 0) return;
    setBuying(true);
    try {
      const response = await api.buy(item.id, once ? 1 : qty);
      if (response.user) onUser(response.user);
      if (once) onOwned(item.id);
      toast(response.message || (once ? `Đã mua ${item.name}` : `Đã mua ${qty} × ${item.name}`));
      onBought?.();
      onClose();
    } catch (error) {
      if (once && ALREADY_OWNED.test(error.message)) {
        onOwned(item.id);
        onClose();
      };
      toastError(error);
    } finally {
      setBuying(false);
    };
  };

  return (
    <Dialog open={!!item} title='Mua vật phẩm' onClose={() => !buying && onClose()}>
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
                    · <Coin size={12} /> <span className='text-coin'>{formatNumber(item.price)}</span> / cái
                  </>
                )}
              </p>
            </div>
          </div>

          {hasCurrent && (
            <div className='flex items-center justify-between rounded-lg border border-line bg-bg px-3 py-2.5 text-xs'>
              <span className='text-mute'>Số lượng đã có</span>
              <strong className='tabular-nums'>{formatNumber(Number(item.current) || 0)}</strong>
            </div>
          )}

          {conditions.length > 0 && (
            <div className='space-y-2 rounded-xl border border-line bg-bg p-3'>
              <p className='text-[11px] font-bold'>Điều kiện mua hàng</p>
              <ul className='space-y-2'>
                {conditions.map((condition, index) => {
                  const satisfied = condition?.already === true;
                  return (
                    <li key={`${condition?.name || 'condition'}-${index}`} className='flex items-start gap-2 text-xs'>
                      {satisfied ? (
                        <IconCheck size={16} stroke={2.6} className='mt-0.5 shrink-0 text-ok' />
                      ) : (
                        <IconX size={16} stroke={2.6} className='mt-0.5 shrink-0 text-bad' />
                      )}
                      <span className={satisfied ? 'text-mute' : 'text-fg'}>{condition?.name || 'Điều kiện chưa được mô tả'}</span>
                    </li>
                  );
                })}
              </ul>
              {blocked && (
                <p className='rounded-lg bg-bad/10 px-3 py-2 text-[11px] font-medium text-bad'>
                  Bạn chưa đáp ứng đủ điều kiện để mua vật phẩm này.
                </p>
              )}
            </div>
          )}

          {once ? (
            <p className='flex items-center gap-2 rounded-lg border border-dashed border-line p-3 text-[11px] text-mute'>
              <IconLock size={15} className='shrink-0 text-lime' /> Vật phẩm chỉ mua được một lần
            </p>
          ) : (
            <QuantityPicker value={qty} max={maxQty} disabled={buying || blocked} onChange={setQty} onEnter={confirm} />
          )}

          <dl className='space-y-2 rounded-xl bg-bg p-4 text-xs'>
            <div className='flex justify-between text-mute'>
              <dt>Số dư hiện tại</dt>
              <dd className='tabular-nums'>{formatNumber(user.coins)}</dd>
            </div>
            {priced && (
              <>
                <div className='flex justify-between text-mute'>
                  <dt>Số dư sau khi mua</dt>
                  <dd className={`tabular-nums ${short > 0 ? 'text-bad' : ''}`}>
                    {short > 0 ? `Thiếu ${formatNumber(short)}` : formatNumber(user.coins - total)}
                  </dd>
                </div>
                <div className='flex items-center justify-between border-t border-line pt-2'>
                  <dt className='font-bold'>Tổng</dt>
                  <dd className={`flex items-center gap-1.5 text-lg font-extrabold tabular-nums ${short > 0 ? 'text-bad' : 'text-coin'}`}>
                    <Coin size={18} /> {formatNumber(total)}
                  </dd>
                </div>
              </>
            )}
          </dl>

          {blocked ? (
            <Button className='w-full' disabled>
              <IconLock size={16} /> Chưa đủ điều kiện mua
            </Button>
          ) : short > 0 ? (
            <Button className='w-full bg-coin!' onClick={onTopUp}>
              <Coin size={16} /> Không đủ xu — Mua thêm
            </Button>
          ) : (
            <Button className='w-full' loading={buying} onClick={confirm}>
              <IconCheck size={16} stroke={2.6} /> Xác nhận mua
            </Button>
          )}
          {buying && <p className='text-center text-[11px] text-mute'>Đang xử lý…</p>}
        </>
      )}
    </Dialog>
  );
};