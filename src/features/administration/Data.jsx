import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JsonEditor, Tabs } from '@/shared/components/ui';
import { DATA_TABS } from '@/features/administration/config';
import Head from '@/features/administration/Head';
import * as api from '@/shared/library/api';

const DEFAULT_DATA_SECTION = 'musicians';

export default function AdminData() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = DATA_TABS.some(([key]) => key === section) ? section : DEFAULT_DATA_SECTION;

  useEffect(() => {
    if (!section || activeSection !== section) navigate(`/administrator/data/${DEFAULT_DATA_SECTION}`, { replace: true });
  }, [section, activeSection, navigate]);

  return (
    <div className='space-y-4'>
      <Head title='Dữ liệu' sub='Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu'>
        <Tabs tabs={DATA_TABS} value={activeSection} onChange={(next) => navigate(`/administrator/data/${next}`)} />
      </Head>
      <JsonEditor
        key={activeSection}
        deps={[activeSection]}
        load={async () => (await api.adminData(activeSection))[activeSection]}
        save={(value) => api.adminSaveData(activeSection, value)}
      />
    </div>
  );
};