import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from '@/shared/components/ui';
import { ADMIN_TABS } from '@/features/administration/config';

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const relativePath = location.pathname.replace(/^\/administrator\/?/, '');
  const requestedTab = relativePath.split('/')[0] || 'giftcodes';
  const tab = ADMIN_TABS.some(([key]) => key === requestedTab) ? requestedTab : 'giftcodes';

  const visit = (next) => navigate(`/administrator/${next}`);

  return (
    <div className='app-screen space-y-4'>
      <Tabs tabs={ADMIN_TABS} value={tab} onChange={visit} />
      <Outlet />
    </div>
  );
};