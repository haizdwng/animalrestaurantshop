import { useEffect, useState } from 'react';
import { IconUpload } from '@tabler/icons-react';
import { fileToAvatar } from '@/shared/library/image';
import { Button, Dialog, Field, toast } from '@/shared/components/ui';
import { validate } from '@/shared/library/validate';

export default function PlayerDialogs({ player, open, busy, onClose, onSave }) {
  const [nickName, setNickName] = useState('');
  const [preview, setPreview] = useState('');
  useEffect(() => () => preview?.url && URL.revokeObjectURL(preview.url), [preview]);

  useEffect(() => {
    if (open === 'edit') {
      setNickName(player?.nickName || '');
      setPreview('');
    };
  }, [open, player]);

  const pickFile = async (event) => {
    const file = event.target.files?.[0];
    event.target.value = '';
    if (!file) return;
    try {
      const original = fileToAvatar(file);
      setPreview({ file: original, url: URL.createObjectURL(original) });
    } catch (error) {
      toast(error.message, 'err');
    };
  };
  const submitName = (event) => {
    event.preventDefault();
    const error = validate.playerName(nickName);
    if (error) return toast(error, 'err');
    onSave({ nickName: nickName.trim(), avatar: preview?.file });
  };

  return (
    <Dialog open={open === 'edit'} title={`Sửa ${player?.nickName || 'người chơi'}`} onClose={onClose}>
      <form noValidate className='space-y-4' onSubmit={submitName}>
        <label className='mx-auto grid aspect-square w-full max-w-48 cursor-pointer place-items-center overflow-hidden rounded-2xl border border-dashed border-line bg-bg hover:border-lime'>
          {preview?.url || player?.avatarUrl ? <img src={preview?.url || player.avatarUrl} alt='Xem trước' className='size-full object-cover' /> : <span className='flex flex-col items-center gap-2 text-xs text-mute'><IconUpload size={28} /> Chọn ảnh đại diện</span>}
          <input type='file' accept='.jpg,.jpeg,.png' className='hidden' onChange={pickFile} />
        </label>
        <p className='text-center text-[11px] text-mute'>{preview ? 'Bấm vào ảnh để chọn ảnh khác' : 'JPG, JPEG, PNG · tối đa 8MB · ảnh gốc được giữ nguyên'}</p>
        <Field label='Tên người chơi' hint={`${nickName.trim().length}/32`} maxLength={32} autoFocus value={nickName} onChange={(event) => setNickName(event.target.value)} />
        <Button type='submit' className='w-full' loading={busy}>Lưu thay đổi</Button>
      </form>
    </Dialog>
  );
};

export function PlayerStarDialog({ player, open, busy, onClose, onSubmit }) {
  const [value, setValue] = useState('');

  useEffect(() => {
    if (open === 'star') setValue('');
  }, [open, player]);

  const submit = (event) => {
    event.preventDefault();
    const star = Number(value);
    if (!Number.isSafeInteger(star) || star < 1) return toast('Số sao phải là số nguyên từ 1 trở lên', 'err');
    onSubmit(star);
  };

  return (
    <Dialog open={open === 'star'} title={`Thêm sao cho ${player?.nickName || 'người chơi'}`} onClose={onClose}>
      <form noValidate className='space-y-4' onSubmit={submit}>
        <Field label='Số sao' hint='số nguyên ≥ 1' inputMode='numeric' placeholder='1' autoFocus value={value} onChange={(event) => setValue(event.target.value.replace(/\D/g, '').slice(0, 9))} />
        <Button type='submit' className='w-full' loading={busy} disabled={!value}>Thêm sao</Button>
      </form>
    </Dialog>
  );
};