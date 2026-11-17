export default function Tabs({ tabs, value, onChange, label = 'Điều hướng danh mục' }) {
  return (
    <div role='tablist' aria-label={label} className='no-scrollbar flex min-w-0 gap-1 overflow-x-auto rounded-xl border border-line bg-panel p-1'>
      {tabs.map(([key, title, Icon]) => (
        <button key={key} role='tab' type='button' aria-selected={value === key} onClick={() => onChange(key)}
          className={`ui-nav-item shrink-0 whitespace-nowrap ${value === key ? 'bg-raise text-fg' : ''}`}>
          {Icon && <Icon size={16} />} {title}
        </button>
      ))}
    </div>
  );
};