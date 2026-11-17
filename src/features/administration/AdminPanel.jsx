import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { Tabs } from '@/shared/components/ui';
import { ADMIN_TABS } from '@/features/administration/config';

export default function AdminPanel() {
  const location = useLocation();
  const navigate = useNavigate();
  const requestedTab = location.pathname.replace(/^\/administrator\/?/, '').split('/')[0] || 'giftcodes';
  const activeTab = ADMIN_TABS.some(([key]) => key === requestedTab) ? requestedTab : 'giftcodes';
  return (
    <div className='app-screen space-y-5'>
      <Tabs tabs={ADMIN_TABS} value={activeTab} label='Quản trị viên' onChange={(next) => navigate(`/administrator/${next}`)} />
      <Outlet />
    </div>
  );
};