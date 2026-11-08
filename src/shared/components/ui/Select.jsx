import { IconArrowsSort, IconListNumbers, IconSelector } from '@tabler/icons-react';
import { PAGE_SIZES } from '@/shared/configuration/pagination';

export default function Select({ value, onChange, Icon, label, className = '', children }) {
  return (
    <label className={`relative flex h-10 items-center rounded-lg border border-line bg-panel text-xs font-bold focus-within:border-lime ${className}`}>
      {Icon && <Icon size={15} className='pointer-events-none absolute left-3 text-mute' />}
      <select aria-label={label} value={value} onChange={(e) => onChange(e.target.value)} className={`h-full w-full min-w-0 cursor-pointer appearance-none bg-transparent pr-8 outline-none [&>option]:bg-panel ${Icon ? 'pl-9' : 'pl-3'}`}>
        {children}
      </select>
      <IconSelector size={14} className='pointer-events-none absolute right-2.5 text-mute' />
    </label>
  );
};

export function SortSelect({ sorts, value, onChange, className }) {
  return (
    <Select label='Sắp xếp' Icon={IconArrowsSort} value={value} onChange={onChange} className={className}>
      {sorts.map(([k, l]) => (
        <option key={k} value={k}>
          {l}
        </option>
      ))}
    </Select>
  );
};

export function PageSizeSelect({ value, onChange, className }) {
  return (
    <Select label='Số dòng mỗi trang' Icon={IconListNumbers} value={value} onChange={(v) => onChange(Number(v))} className={className}>
      {PAGE_SIZES.map((n) => (
        <option key={n} value={n}>
          {n} / trang
        </option>
      ))}
    </Select>
  );
};