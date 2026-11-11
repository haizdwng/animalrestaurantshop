import { useState } from 'react';
import { cleanOtp, hasErrors } from '@/shared/library/validate';
import { toast } from '@/shared/components/ui';

export const EMPTY = { value: '', current: '', next: '', confirm: '', otp: '' };
const VALUE_FIELDS = ['openid', 'username', 'name', 'playerName'];

export default function useProfileForm(onUser) {
  const [open, setOpen] = useState(null);
  const [f, setF] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);

  const show = (kind, initialValues = {}) => {
    setF({ ...EMPTY, ...initialValues });
    setErrors({});
    setOpen(kind);
  };
  const close = () => !busy && setOpen(null);
  const set = (field) => (event) => {
    const value = field === 'otp' ? cleanOtp(event.target.value) : event.target.value;
    setF((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: '' }));
  };

  const submit = async (localErrors, call, message) => {
    if (hasErrors(localErrors)) return setErrors(localErrors);
    setBusy(true);
    try {
      const result = await call();
      if (result.user) onUser(result.user);
      toast(result.message || message);
      setOpen(null);
    } catch (error) {
      if (error.code === 'UNAUTHORIZED') return;
      if (error.field) setErrors((current) => ({ ...current, [VALUE_FIELDS.includes(error.field) ? 'value' : error.field]: error.message }));
      toast(error.message, 'err');
    } finally {
      setBusy(false);
    };
  };

  return { open, f, errors, setErrors, busy, show, close, set, submit };
};