import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { JsonEditor, Tabs } from '@/shared/components/ui';
import { DATA_TABS } from '@/features/administration/config';
import Head from '@/features/administration/Head';
import ShopEditor from '@/features/administration/ShopEditor';
import * as api from '@/shared/library/api';

export default function AdminData() {
  const { section } = useParams();
  const navigate = useNavigate();
  const activeSection = DATA_TABS.some(([key]) => key === section) ? section : 'musicians';

  useEffect(() => {
    if (!section || activeSection !== section)  navigate('/administrator/data/musicians', { replace: true });
  }, [section, activeSection, navigate]);

  const visit = (next) => navigate(`/administrator/data/${next}`);

  return (
    <div className='space-y-4'>
      <Head title='Dữ liệu' sub='Chỉnh sửa cấu hình · Ctrl/⌘ + S để lưu'>
        <Tabs tabs={DATA_TABS} value={activeSection} onChange={visit} />
      </Head>
      {activeSection === 'shop' ? (
        <ShopEditor />
      ) : (
        <JsonEditor
          key={activeSection}
          deps={[activeSection]}
          load={async () => (await api.adminData(activeSection))[activeSection]}
          save={(value) => api.adminSaveData(activeSection, value)}
        />
      )}
    </div>
  );
};