import { useId } from 'react';
import { IconArrowsSort, IconSelector } from '@tabler/icons-react';

export default function Select({ id, value, onChange, Icon, label, className = '', children, disabled = false }) {
  const generatedId = useId();
  const selectId = id || `select-${generatedId}`;
  return (
    <div className={`relative h-10 min-w-0 ${className}`}>
      <label htmlFor={selectId} className='sr-only'>{label || 'Lựa chọn'}</label>
      {Icon && <Icon size={16} className='pointer-events-none absolute top-1/2 left-3 z-10 -translate-y-1/2 text-mute' />}
      <select id={selectId} value={value} onChange={(event) => onChange(event.target.value)} disabled={disabled}
        className={`ui-control h-full w-full cursor-pointer appearance-none pr-9 text-xs font-semibold outline-none disabled:cursor-not-allowed disabled:opacity-50 [&>option]:bg-panel ${Icon ? 'pl-9' : 'pl-3'}`}>
        {children}
      </select>
      <IconSelector size={15} className='pointer-events-none absolute top-1/2 right-3 -translate-y-1/2 text-mute' />
    </div>
  );
};

export function SortSelect({ sorts, value, onChange, className }) {
  return <Select label='Sắp xếp' Icon={IconArrowsSort} value={value} onChange={onChange} className={className}>
    {sorts.map(([key, label]) => <option key={key} value={key}>{label}</option>)}
  </Select>;
};