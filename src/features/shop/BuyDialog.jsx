import { useState } from 'react';
import { IconCheck, IconLock } from '@tabler/icons-react';
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
  const maxQty = once ? 1 : item ? Math.max(1, priced && item.price > 0 ? Math.min(api.MAX_QTY, Math.floor(user.coins / item.price)) : api.MAX_QTY) : 1;
  const total = priced ? item.price * qty : 0;
  const short = priced ? total - user.coins : 0;

  const confirm = async () => {
    if (buying || short > 0) return;
    setBuying(true);
    try {
      const r = await api.buy(item.id, once ? 1 : qty);
      if (r.user) onUser(r.user);
      if (once) onOwned(item.id);
      toast(r.message || (once ? `Đã mua ${item.name}` : `Đã mua ${qty} × ${item.name}`));
      onBought?.();
      onClose();
    } catch (e) {
      if (once && ALREADY_OWNED.test(e.message)) {
        onOwned(item.id);
        onClose();
      };
      toastError(e);
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

          {once ? (
            <p className='flex items-center gap-2 rounded-lg border border-dashed border-line p-3 text-[11px] text-mute'>
              <IconLock size={15} className='shrink-0 text-lime' /> Vật phẩm chỉ mua được một lần · số lượng 1
            </p>
          ) : (
            <QuantityPicker value={qty} max={maxQty} disabled={buying} onChange={setQty} onEnter={confirm} />
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
                  <dd className={`tabular-nums ${short > 0 ? 'text-bad' : ''}`}>{short > 0 ? `Thiếu ${formatNumber(short)}` : formatNumber(user.coins - total)}</dd>
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

          {short > 0 ? (
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