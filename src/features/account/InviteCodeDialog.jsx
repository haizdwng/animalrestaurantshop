import { useState } from 'react';
import { IconUserPlus } from '@tabler/icons-react';
import { Button, Dialog, Field, toast, toastError } from '@/shared/components/ui';
import * as api from '@/shared/library/api';

export default function InviteCodeDialog({ open, onClose, user, onUser }) {
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);

  const close = () => !busy && onClose();
  const submit = async (event) => {
    event.preventDefault();
    const value = code.trim();
    if (!value) return;
    setBusy(true);
    try {
      const result = await api.submitInvite(value);
      if (!result.success) {
        toast(result.message || 'Không thể áp dụng mã mời', 'err');
        return;
      };
      if (result.user) onUser(result.user);
      else onUser({
        ...user,
        friendInvite: value,
        coins: result.coins !== undefined ? Number(result.coins) : user.coins,
        ...(result.star !== undefined ? { star: Number(result.star) } : {})
      });
      toast(result.message || 'Đã áp dụng mã mời');
      setCode('');
      onClose();
    } catch (error) {
      toastError(error);
    } finally {
      setBusy(false);
    };
  };

  return (
    <Dialog open={open} title='Nhập mã mời' onClose={close}>
      <form noValidate className='space-y-4' onSubmit={submit}>
        <div className='flex items-start gap-3 rounded-xl bg-bg p-3 text-xs text-mute'>
          <IconUserPlus size={18} className='mt-0.5 shrink-0 text-lime' />
          <p>Nhập mã mời của người giới thiệu để nhận 50 xu.</p>
        </div>
        <Field
          label='Mã mời'
          placeholder='Mã mời'
          autoFocus
          value={code}
          onChange={(event) => setCode(event.target.value)}
        />
        <Button type='submit' className='w-full' loading={busy} disabled={!code.trim()}>
          Xác nhận
        </Button>
      </form>
    </Dialog>
  );
};