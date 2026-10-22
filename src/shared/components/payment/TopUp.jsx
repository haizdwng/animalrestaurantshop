import { useState } from 'react';
import { IconQrcode } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Field, Spinner, toast, toastError } from '@/shared/components/ui';
import PaymentDialog from '@/shared/components/payment/PaymentDialog';
import * as api from '@/shared/library/api';

const PRESETS = [20, 50, 100, 200, 500, 1000];
const STEPS = ['Chọn số xu & tạo mã QR', 'Quét mã bằng app ngân hàng', 'Xu được cộng tự động'];

function BalanceAside({ coins, adding }) {
  return (
    <aside className='flex flex-col gap-5 rounded-2xl border border-coin/20 bg-[radial-gradient(120%_80%_at_100%_0%,color-mix(in_oklab,var(--color-coin)_14%,transparent),transparent)] p-5 sm:p-6'>
      <div>
        <p className='text-[11px] text-mute'>Số dư hiện tại</p>
        <p className='mt-1 flex items-center gap-2 text-3xl font-extrabold tabular-nums text-coin'>
          <Coin size={28} /> {formatNumber(coins)}
        </p>
        {adding > 0 && (
          <p className='mt-2 text-xs text-mute tabular-nums'>
            Số dư sau khi nạp: <b className='text-fg'>{formatNumber(coins + adding)}</b>
          </p>
        )}
      </div>
      <ol className='space-y-3 text-xs'>
        {STEPS.map((t, i) => (
          <li key={t} className='flex items-center gap-3'>
            <span className='grid size-6 shrink-0 place-items-center rounded-full bg-raise text-[10px] font-bold text-coin'>{i + 1}</span> {t}
          </li>
        ))}
      </ol>
      <p className='mt-auto text-[10px] text-mute'>Giao dịch chưa thanh toán xem lại ở trang Tài khoản.</p>
    </aside>
  );
};

export default function TopUp({ user, onPaid }) {
  const [coin, setCoin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [tx, setTx] = useState(null);
  const n = parseInt(coin) || 0;

  const pick = (v) => {
    setCoin(v);
    setError('');
  };

  const submit = async (e) => {
    e.preventDefault();
    if (n < api.MIN_TOPUP) return setError(`Tối thiểu ${api.MIN_TOPUP} xu`);
    setBusy(true);
    try {
      const r = await api.createTransaction(n);
      setTx({ code: r.code, qr: r.qr, coin: n, amount: r.amount, status: 'pending' });
      toast(r.message || 'Đã tạo giao dịch', 'info');
    } catch (err) {
      toastError(err);
      setError(err.message);
    } finally {
      setBusy(false);
    };
  };

  return (
    <div className='grid animate-fade gap-4 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <form onSubmit={submit} noValidate className='space-y-5 rounded-2xl border border-line bg-panel p-5 sm:p-6'>
        <div>
          <h1 className='text-xl font-extrabold tracking-tight sm:text-2xl'>Mua xu</h1>
          <p className='mt-1 text-xs text-mute'>Chọn số xu (tối thiểu {api.MIN_TOPUP} xu) và thanh toán bằng mã QR ngân hàng.</p>
        </div>
        <div className='grid grid-cols-3 gap-2 sm:grid-cols-6'>
          {PRESETS.map((p) => (
            <button
              key={p}
              type='button'
              onClick={() => pick(String(p))}
              className={`flex h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-bold tabular-nums transition ${n === p ? 'border-coin bg-coin/10 text-coin' : 'border-line bg-bg hover:border-mute'}`}
            >
              {formatNumber(p)}
              <span className='text-[9px] font-medium text-mute'>xu</span>
            </button>
          ))}
        </div>
        <Field
          label='Số xu'
          hint={`tối thiểu ${api.MIN_TOPUP} xu`}
          inputMode='numeric'
          placeholder='số xu'
          value={coin}
          onChange={(e) => pick(e.target.value.replace(/\D/g, '').slice(0, 9))}
          error={error}
          className='[&_input]:text-lg [&_input]:font-bold [&_input]:tabular-nums'
        />
        <Button type='submit' loading={busy} disabled={n < api.MIN_TOPUP} className='h-12 w-full'>
          <IconQrcode size={17} /> Tạo mã QR {n >= api.MIN_TOPUP && `· ${formatNumber(n)} xu`}
        </Button>
        {busy && (
          <p className='flex items-center gap-2 text-[11px] text-mute'>
            <Spinner size={12} className='text-lime' /> Đang tạo giao dịch, có thể mất tới một phút…
          </p>
        )}
      </form>
      <BalanceAside coins={user.coins} adding={n} />
      <PaymentDialog
        tx={tx}
        onClose={() => setTx(null)}
        onChange={setTx}
        onPaid={() => {
          setCoin('');
          onPaid?.();
        }}
      />
    </div>
  );
};