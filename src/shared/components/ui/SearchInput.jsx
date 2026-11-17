import { IconSearch, IconX } from '@tabler/icons-react';

export default function SearchInput({ value, onChange, placeholder = 'Tìm kiếm…', label = 'Tìm kiếm', className = '', disabled = false }) {
  return (
    <div className={`ui-control flex h-10 min-w-0 items-center gap-2.5 px-3 ${className}`}>
      <IconSearch size={17} className='shrink-0 text-mute' />
      <input type='search' aria-label={label} value={value} onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder} disabled={disabled}
        className='min-w-0 flex-1 appearance-none bg-transparent text-sm outline-none placeholder:text-mute/70 [&::-webkit-search-cancel-button]:hidden' />
      {value && <button type='button' aria-label='Xóa nội dung tìm kiếm' title='Xóa tìm kiếm' disabled={disabled}
        onClick={() => onChange('')} className='grid size-7 shrink-0 cursor-pointer place-items-center rounded-md text-mute hover:bg-raise hover:text-fg'>
        <IconX size={16} />
      </button>}
    </div>
  );
};