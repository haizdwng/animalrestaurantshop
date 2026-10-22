import { useState } from 'react';
import { Tabs } from '@/shared/components/ui';
import { ADMIN_TABS } from '@/features/administration/config';
import GiftCodes from '@/features/administration/GiftCodes';
import AdminUsers from '@/features/administration/Users';
import AdminPlayers from '@/features/administration/Players';
import AdminData from '@/features/administration/Data';

export default function AdminPanel() {
  const [tab, setTab] = useState('giftcodes');
  const [visited, setVisited] = useState(() => new Set(['giftcodes']));
  const visit = (next) => {
    setTab(next);
    setVisited((current) => current.has(next) ? current : new Set(current).add(next));
  };

  return (
    <div className='app-screen space-y-4'>
      <Tabs tabs={ADMIN_TABS} value={tab} onChange={visit} />
      {visited.has('giftcodes') && <div hidden={tab !== 'giftcodes'}><GiftCodes /></div>}
      {visited.has('users') && <div hidden={tab !== 'users'}><AdminUsers /></div>}
      {visited.has('players') && <div hidden={tab !== 'players'}><AdminPlayers /></div>}
      {visited.has('data') && <div hidden={tab !== 'data'}><AdminData /></div>}
    </div>
  );
};