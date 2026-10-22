import { useEffect, useMemo, useState } from 'react';
import { IconPlayerPlay, IconRefresh } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, ErrorState } from '@/shared/components/ui';
import TopUp from '@/shared/components/payment/TopUp';
import { PAGE, TOPUP } from '@/features/shop/config';
import { hasPrice, matches } from '@/features/shop/shopUtilities';
import BuyDialog from '@/features/shop/BuyDialog';
import CategoryNav from '@/features/shop/CategoryNav';
import EmptyProducts from '@/features/shop/EmptyProducts';
import ProductItem from '@/features/shop/ProductItem';
import ShopSkeleton from '@/features/shop/ShopSkeleton';
import ShopToolbar from '@/features/shop/ShopToolbar';
import GuideVideoDialog from '@/features/shop/GuideVideoDialog';
import PurchaseDoneDialog from '@/features/shop/PurchaseDoneDialog';

const START_VIDEO = `${import.meta.env.BASE_URL}videos/start.mp4`;

function useOwned(resetKey) {
  const [ownedIds, setOwnedIds] = useState(() => new Set());
  useEffect(() => setOwnedIds(new Set()), [resetKey]);
  const isOwned = (p) => !!p?.once && (p.owned || ownedIds.has(p.id));
  const markOwned = (id) => setOwnedIds((s) => new Set(s).add(id));
  return { isOwned, markOwned };
};

export default function Shop({ user, onUser, shop, onReload, onRefresh }) {
  const tabs = shop.tabs || [];
  const [tabId, setTabId] = useState(null);
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [item, setItem] = useState(null);
  const [guide, setGuide] = useState(false);
  const [done, setDone] = useState(false);
  const { isOwned, markOwned } = useOwned(shop.tabs);

  useEffect(() => {
    if (tabId !== TOPUP && tabs.length && !tabs.some((t) => t.id === tabId)) setTabId(tabs[0].id);
  }, [tabs, tabId]);
  useEffect(() => setShown(PAGE), [tabId, q]);

  const topup = tabId === TOPUP;
  const current = tabs.find((t) => t.id === tabId);
  const needle = q.trim().toLowerCase();
  const products = useMemo(() => (Array.isArray(current?.products) ? current.products : []).filter((p) => matches(p, needle)), [current, needle]);
  const hits = useMemo(() => Object.fromEntries(tabs.map((t) => {
    const products = Array.isArray(t.products) ? t.products : [];
    return [t.id, needle ? products.filter((p) => matches(p, needle)).length : products.length];
  })), [tabs, needle]);

  const open = (p) => {
    if (isOwned(p)) return;
    setItem(p);
  };

  const renderCatalogue = () => {
    if (shop.ready === false) return (
      <div className='flex min-h-[min(26rem,calc(100dvh-12rem))] items-center justify-center p-4 sm:p-8' role='alert'>
        <div className='w-full max-w-md rounded-2xl border border-bad/40 bg-panel p-5 text-center shadow-lg shadow-black/10 sm:p-8'>
          <h2 className='text-base font-bold'>Cửa hàng chưa sẵn sàng</h2>
          <p className='mt-2 text-sm leading-6 text-mute'>{shop.readyMessage}</p>
          <div className='mt-5 grid gap-2 sm:grid-cols-2'>
            <Button variant='ghost' onClick={() => setGuide(true)}>
              <IconPlayerPlay size={16} /> Xem hướng dẫn
            </Button>
            <Button loading={shop.loading} onClick={onReload}>
              <IconRefresh size={16} /> Kiểm tra lại
            </Button>
          </div>
        </div>
      </div>
    );
    if (!shop.tabs) return shop.error ? <ErrorState message={shop.error} onRetry={onReload} loading={shop.loading} /> : <ShopSkeleton />
    return (
      <>
        <ShopToolbar title={current?.name} count={products.length} ownedCount={products.filter((p) => isOwned(p)).length} query={q} onQuery={setQ} loading={shop.loading} onReload={onReload} />

        {products.length === 0 ? (
          <EmptyProducts searching={!!needle} tabs={tabs} hits={hits} onSelect={setTabId} />
        ) : (
          <ul key={tabId} className={`grid animate-fade gap-2 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${shop.loading ? 'pointer-events-none opacity-50' : ''}`}>
            {products.slice(0, shown).map((p) => (
              <ProductItem key={p.id} p={p} owned={isOwned(p)} poor={hasPrice(p) && p.price > user.coins} onBuy={() => open(p)} />
            ))}
          </ul>
        )}

        {products.length > shown && (
          <div className='mt-6 flex flex-col items-center gap-2'>
            <p className='text-[11px] text-mute tabular-nums'>
              Đang hiện {formatNumber(shown)} / {formatNumber(products.length)}
            </p>
            <Button variant='ghost' size='sm' onClick={() => setShown((n) => n + PAGE * 2)}>
              Xem thêm
            </Button>
          </div>
        )}
      </>
    );
  };

  return (
    <div className={shop.ready === false ? 'md:px-6 md:py-6' : 'md:grid md:grid-cols-[220px_1fr] md:gap-6 md:px-6 md:py-6'}>
      {shop.ready !== false && <CategoryNav tabs={shop.tabs} tabId={tabId} hits={hits} onSelect={setTabId} />}

      <section className='app-screen min-w-0 md:p-0'>{topup && shop.ready !== false ? <TopUp user={user} onPaid={onRefresh} /> : renderCatalogue()}</section>

      <BuyDialog
        key={item?.id ?? ''}
        item={item}
        category={current?.name}
        user={user}
        onUser={onUser}
        onOwned={markOwned}
        onBought={() => setDone(true)}
        onClose={() => setItem(null)}
        onTopUp={() => {
          setItem(null);
          setTabId(TOPUP);
        }}
      />
      <PurchaseDoneDialog open={done} onClose={() => setDone(false)} />
      <GuideVideoDialog open={guide} src={START_VIDEO} onClose={() => setGuide(false)} />
    </div>
  );
};