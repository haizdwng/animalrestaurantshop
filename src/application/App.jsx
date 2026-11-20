import { lazy, Suspense, useEffect, useSyncExternalStore } from 'react';
import { Navigate, Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import { Toaster } from '@/shared/components/ui';
import { getPendingCoinRequestCount, getPendingRequestCount, isAdmin, subscribeToRequests } from '@/shared/library/api';
import { DEFAULT_TAB, getNavigationItemsForRole, getLoginDestination, getRequestedDestination } from '@/shared/configuration/navigation';
import AppHeader from '@/shared/components/layout/AppHeader';
import BottomNav from '@/shared/components/layout/BottomNav';
import BootScreen from '@/shared/components/layout/BootScreen';
import useSession from '@/shared/hooks/useSession';
import useShop from '@/shared/hooks/useShop';
import useCheckin from '@/shared/hooks/useCheckin';

const Auth = lazy(() => import('@/features/authentication/Auth'));
const Shop = lazy(() => import('@/features/shop/Shop'));
const Account = lazy(() => import('@/features/account/Account'));
const AdminPanel = lazy(() => import('@/features/administration/AdminPanel'));
const AdminGiftCodes = lazy(() => import('@/features/administration/GiftCodes'));
const AdminUsers = lazy(() => import('@/features/administration/Users'));
const AdminPlayers = lazy(() => import('@/features/administration/Players'));
const AdminData = lazy(() => import('@/features/administration/Data'));

const AUTHENTICATION_PATHS = ['/login', '/register', '/forgot'];

function StartRoute() {
  const location = useLocation();
  return <Navigate to={getRequestedDestination(location.search)} replace />;
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
  const pendingRequestCount = useSyncExternalStore(subscribeToRequests, getPendingRequestCount, getPendingRequestCount);
  const pendingCoinRequestCount = useSyncExternalStore(subscribeToRequests, getPendingCoinRequestCount, getPendingCoinRequestCount);
  const requestsPending = pendingRequestCount > 0;
  const coinSyncing = pendingCoinRequestCount > 0;
  const pathSegment = location.pathname.split('/').filter(Boolean)[0];
  const current = pathSegment || DEFAULT_TAB;
  const admin = isAdmin(user);
  const { shop, load: loadShop, applyPurchase: updateShopAfterPurchase } = useShop(status === 'authed' && pathSegment === 'shop', admin);
  const checkin = useCheckin(status === 'authed');

  useEffect(() => {
    const preventDuplicateSubmit = (event) => {
      if (getPendingRequestCount() === 0 || event.target.closest('[data-local-submit]')) return;
      event.preventDefault();
      event.stopImmediatePropagation();
    };
    document.addEventListener('submit', preventDuplicateSubmit, true);
    return () => document.removeEventListener('submit', preventDuplicateSubmit, true);
  }, []);

  if (status === 'checking') {
    return (
      <div>
        <Toaster />
        <BootScreen error={session.bootError} onRetry={session.boot} onSwitchAccount={session.abandonBoot} />
      </div>
    );
  };

  if (status === 'guest') {
    if (!AUTHENTICATION_PATHS.includes(location.pathname)) return <Navigate to={getLoginDestination(location)} replace />;

    return (
      <div>
        <Toaster />
        <Suspense fallback={null}>
          <Auth
            onAuthed={(nextUser) => {
              const destination = getRequestedDestination(location.search);
              session.signIn(nextUser);
              navigate(destination, { replace: true });
            }}
          />
        </Suspense>
      </div>
    );
  };

  if (AUTHENTICATION_PATHS.includes(location.pathname)) return <Navigate to={getRequestedDestination(location.search)} replace />;

  const navigationItems = getNavigationItemsForRole(admin);
  const activeTab = navigationItems.some(([key]) => key === current) ? current : DEFAULT_TAB;

  return (
    <div
      className='min-h-dvh pb-[calc(var(--app-bottom-nav-h)+env(safe-area-inset-bottom))] md:pb-0'
      style={{ '--app-header-h': '3.5rem', '--app-bottom-nav-h': '4rem' }}
    >
      <Toaster />
      <AppHeader nav={navigationItems} current={activeTab} onNavigate={(next) => navigate(`/${next}`)} coins={user.coins} syncing={requestsPending} coinSyncing={coinSyncing} onRefresh={refreshUser} badgeKeys={checkin.showBadge ? ['user'] : []} />
      <main className='mx-auto w-full max-w-6xl'>
        <Suspense fallback={null}>
          <Routes>
            <Route path='/' element={<StartRoute />} />
            <Route path='/shop/:section?' element={<Shop user={user} onUser={setUser} shop={shop} onReload={loadShop} onRefresh={refreshUser} onPurchase={updateShopAfterPurchase} />} />
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
            <Route path='/user' element={<Account user={user} onUser={setUser} onRefresh={refreshUser} onLogout={session.logout} checkin={checkin} />} />
            <Route path='*' element={<Navigate to='/shop' replace />} />
          </Routes>
        </Suspense>
      </main>
      <BottomNav nav={navigationItems} current={activeTab} onNavigate={(next) => navigate(`/${next}`)} badgeKeys={checkin.showBadge ? ['user'] : []} />
    </div>
  );
};

export default function App() {
  return <AppContent />;
};