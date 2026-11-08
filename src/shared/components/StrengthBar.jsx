import { passwordStrength } from '@/shared/library/validate';

const LABELS = ['Rất yếu', 'Yếu', 'Trung bình', 'Mạnh', 'Rất mạnh'];
const colorFor = (n) => (n < 2 ? 'bg-bad' : n < 3 ? 'bg-coin' : 'bg-ok');

export default function StrengthBar({ value }) {
  const n = passwordStrength(value);
  if (!value) return null;
  return (
    <div className='-mt-2 flex items-center gap-2'>
      <div className='flex flex-1 gap-1'>
        {[0, 1, 2, 3].map((i) => (
          <span key={i} className={`h-1 flex-1 rounded-full ${i < n ? colorFor(n) : 'bg-raise'}`} />
        ))}
      </div>
      <span className='w-20 text-right text-[10px] text-mute'>{LABELS[n]}</span>
    </div>
  );
};