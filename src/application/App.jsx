import { lazy, Suspense, useEffect, useRef, useSyncExternalStore } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui';
import { getPendingRequestCount, isAdmin, subscribeToRequests } from '@/shared/library/api';
import { DEFAULT_TAB, getNavigationItemsForRole } from '@/shared/configuration/navigation';
import AppHeader from '@/shared/components/layout/AppHeader';
import BottomNav from '@/shared/components/layout/BottomNav';
import BootScreen from '@/shared/components/layout/BootScreen';
import useSession from '@/shared/hooks/useSession';
import useShop from '@/shared/hooks/useShop';

const Auth = lazy(() => import('@/features/authentication/Auth'));
const Shop = lazy(() => import('@/features/shop/Shop'));
const Account = lazy(() => import('@/features/account/Account'));
const Avatar = lazy(() => import('@/features/avatar/Avatar'));
const AdminPanel = lazy(() => import('@/features/administration/AdminPanel'));
const AdminGiftCodes = lazy(() => import('@/features/administration/GiftCodes'));
const AdminUsers = lazy(() => import('@/features/administration/Users'));
const AdminPlayers = lazy(() => import('@/features/administration/Players'));
const AdminData = lazy(() => import('@/features/administration/Data'));

function StartRoute() {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const redirect = new URLSearchParams(location.search).get('redirect');
    navigate(redirect?.startsWith('/') ? redirect : `/${DEFAULT_TAB}`, { replace: true });
  }, [location.search, navigate]);

  return null;
};

function PlayerRouteRedirect() {
  const { openid } = useParams();

  return <Navigate to={`/administrator/players/${encodeURIComponent(openid)}/player`} replace />;
};

function AppContent() {
  const session = useSession();
  const { status, user, setUser, refreshUser } = session;
  const location = useLocation();
  const navigate = useNavigate();
  const lockedPath = useRef('');
  const pendingRequestCount = useSyncExternalStore(subscribeToRequests, getPendingRequestCount, getPendingRequestCount);
  const requestsPending = pendingRequestCount > 0;
  const current = location.pathname.split('/').filter(Boolean)[0] || DEFAULT_TAB;
  const admin = isAdmin(user);
  const { shop, load: loadShop } = useShop(status === 'authed' && current === 'shop', admin);

  const currentPath = `${location.pathname}${location.search}${location.hash}`;

  useEffect(() => {
    if (!requestsPending) {
      lockedPath.current = '';
      return;
    };

    if (!lockedPath.current) lockedPath.current = currentPath;
    if (currentPath !== lockedPath.current) navigate(lockedPath.current, { replace: true });
  }, [requestsPending, currentPath, navigate]);

  useEffect(() => {
    if (!requestsPending) return;

    const restorePath = () => {
      if (lockedPath.current) navigate(lockedPath.current, { replace: true });
    };
    const preventInteraction = (event) => {
      event.preventDefault();
      event.stopImmediatePropagation();
    };

    window.addEventListener('popstate', restorePath);
    window.addEventListener('keydown', preventInteraction, true);
    window.addEventListener('keyup', preventInteraction, true);
    window.addEventListener('wheel', preventInteraction, { capture: true, passive: false });
    window.addEventListener('touchmove', preventInteraction, { capture: true, passive: false });
    window.addEventListener('pointerdown', preventInteraction, true);
    window.addEventListener('click', preventInteraction, true);
    window.addEventListener('submit', preventInteraction, true);

    return () => {
      window.removeEventListener('popstate', restorePath);
      window.removeEventListener('keydown', preventInteraction, true);
      window.removeEventListener('keyup', preventInteraction, true);
      window.removeEventListener('wheel', preventInteraction, true);
      window.removeEventListener('touchmove', preventInteraction, true);
      window.removeEventListener('pointerdown', preventInteraction, true);
      window.removeEventListener('click', preventInteraction, true);
      window.removeEventListener('submit', preventInteraction, true);
    };
  }, [requestsPending, navigate]);

  const navigateTab = (next) => {
    if (requestsPending) return;
    navigate(`/${next}`);
  };

  if (status === 'checking') {
    return (
      <div inert={requestsPending}>
        <Toaster />
        <BootScreen error={session.bootError} onRetry={session.boot} onSwitchAccount={session.abandonBoot} />
      </div>
    );
  };

  if (status === 'guest') {
    return (
      <div inert={requestsPending}>
        <Toaster />
        <Suspense fallback={null}>
          <Auth
            onAuthed={(nextUser) => {
              session.signIn(nextUser);
              navigate(`/${DEFAULT_TAB}`, { replace: true });
            }}
          />
        </Suspense>
      </div>
    );
  };

  const navigationItems = getNavigationItemsForRole(admin);
  const activeTab = navigationItems.some(([key]) => key === current) ? current : DEFAULT_TAB;

  return (
    <div
      className='min-h-dvh pb-[calc(var(--app-bottom-nav-h)+env(safe-area-inset-bottom))] md:pb-0'
      style={{ '--app-header-h': '3.5rem', '--app-bottom-nav-h': '4rem' }}
    >
      <Toaster />
      <div inert={requestsPending}>
        <AppHeader nav={navigationItems} current={activeTab} onNavigate={navigateTab} coins={user.coins} syncing={session.syncing} onRefresh={refreshUser} />
        <main className='mx-auto w-full max-w-6xl'>
          <Suspense fallback={null}>
            <Routes>
              <Route path='/' element={<StartRoute />} />
              <Route path='/shop' element={<Shop user={user} onUser={setUser} shop={shop} onReload={loadShop} onRefresh={refreshUser} />} />
              <Route path='/avatar' element={<Avatar onUser={setUser} />} />
              <Route path='/administrator' element={admin ? <AdminPanel /> : <Navigate to='/shop' replace />}>
                <Route index element={<Navigate to='giftcodes' replace />} />
                <Route path='giftcodes' element={<AdminGiftCodes />} />
                <Route path='users' element={<AdminUsers />} />
                <Route path='players' element={<AdminPlayers />} />
                <Route path='players/:openid' element={<PlayerRouteRedirect />} />
                <Route path='players/:openid/:section' element={<AdminPlayers />} />
                <Route path='data' element={<Navigate to='/administrator/data/musicians' replace />} />
                <Route path='data/:section' element={<AdminData />} />
                <Route path='*' element={<Navigate to='/administrator/giftcodes' replace />} />
              </Route>
              <Route path='/user' element={<Account user={user} onUser={setUser} onRefresh={refreshUser} onLogout={session.logout} />} />
              <Route path='*' element={<Navigate to='/shop' replace />} />
            </Routes>
          </Suspense>
        </main>
        <BottomNav nav={navigationItems} current={activeTab} onNavigate={navigateTab} />
      </div>
    </div>
  );
};

export default function App() {
  return <AppContent />;
};