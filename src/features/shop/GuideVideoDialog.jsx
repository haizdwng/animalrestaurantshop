import { Dialog } from '@/shared/components/ui';

export default function GuideVideoDialog({ open, src, title = 'Hướng dẫn', onClose }) {
  return (
    <Dialog open={open} title={title} onClose={onClose}>
      {open && <video src={src} controls autoPlay playsInline className='max-h-[70dvh] w-full rounded-xl bg-black object-contain' />}
    </Dialog>
  );
};