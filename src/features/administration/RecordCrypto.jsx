import { useState } from 'react';
import { IconCopy, IconLock, IconLockOpen } from '@tabler/icons-react';
import { Button, Dialog, Select, toast, toastError } from '@/shared/components/ui';
import { copyText } from '@/shared/library/clipboard';
import * as api from '@/shared/library/api';

const TYPES = [['v1', 'Loại 1'], ['v2', 'Loại 2']];

export default function RecordCrypto({ openid }) {
  const [mode, setMode] = useState('');
  const [type, setType] = useState('v1');
  const [key, setKey] = useState('');
  const [numberValue, setNumberValue] = useState('');
  const [decryptValue, setDecryptValue] = useState('');
  const [result, setResult] = useState(null);
  const [busy, setBusy] = useState(false);

  const run = async (event) => {
    event.preventDefault();
    if (mode === 'encrypt') {
      if (numberValue.trim() === '' || !Number.isFinite(Number(numberValue))) return toast('Nhập số nguyên hoặc số thập phân hợp lệ', 'err');
      if (type === 'v1' && !key.trim()) return toast('Nhập key cho mã hóa v1', 'err');
    } else if (!decryptValue.trim()) return toast('Nhập chuỗi cần giải mã', 'err');
    setBusy(true);
    try {
      const value = mode === 'encrypt'
        ? await api.adminEncryptRecordValue(openid, type, Number(numberValue), key.trim())
        : await api.adminDecryptRecordValue(openid, type, decryptValue.trim());
      if (!value.success || (mode === 'encrypt' ? typeof value.encrypted !== 'string' : typeof value.decrypted !== 'number')) {
        return toast(value.message || 'Không xử lý được giá trị', 'err');
      }
      setResult(mode === 'encrypt' ? value.encrypted : String(value.decrypted));
      toast(value.message || 'Đã xử lý');
    } catch (error) {
      toastError(error);
    } finally {
      setBusy(false);
    };
  };

  return (
    <>
      <Button variant='quiet' size='sm' className='w-full' onClick={() => { setMode('encrypt'); setResult(null); }}><IconLock size={13} /> Mã hóa</Button>
      <Button variant='quiet' size='sm' className='w-full' onClick={() => { setMode('decrypt'); setResult(null); }}><IconLockOpen size={13} /> Giải mã</Button>
      <Dialog open={!!mode} title={mode === 'encrypt' ? 'Mã hóa giá trị' : 'Giải mã chuỗi'} onClose={() => !busy && setMode('')}>
        <form className='space-y-4' onSubmit={run}>
          <Select label='Loại mã hóa' value={type} onChange={setType}>
            {TYPES.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
          </Select>
          {mode === 'encrypt' ? (
            <>
              {type === 'v1' && <label className='block'><span className='mb-1.5 block text-[11px] font-medium text-mute'>Khóa mã hóa loại 1</span><input value={key} onChange={(e) => setKey(e.target.value)} autoComplete='off' className='h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime' /></label>}
              <label className='block'><span className='mb-1.5 block text-[11px] font-medium text-mute'>Giá trị số</span><input value={numberValue} onChange={(e) => setNumberValue(e.target.value)} inputMode='decimal' className='h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime' /></label>
            </>
          ) : <label className='block'><span className='mb-1.5 block text-[11px] font-medium text-mute'>Chuỗi đã mã hóa</span><input value={decryptValue} onChange={(e) => setDecryptValue(e.target.value)} className='h-10 w-full rounded-lg border border-line bg-bg px-3 text-sm outline-none focus:border-lime' /></label>}
          <Button type='submit' className='w-full' loading={busy}>{mode === 'encrypt' ? 'Mã hóa' : 'Giải mã'}</Button>
          {result !== null && <div className='flex items-center gap-2 rounded-lg border border-dashed border-line bg-bg p-2'><code className='min-w-0 flex-1 break-all text-[11px] text-lime'>{result}</code><button type='button' className='grid size-7 shrink-0 place-items-center rounded-md text-mute hover:bg-raise hover:text-fg' onClick={() => copyText(result, 'Đã sao chép')} aria-label='Sao chép kết quả'><IconCopy size={14} /></button></div>}
        </form>
      </Dialog>
    </>
  );
};