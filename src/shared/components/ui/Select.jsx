import { IconArrowsSort, IconListNumbers, IconSelector } from '@tabler/icons-react';
import { PAGE_SIZES } from '@/shared/configuration/pagination';

export default function Select({ id, value, onChange, Icon, label, className = '', children, disabled = false }) {
  return (
    <label className={`relative flex h-10 items-center rounded-lg border border-line bg-panel text-xs font-bold transition-colors focus-within:border-lime focus-within:ring-2 focus-within:ring-lime/15 ${className}`}>
      {Icon && <Icon size={15} className='pointer-events-none absolute left-3 text-mute' />}
      <select id={id} aria-label={label} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}
        className={`h-full w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-8 outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-panel ${Icon ? 'pl-9' : 'pl-3'}`}>
        {children}
      </select>
      <IconSelector size={14} className='pointer-events-none absolute right-2.5 text-mute' />
    </label>
  );
};

export function SortSelect({ sorts, value, onChange, className }) {
  return <Select label='Sắp xếp' Icon={IconArrowsSort} value={value} onChange={onChange} className={className}>
    {sorts.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
  </Select>;
};

export function PageSizeSelect({ value, onChange, className }) {
  return <Select label='Số dòng mỗi trang' Icon={IconListNumbers} value={value} onChange={(next) => onChange(Number(next))} className={className}>
    {PAGE_SIZES.map((size) => <option key={size} value={size}>{size} / trang</option>)}
  </Select>;
};