export default function Tabs({ tabs, value, onChange }) {
  return (
    <div className='flex gap-1 overflow-x-auto rounded-lg bg-panel p-1 scrollbar-none'>
      {tabs.map(([k, l, Icon]) => (
        <button key={k} onClick={() => onChange(k)} aria-current={value === k ? 'page' : undefined} className={`flex h-8 shrink-0 cursor-pointer items-center gap-2 rounded-md px-3 text-xs font-bold transition ${value === k ? 'bg-raise text-fg shadow-sm' : 'text-mute hover:text-fg'}`}>
          {Icon && <Icon size={15} />} {l}
        </button>
      ))}
    </div>
  );
};