import { useEffect, useState } from 'react';
import { IconCopy, IconLink } from '@tabler/icons-react';
import { Button, Dialog, Spinner, toast, toastError } from '@/shared/components/ui';
import { copyText } from '@/shared/library/clipboard';

export default function LinkDialog({ request, title, open, onClose }) {
  const [state, setState] = useState({ loading: false, message: '', link: '' });

  useEffect(() => {
    if (!open || !request) return undefined;
    let active = true;
    setState({ loading: true, message: '', link: '' });
    request()
      .then((result) => {
        if (!active) return;
        if (!result?.link) throw new Error(result?.message || 'Máy chủ không trả về liên kết');
        setState({ loading: false, message: result.message || '', link: result.link });
      })
      .catch((error) => {
        if (!active) return;
        setState({ loading: false, message: '', link: '' });
        toastError(error);
      });
    return () => {
      active = false;
    };
  }, [open, request]);

  const close = () => !state.loading && onClose();

  return (
    <Dialog open={open} title={title} onClose={close}>
      <div className='space-y-4'>
        {state.loading ? (
          <div className='flex items-center justify-center gap-2 rounded-xl bg-bg p-6 text-xs text-mute'>
            <Spinner size={16} /> Đang tạo liên kết…
          </div>
        ) : state.link ? (
          <>
            <div className='flex items-start gap-3 rounded-xl bg-bg p-3 text-xs text-mute'>
              <IconLink size={18} className='mt-0.5 shrink-0 text-lime' />
              <p>{state.message || 'Liên kết đã sẵn sàng. Bạn có thể sao chép và chia sẻ.'}</p>
            </div>
            <div className='flex items-center gap-2 rounded-lg border border-dashed border-line bg-bg p-2'>
              <code className='min-w-0 flex-1 break-all text-[11px] text-lime'>{state.link}</code>
              <Button
                variant='quiet'
                size='sm'
                className='size-8! shrink-0 px-0!'
                onClick={() => copyText(state.link, 'Đã sao chép liên kết')}
                aria-label='Sao chép liên kết'
              >
                <IconCopy size={15} />
              </Button>
            </div>
          </>
        ) : null}
      </div>
    </Dialog>
  );
};