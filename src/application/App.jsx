import { lazy, Suspense, useState } from 'react';
import { Toaster } from '@/shared/components/ui';
import { isAdmin } from '@/shared/library/api';
import { DEFAULT_TAB, TAB_KEYS, getNavigationItemsForRole } from '@/shared/configuration/navigation';
import AppHeader from '@/shared/components/layout/AppHeader';
import BottomNav from '@/shared/components/layout/BottomNav';
import BootScreen from '@/shared/components/layout/BootScreen';
import useHashTab from '@/shared/hooks/useHashTab';
import useSession from '@/shared/hooks/useSession';
import useShop from '@/shared/hooks/useShop';

const Auth = lazy(() => import('@/features/authentication/Auth'));
const Shop = lazy(() => import('@/features/shop/Shop'));
const Account = lazy(() => import('@/features/account/Account'));
const Avatar = lazy(() => import('@/features/avatar/Avatar'));
const AdminPanel = lazy(() => import('@/features/administration/AdminPanel'));

export default function App() {
  const session = useSession();
  const { status, user, setUser, refreshUser } = session;
  const [tab, setTab] = useHashTab(TAB_KEYS, DEFAULT_TAB);
  const { shop, load: loadShop } = useShop(status === 'authed' && tab === TAB_KEYS[0], isAdmin(user));
  const [visited, setVisited] = useState(() => new Set([TAB_KEYS.includes(tab) ? tab : DEFAULT_TAB]));

  if (status === 'checking') return (
    <>
      <Toaster />
      <BootScreen error={session.bootError} onRetry={session.boot} onSwitchAccount={session.abandonBoot} />
    </>
  );

  if (status === 'guest') return (
    <>
      <Toaster />
      <Suspense fallback={null}>
        <Auth
          onAuthed={(u) => {
            session.signIn(u)
            setTab(DEFAULT_TAB)
          }}
        />
      </Suspense>
    </>
  );

  const navigationItems = getNavigationItemsForRole(isAdmin(user));
  const current = navigationItems.some((n) => n[0] === tab) ? tab : DEFAULT_TAB;
  const navigate = (next) => {
    setTab(next);
    setVisited((currentTabs) => currentTabs.has(next) ? currentTabs : new Set(currentTabs).add(next));
  };

  const screens = {
    administrator: () => <AdminPanel />,
    shop: () => <Shop user={user} onUser={setUser} shop={shop} onReload={loadShop} onRefresh={refreshUser} />,
    avatar: () => <Avatar onUser={setUser} />,
    user: () => <Account user={user} onUser={setUser} onRefresh={refreshUser} onLogout={session.logout} />
  };

  return (
    <div
      className='min-h-dvh pb-[calc(var(--app-bottom-nav-h)+env(safe-area-inset-bottom))] md:pb-0'
      style={{ '--app-header-h': '3.5rem', '--app-bottom-nav-h': '4rem' }}
    >
      <Toaster />
      <AppHeader nav={navigationItems} current={current} onNavigate={navigate} coins={user.coins} syncing={session.syncing} onRefresh={refreshUser} />
      <main className='mx-auto w-full max-w-6xl'>
        <Suspense fallback={null}>
          {Object.entries(screens).map(([key, render]) => visited.has(key) && (
            <div key={key} hidden={current !== key}>
              {render()}
            </div>
          ))}
        </Suspense>
      </main>
      <BottomNav nav={navigationItems} current={current} onNavigate={navigate} />
    </div>
  );
};