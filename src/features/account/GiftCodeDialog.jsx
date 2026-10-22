import { useState } from 'react';
import { IconGift } from '@tabler/icons-react';
import { Button, Dialog, Field, toast, toastError } from '@/shared/components/ui';
import * as api from '@/shared/library/api';

export default function GiftCodeDialog({ open, onClose, onUser }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => !busy && onClose();
  const submit = async (event) => {
    event.preventDefault();
    const value = code.trim().toUpperCase();
    if (!value) return;
    setBusy(true);
    try {
      const result = await api.redeemGiftCode(value);
      if (result.user) onUser(result.user);
      toast(result.message || 'Đã nhận mã đổi thưởng');
      onClose();
    } catch (error) {
      toastError(error);
    } finally {
      setBusy(false);
    };
  };

  return (
    <Dialog open={open} title='Nhập mã đổi thưởng' onClose={close}>
      <form noValidate className='space-y-4' onSubmit={submit}>
        <div className='flex items-start gap-3 rounded-xl bg-bg p-3 text-xs text-mute'>
          <IconGift size={18} className='mt-0.5 shrink-0 text-lime' />
          <p>Nhập mã đổi thưởng để nhận xu hoặc phần thưởng được cấp.</p>
        </div>
        <Field
          label='Mã đổi thưởng'
          placeholder='GIFTCODE'
          autoFocus
          autoCapitalize='characters'
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <Button type='submit' className='w-full' loading={busy} disabled={!code.trim()}>
          Nhận phần thưởng
        </Button>
      </form>
    </Dialog>
  );
};