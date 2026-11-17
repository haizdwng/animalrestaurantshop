import { useState } from 'react';
import { IconQrcode } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, Field, Spinner, toast, toastError } from '@/shared/components/ui';
import PaymentDialog from '@/shared/components/payment/PaymentDialog';
import * as api from '@/shared/library/api';

const PRESETS = [20, 50, 100, 200, 500, 1000];
const STEPS = ['Chọn số xu và tạo mã QR', 'Quét mã bằng ứng dụng ngân hàng', 'Xu được cộng khi thanh toán thành công'];

function BalanceAside({ coins, adding }) {
  return (
    <aside className='ui-card flex flex-col gap-5 p-5 sm:p-6'>
      <div>
        <h2 className='text-xs font-semibold text-mute'>Số dư hiện tại</h2>
        <p className='mt-2 flex items-center gap-2 text-3xl font-extrabold text-coin tabular-nums'><Coin size={28} /> {formatNumber(coins)}</p>
        {adding > 0 && <p className='mt-2 text-xs text-mute tabular-nums'>Sau khi nạp: <strong className='text-fg'>{formatNumber(coins + adding)} xu</strong></p>}
      </div>
      <ol className='space-y-3 border-t border-line pt-4 text-xs text-mute'>
        {STEPS.map((step, index) => (
          <li key={step} className='flex items-start gap-3'>
            <span className='grid size-6 shrink-0 place-items-center rounded-lg bg-raise text-[11px] font-bold text-fg'>{index + 1}</span>
            <span className='pt-0.5 leading-relaxed'>{step}</span>
          </li>
        ))}
      </ol>
      <p className='mt-auto border-t border-line pt-4 text-[11px] text-mute'>Xem và tiếp tục giao dịch chưa thanh toán ở trang Tài khoản.</p>
    </aside>
  );
};

export default function TopUp({ user, onPaid }) {
  const [coin, setCoin] = useState('');
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [transaction, setTransaction] = useState(null);
  const amount = Number(coin) || 0;
  const pick = (value) => { setCoin(String(value)); setError(''); };

  const submit = async (event) => {
    event.preventDefault();
    if (!Number.isSafeInteger(amount) || amount < api.MIN_TOPUP) {
      setError(`Tối thiểu ${api.MIN_TOPUP} xu`);
      return;
    }
    setBusy(true);
    try {
      const response = await api.createTransaction(amount);
      setTransaction({
        code: response.code,
        qr: response.qr,
        coin: amount,
        amount: response.amount,
        status: 'pending',
        expiredAt: response.expiredAt || response.transaction?.expiredAt || null
      });
      toast(response.message || 'Đã tạo giao dịch', 'info');
    } catch (requestError) {
      toastError(requestError);
      setError(requestError.message || 'Không tạo được giao dịch');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className='grid animate-fade gap-4 lg:grid-cols-[minmax(0,1fr)_300px]'>
      <form onSubmit={submit} noValidate className='ui-card min-w-0 space-y-5 p-5 sm:p-6'>
        <header><h1 className='ui-heading'>Mua xu</h1><p className='ui-description mt-1'>Chọn số xu và thanh toán bằng mã QR ngân hàng.</p></header>
        <div className='grid grid-cols-3 gap-2 sm:grid-cols-6' role='group' aria-label='Chọn nhanh số xu'>
          {PRESETS.map((preset) => (
            <button key={preset} type='button' onClick={() => pick(preset)} aria-pressed={amount === preset}
              className={`flex min-h-14 cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border text-sm font-bold tabular-nums transition-colors ${amount === preset ? 'border-coin bg-coin/10 text-coin' : 'border-line bg-bg text-fg hover:border-mute'}`}>
              {formatNumber(preset)} <span className='text-[10px] font-medium text-mute'>xu</span>
            </button>
          ))}
        </div>
        <Field label='Số xu' hint={`Tối thiểu ${api.MIN_TOPUP}`} inputMode='numeric' placeholder='Nhập số xu'
          value={coin} onChange={(event) => pick(event.target.value.replace(/\D/g, '').slice(0, 9))}
          error={error} className='[&_input]:font-bold [&_input]:tabular-nums' />
        <Button type='submit' loading={busy} disabled={amount < api.MIN_TOPUP} className='min-h-12 w-full'>
          <IconQrcode size={18} /> Tạo mã QR {amount >= api.MIN_TOPUP && `· ${formatNumber(amount)} xu`}
        </Button>
        {busy && <p role='status' className='flex items-center gap-2 text-xs text-mute'><Spinner size={14} /> Đang tạo giao dịch…</p>}
      </form>
      <BalanceAside coins={user.coins} adding={amount} />
      <PaymentDialog tx={transaction} onClose={() => setTransaction(null)} onChange={setTransaction}
        onPaid={() => { setCoin(''); onPaid?.(); }} />
    </div>
  );
};