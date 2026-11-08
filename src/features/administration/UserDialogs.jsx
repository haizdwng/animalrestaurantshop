import { Button, Coin, Dialog, Field } from '@/shared/components/ui';
import { COIN_PRESETS } from '@/features/administration/config';

export default function UserDialogs({ dlg, f, setF, busy, onClose, onCreate, onEdit, onCoin, onDelete }) {
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));
  const setUsername = (e) => setF((s) => ({ ...s, username: e.target.value.replace(/\s/g, '') }));
  const name = dlg?.user?.username ?? '';

  return (
    <>
      <Dialog open={dlg?.kind === 'create'} title='Thêm người dùng' onClose={onClose}>
        <form noValidate className='space-y-4' onSubmit={onCreate}>
          <Field label='Mã người chơi' placeholder='openid' autoFocus autoCapitalize='none' value={f.openid} onChange={set('openid')} />
          <Field label='Tên đăng nhập' placeholder='username' autoCapitalize='none' value={f.username} onChange={setUsername} />
          <Field label='Mật khẩu' placeholder='password' type='password' autoComplete='new-password' value={f.password} onChange={set('password')} />
          <Button type='submit' className='w-full' loading={busy}>
            Thêm
          </Button>
        </form>
      </Dialog>

      <Dialog open={dlg?.kind === 'edit'} title={`Sửa @${name}`} onClose={onClose}>
        <form noValidate className='space-y-4' onSubmit={onEdit}>
          <Field label='Mã người chơi' placeholder='newopenid' autoCapitalize='none' value={f.openid} onChange={set('openid')} />
          <Field label='Tên đăng nhập' placeholder='newusername' autoCapitalize='none' value={f.username} onChange={setUsername} />
          <Field label='Mật khẩu mới' placeholder='newpassword' hint='để trống nếu không đổi' type='password' autoComplete='new-password' value={f.password} onChange={set('password')} />
          <Button type='submit' className='w-full' loading={busy}>
            Lưu thay đổi
          </Button>
        </form>
      </Dialog>

      <Dialog open={dlg?.kind === 'coin'} title={`Thêm xu cho @${name}`} onClose={onClose}>
        <form noValidate className='space-y-4' onSubmit={onCoin}>
          <p className='flex items-center justify-between rounded-lg bg-bg p-3 text-xs text-mute'>
            Số xu hiện có
            <b className='flex items-center gap-1.5 tabular-nums text-coin'>
              <Coin size={14} /> {(dlg?.user?.coin ?? 0).toLocaleString('vi-VN')}
            </b>
          </p>
          <Field label='Số xu' hint='số âm để trừ' type='number' inputMode='numeric' autoFocus value={f.coin} onChange={set('coin')} />
          <div className='grid grid-cols-4 gap-2'>
            {COIN_PRESETS.map((n) => (
              <Button key={n} type='button' variant='ghost' size='sm' onClick={() => setF((s) => ({ ...s, coin: String(n) }))}>
                +{n.toLocaleString('vi-VN')}
              </Button>
            ))}
          </div>
          <Button type='submit' className='w-full' loading={busy}>
            Xác nhận
          </Button>
        </form>
      </Dialog>

      <Dialog open={dlg?.kind === 'delete'} title='Xoá người dùng' onClose={onClose}>
        <p className='text-sm text-mute'>
          Xoá vĩnh viễn tài khoản <b className='text-fg'>@{dlg?.user?.username}</b>? Hành động này không thể hoàn tác.
        </p>
        <div className='grid grid-cols-2 gap-2'>
          <Button variant='ghost' onClick={onClose}>
            Huỷ
          </Button>
          <Button variant='danger' loading={busy} onClick={onDelete}>
            Xoá
          </Button>
        </div>
      </Dialog>
    </>
  );
};