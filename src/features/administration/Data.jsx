import { useState } from 'react';
import { JsonEditor, Tabs } from '@/shared/components/ui';
import { DATA_TABS } from '@/features/administration/config';
import Head from '@/features/administration/Head';
import ShopEditor from '@/features/administration/ShopEditor';
import * as api from '@/shared/library/api';

export default function AdminData() {
  const [tab, setTab] = useState('musicians');
  const [visited, setVisited] = useState(() => new Set(['musicians']));
  const visit = (next) => {
    setTab(next);
    setVisited((current) => current.has(next) ? current : new Set(current).add(next));
  };
  return (
    <div className='space-y-4'>
      <Head title='Dữ liệu' sub='Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu'>
        <Tabs tabs={DATA_TABS} value={tab} onChange={visit} />
      </Head>
      {DATA_TABS.map(([key]) => visited.has(key) && (
        <div key={key} hidden={tab !== key}>
          {key === 'shop' ? <ShopEditor /> : <JsonEditor deps={[key]} load={async () => (await api.adminData(key))[key]} save={(v) => api.adminSaveData(key, v)} />}
        </div>
      ))}
    </div>
  );
};