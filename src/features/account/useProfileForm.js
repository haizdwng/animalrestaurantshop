import { useState } from 'react';
import { cleanOtp, hasErrors } from '@/shared/library/validate';
import { toast } from '@/shared/components/ui';

export const EMPTY = { value: '', current: '', next: '', confirm: '', otp: '' };
const VALUE_FIELDS = ['openid', 'username', 'name', 'playerName'];

export default function useProfileForm(onUser) {
  const [open, setOpen] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);

  const show = (k, init = {}) => {
    setF({ ...EMPTY, ...init });
    setErrors({});
    setPreview('');
    setOpen(k);
  };
  const close = () => !busy && setOpen(null);
  const set = (k) => (e) => {
    const v = k === 'otp' ? cleanOtp(e.target.value) : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
    setErrors((s) => ({ ...s, [k]: '' }));
  };

  const submit = async (localErrors, call, msg) => {
    if (hasErrors(localErrors)) return setErrors(localErrors);
    setBusy(true);
    try {
      const r = await call();
      if (r.user) onUser(r.user);
      toast(r.message || msg);
      setOpen(null);
    } catch (e) {
      if (e.code === 'UNAUTHORIZED') return;
      if (e.field) setErrors((s) => ({ ...s, [VALUE_FIELDS.includes(e.field) ? 'value' : e.field]: e.message }));
      toast(e.message, 'err');
    } finally {
      setBusy(false);
    };
  };

  return { open, f, errors, setErrors, preview, setPreview, busy, show, close, set, submit };
};