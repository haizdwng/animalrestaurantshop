import { IconPackageOff } from '@tabler/icons-react';
import { Button } from '@/shared/components/ui';

export default function EmptyProducts({ searching, tabs = [], hits = {}, onSelect }) {
  const elsewhere = searching ? tabs.filter((tab) => hits[tab.id] > 0) : [];
  return (
    <div className='ui-card flex min-h-56 flex-col items-center justify-center gap-3 p-6 text-center'>
      <span className='grid size-12 place-items-center rounded-2xl bg-raise text-mute'><IconPackageOff size={28} stroke={1.5} /></span>
      <p className='max-w-xs text-xs leading-relaxed text-mute'>
        {searching ? 'Không có vật phẩm khớp với tìm kiếm trong danh mục này.' : 'Danh mục hiện chưa có vật phẩm.'}
      </p>
      {elsewhere.length > 0 && (
        <div className='flex max-w-full flex-wrap justify-center gap-2'>
          {elsewhere.map((tab) => <Button key={tab.id} variant='ghost' size='sm' onClick={() => onSelect(tab.id)}>
            {tab.name} · {hits[tab.id]}
          </Button>)}
        </div>
      )}
    </div>
  );
};