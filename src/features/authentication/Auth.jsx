import { useState } from 'react';
import { IconAlertTriangle, IconArrowRight, IconShieldCheck } from '@tabler/icons-react';
import { cleanOtp, hasErrors, validate } from '@/shared/library/validate';
import { Button, Field, OtpButton, toast } from '@/shared/components/ui';
import { EMPTY_FORM, LAST_USER_KEY, SUBMIT_LABELS } from '@/features/authentication/config';
import StrengthBar from '@/shared/components/StrengthBar';
import AuthHeader from '@/features/authentication/AuthHeader';
import AuthLayout from '@/features/authentication/AuthLayout';
import * as api from '@/shared/library/api';

export default function Auth({ onAuthed }) {
  const [mode, setModeRaw] = useState('login');
  const [f, setF] = useState(() => ({ ...EMPTY_FORM, username: localStorage.getItem(LAST_USER_KEY) || '' }));
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [caps, setCaps] = useState(false);
  const [remember, setRemember] = useState(() => !!localStorage.getItem(LAST_USER_KEY));

  const set = (k) => (e) => {
    const v = k === 'otp' ? cleanOtp(e.target.value) : k === 'username' ? e.target.value.replace(/\s/g, '') : e.target.value;
    setF((s) => ({ ...s, [k]: v }));
    if (errors[k]) setErrors((s) => ({ ...s, [k]: '' }));
  };
  const setMode = (m) => {
    setModeRaw(m);
    setErrors({});
    setSent(false);
    setF((s) => ({ ...EMPTY_FORM, username: s.username }));
  };

  const checkInfo = () => {
    const e = {
      username: validate.username(f.username),
      password: validate.password(f.password),
      confirm: f.confirm !== f.password ? 'Mật khẩu nhập lại không khớp' : '',
      openid: validate.openid(f.openid)
    };
    setErrors(e);
    return !hasErrors(e);
  };
  const info = () => ({ username: f.username, password: f.password, openid: f.openid.trim() });

  const check = () => {
    const e = {};
    if (mode === 'login') {
      if (!f.username) e.username = 'Nhập tên đăng nhập';
      if (!f.password) e.password = 'Nhập mật khẩu';
    } else {
      if (!checkInfo()) return false;
      if (!sent) {
        setErrors({ otp: 'Bấm “Gửi mã xác thực” để nhận mã xác thực' });
        return false;
      };
      e.otp = validate.otp(f.otp);
    };
    setErrors(e);
    return !hasErrors(e);
  };

  const run = async (fn) => {
    setLoading(true);
    try {
      await fn();
    } catch (e) {
      if (e.field) setErrors((s) => ({ ...s, [e.field]: e.message }));
      toast(e.message, 'err');
    } finally {
      setLoading(false);
    };
  };

  const doLogin = async () => {
    const r = await api.login(f.username, f.password);
    if (remember) localStorage.setItem(LAST_USER_KEY, f.username);
    else localStorage.removeItem(LAST_USER_KEY);
    toast(r.message);
    onAuthed(r.user);
  };
  const doRegister = async () => {
    const r = await api.signup({ ...info(), otp: f.otp });
    toast(r.message);
    const user = r.user || (await api.login(f.username, f.password)).user;
    if (user) onAuthed(user);
    else setMode('login');
  };
  const doReset = async () => {
    const r = await api.resetPassword({ ...info(), otp: f.otp });
    toast(r.message);
    setMode('login');
  };
  const actions = { login: doLogin, register: doRegister, forgot: doReset };

  const submit = (e) => {
    e.preventDefault();
    if (!check()) return;
    run(actions[mode]);
  };

  return (
    <AuthLayout>
      <AuthHeader mode={mode} onMode={setMode} />

      <form onSubmit={submit} noValidate className='space-y-4'>
        <Field label='Tên đăng nhập' value={f.username} onChange={set('username')} error={errors.username} autoComplete='username' autoCapitalize='none' placeholder='username' />
        <Field
          label={mode === 'forgot' ? 'Mật khẩu mới' : 'Mật khẩu'}
          placeholder={mode === 'forgot' ? 'newpassword' : 'password'}
          type='password'
          value={f.password}
          onChange={set('password')}
          error={errors.password}
          autoComplete={mode === 'login' ? 'current-password' : 'new-password'}
          onKeyUp={(e) => setCaps(e.getModifierState?.('CapsLock'))}
        />
        {caps && (
          <p className='-mt-2 flex items-center gap-1.5 text-[11px] text-coin'>
            <IconAlertTriangle size={14} /> Caps Lock đang bật
          </p>
        )}
        {mode !== 'login' && (
          <>
            <StrengthBar value={f.password} />
            <Field label='Nhập lại mật khẩu' type='password' value={f.confirm} onChange={set('confirm')} error={errors.confirm} autoComplete='new-password' placeholder={mode === 'forgot' ? 'newpassword' : 'password'} />
            <Field
              label='Mã người chơi'
              hint='cài đặt -> con mèo dưới cùng bên phải'
              placeholder='openid'
              value={f.openid}
              onChange={set('openid')}
              error={errors.openid}
              autoCapitalize='none'
              right={<OtpButton target={f.openid.trim()} send={() => (mode === 'register' ? api.signupOtp(info()) : api.passwordOtp(info()))} check={checkInfo} onSent={() => setSent(true)} />}
            />
            {sent ? (
              <Field label='Mã xác thực' hint='cài đặt -> phản hồi' maxLength={12} autoCapitalize='characters' autoFocus autoComplete='one-time-code' placeholder='XXXXXXXXXXXX' value={f.otp} onChange={set('otp')} error={errors.otp} className='animate-rise [&_input]:text-center [&_input]:tracking-[0.3em]' />
            ) : (
              <p className={`flex items-center gap-2 rounded-lg border border-dashed p-3 text-[11px] ${errors.otp ? 'border-bad/60 text-bad' : 'border-line text-mute'}`}>
                <IconShieldCheck size={16} className='shrink-0' /> {errors.otp || 'Điền đầy đủ thông tin rồi bấm “Gửi mã xác thực” để nhận mã xác thực.'}
              </p>
            )}
          </>
        )}
        {mode === 'login' && (
          <div className='flex items-center justify-between'>
            <label className='flex cursor-pointer items-center gap-2 text-xs text-mute'>
              <input type='checkbox' checked={remember} onChange={(e) => setRemember(e.target.checked)} className='size-4 accent-lime' />
              Nhớ tên đăng nhập
            </label>
            <button type='button' onClick={() => setMode('forgot')} className='cursor-pointer text-xs text-mute hover:text-lime'>
              Quên mật khẩu?
            </button>
          </div>
        )}
        <Button type='submit' loading={loading} className='h-12 w-full'>
          {SUBMIT_LABELS[mode]} <IconArrowRight size={16} />
        </Button>
        {loading && <p className='text-center text-[11px] text-mute'>Đang xử lý…</p>}
      </form>
    </AuthLayout>
  );
};