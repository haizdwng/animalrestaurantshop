import { validate } from '@/shared/library/validate';
import { Button, Dialog, Field, OtpButton } from '@/shared/components/ui';
import StrengthBar from '@/shared/components/StrengthBar';
import * as api from '@/shared/library/api';

const OTP_INPUT = { label: 'Mã xác thực', maxLength: 12, autoCapitalize: 'characters', autoComplete: 'one-time-code', placeholder: 'XXXXXXXXXXXX' };

function FormDialog({ form, kind, title, onSubmit, children }) {
  return (
    <Dialog open={form.open === kind} title={title} onClose={form.close}>
      <form
        noValidate
        className='space-y-4'
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        {children}
      </form>
    </Dialog>
  );
};

export function UsernameDialog({ form, user }) {
  const { f, errors, busy, set, submit } = form;
  return (
    <FormDialog
      form={form}
      kind='username'
      title='Đổi tên đăng nhập'
      onSubmit={() => {
        const v = f.value.trim();
        submit({ value: v === user.username ? 'Tên đăng nhập mới trùng với tên đăng nhập hiện tại' : validate.username(v) }, () => api.updateUser({ username: v }), 'Đã đổi tên đăng nhập');
      }}
    >
      <Field label='Tên đăng nhập mới' autoFocus autoCapitalize='none' value={f.value} onChange={(e) => set('value')({ target: { value: e.target.value.replace(/\s/g, '') } })} error={errors.value} />
      <Button type='submit' className='w-full' loading={busy}>
        Lưu
      </Button>
    </FormDialog>
  );
};

export function PlayerNameDialog({ form }) {
  const { f, errors, busy, set, submit } = form;
  return (
    <FormDialog form={form} kind='playerName' title='Đổi tên người chơi' onSubmit={() => submit({ value: validate.playerName(f.value) }, () => api.updateUser({ name: f.value.trim() }), 'Đã đổi tên người chơi')}>
      <Field label='Tên người chơi mới' hint={`${f.value.trim().length}/32`} maxLength={32} autoFocus value={f.value} onChange={set('value')} error={errors.value} />
      <Button type='submit' className='w-full' loading={busy}>
        Lưu
      </Button>
    </FormDialog>
  );
};

export function PasswordDialog({ form }) {
  const { f, errors, busy, set, submit } = form;
  return (
    <FormDialog
      form={form}
      kind='password'
      title='Đổi mật khẩu'
      onSubmit={() => submit({
        next: validate.password(f.next),
        confirm: f.confirm !== f.next ? 'Mật khẩu nhập lại không khớp' : '',
      }, () => api.updateUser({ password: f.next }), 'Đã lưu mật khẩu mới')}
    >
      <Field label='Mật khẩu mới' placeholder='newpassword' type='password' autoFocus autoComplete='new-password' value={f.next} onChange={set('next')} error={errors.next} />
      <StrengthBar value={f.next} />
      <Field label='Nhập lại mật khẩu mới' placeholder='newpassword' type='password' autoComplete='new-password' value={f.confirm} onChange={set('confirm')} error={errors.confirm} />
      <Button type='submit' className='w-full' loading={busy}>
        Lưu mật khẩu
      </Button>
    </FormDialog>
  );
};

export function OpenidDialog({ form, user }) {
  const { f, errors, setErrors, busy, set, submit } = form;
  const checkNew = () => {
    const err = validate.openid(f.value) || (f.value.trim() === user.openid ? 'Mã người chơi mới trùng với mã người chơi hiện tại' : '');
    setErrors((s) => ({ ...s, value: err }));
    return !err;
  };
  return (
    <FormDialog form={form} kind='openid' title='Đổi mã người chơi' onSubmit={() => submit({ value: validate.openid(f.value), otp: validate.otp(f.otp) }, () => api.changeOpenid(f.value.trim(), f.otp), 'Đã cập nhật mã người chơi')}>
      <p className='rounded-lg bg-bg p-3 text-xs text-mute'>
        Hiện tại: <b className='break-all text-fg'>{user.openid}</b>
      </p>
      <Field
        label='Mã người chơi mới'
        placeholder='newopenid'
        autoCapitalize='none'
        value={f.value}
        onChange={set('value')}
        error={errors.value}
        right={<OtpButton target={f.value.trim()} send={() => api.openidOtp(f.value.trim())} check={checkNew} />}
      />
      <Field {...OTP_INPUT} value={f.otp} onChange={set('otp')} error={errors.otp} className='[&_input]:text-center [&_input]:tracking-[0.3em]' />
      <Button type='submit' className='w-full' loading={busy}>
        Xác nhận
      </Button>
    </FormDialog>
  );
};

export function LogoutDialog({ form, user, onLogout }) {
  return (
    <Dialog open={form.open === 'logout'} title='Đăng xuất' onClose={form.close}>
      <p className='text-sm text-mute'>Bạn có chắc muốn đăng xuất khỏi tài khoản @{user.username}?</p>
      <div className='grid grid-cols-2 gap-2'>
        <Button variant='ghost' onClick={form.close}>
          Huỷ
        </Button>
        <Button variant='danger' onClick={onLogout}>
          Đăng xuất
        </Button>
      </div>
    </Dialog>
  );
};