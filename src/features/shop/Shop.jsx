import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconPlayerPlay, IconRefresh, IconShoppingCart } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, ErrorState, toast, toastError } from '@/shared/components/ui';
import * as api from '@/shared/library/api';
import TopUp from '@/shared/components/payment/TopUp';
import { PAGE, TOPUP } from '@/features/shop/config';
import { hasPrice, matches } from '@/features/shop/shopUtilities';
import { cartCount, cartPayload, cartTotal, changeCartQuantity, putInCart, resolveCart } from '@/features/shop/cartUtils';
import BuyDialog from '@/features/shop/BuyDialog';
import CartDialog from '@/features/shop/CartDialog';
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
  const navigate = useNavigate();
  const { section } = useParams();
  const tabs = shop.tabs || [];
  const tabId = section || tabs[0]?.id || null;
  const [q, setQ] = useState('');
  const [shown, setShown] = useState(PAGE);
  const [item, setItem] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [guide, setGuide] = useState(false);
  const [done, setDone] = useState(false);
  const { isOwned, markOwned } = useOwned(shop.tabs);
  const selectTab = (next) => navigate(`/shop/${next}`);

  useEffect(() => {
    if (!tabs.length) return;
    if (!section) {
      navigate(`/shop/${tabs[0].id}`, { replace: true });
      return;
    };
    if (section !== TOPUP && !tabs.some((tab) => tab.id === section)) navigate(`/shop/${tabs[0].id}`, { replace: true });
  }, [tabs, section, navigate]);
  useEffect(() => setShown(PAGE), [tabId, q]);

  const topup = tabId === TOPUP;
  const current = tabs.find((tab) => tab.id === tabId);
  const needle = q.trim().toLowerCase();
  const products = useMemo(() => (Array.isArray(current?.products) ? current.products : []).filter((p) => matches(p, needle)), [current, needle]);
  const hits = useMemo(() => Object.fromEntries(tabs.map((t) => {
    const products = Array.isArray(t.products) ? t.products : [];
    return [t.id, needle ? products.filter((p) => matches(p, needle)).length : products.length];
  })), [tabs, needle]);

  const entries = useMemo(() => resolveCart(cart, shop.tabs, isOwned), [cart, shop.tabs, isOwned]);
  const total = cartTotal(entries);
  const selected = item ? cart.find(({ id }) => String(id) === String(item.id)) : null;
  const selectedQuantity = selected?.quantity || 0;
  const cartQuantities = useMemo(() => new Map(cart.map(({ id, quantity }) => [String(id), quantity])), [cart]);
  const cartReady = shop.ready === true && Array.isArray(shop.tabs) && !shop.loading;
  const canPurchase = cartReady && entries.every(({ invalid }) => !invalid) && total <= user.coins;

  const open = (p) => {
    if (isOwned(p) || buying) return;
    setItem(p);
  };
  const addToCart = (product, quantity, category) => {
    const exists = cart.some(({ id }) => String(id) === String(product.id));
    setCart((items) => putInCart(items, product, quantity, category));
    toast(exists ? 'Đã cập nhật số lượng trong giỏ' : 'Đã thêm vật phẩm vào giỏ');
  };
  const removeFromCart = (id) => {
    setCart((items) => items.filter((entry) => String(entry.id) !== String(id)));
    if (cart.length === 1) setCartOpen(false);
  };
  const clearCart = () => {
    setCart([]);
    setCartOpen(false);
  };
  const purchase = async () => {
    if (buying || cart.length === 0 || !canPurchase) return;
    setBuying(true);
    try {
      const response = await api.buy(cartPayload(entries));
      if (response.user) onUser(response.user);
      for (const { product } of entries) if (product.once) markOwned(product.id);
      setCart([]);
      setCartOpen(false);
      setDone(true);
      toast(response.message || `Đã mua ${entries.length} loại vật phẩm thành công`);
    } catch (error) {
      toastError(error);
    } finally {
      setBuying(false);
    };
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
    if (!shop.tabs) return shop.error ? <ErrorState message={shop.error} onRetry={onReload} loading={shop.loading} /> : <ShopSkeleton />;
    return (
      <>
        <ShopToolbar title={current?.name} count={products.length} ownedCount={products.filter((p) => isOwned(p)).length} query={q} onQuery={setQ} loading={shop.loading} onReload={onReload} />

        {products.length === 0 ? (
          <EmptyProducts searching={!!needle} tabs={tabs} hits={hits} onSelect={selectTab} />
        ) : (
          <ul key={tabId} className={`grid animate-fade gap-2 transition-opacity sm:grid-cols-2 xl:grid-cols-3 ${shop.loading ? 'pointer-events-none opacity-50' : ''}`}>
            {products.slice(0, shown).map((p) => (
              <ProductItem key={p.id} p={p} owned={isOwned(p)} poor={hasPrice(p) && p.price > user.coins} cartQuantity={cartQuantities.get(String(p.id)) || 0} onBuy={() => open(p)} />
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
      {shop.ready !== false && <CategoryNav tabs={shop.tabs} tabId={tabId} hits={hits} onSelect={selectTab} />}

      <section className={`app-screen min-w-0 md:p-0 ${cart.length > 0 ? 'pb-28 md:pb-24' : ''}`}>
        {topup && shop.ready !== false ? <TopUp user={user} onPaid={onRefresh} /> : renderCatalogue()}
      </section>

      {cart.length > 0 && (
        <div className='fixed inset-x-3 bottom-[calc(var(--app-bottom-nav-h)+.75rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md md:right-5 md:bottom-5 md:left-auto md:mx-0'>
          <button
            type='button'
            onClick={() => setCartOpen(true)}
            className='flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-lime/35 bg-panel px-3 py-3 text-left shadow-xl shadow-black/40 backdrop-blur-md transition hover:border-lime hover:bg-raise focus-visible:outline-2 focus-visible:outline-lime'
          >
            <span className='relative grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-bg'>
              <IconShoppingCart size={20} stroke={2.2} />
              <span className='absolute -top-2 -right-2 grid min-w-5 h-5 place-items-center rounded-full bg-fg px-1 text-[10px] font-extrabold text-bg tabular-nums'>{formatNumber(cart.length)}</span>
            </span>
            <span className='min-w-0 flex-1'>
              <span className='block text-xs font-extrabold'>Giỏ hàng · {formatNumber(cartCount(entries))} vật phẩm</span>
              <span className='mt-0.5 flex items-center gap-1 text-xs font-bold text-coin'><Coin size={13} /> {formatNumber(total)}</span>
            </span>
            <span className='shrink-0 rounded-lg bg-lime px-3 py-2 text-[11px] font-extrabold text-bg'>Xem giỏ & mua</span>
          </button>
        </div>
      )}

      <BuyDialog
        key={item?.id ?? ''}
        item={item}
        category={current?.name}
        user={user}
        cartQuantity={selectedQuantity}
        cartTotal={total}
        onAdd={addToCart}
        onClose={() => setItem(null)}
        onTopUp={() => {
          setItem(null);
          selectTab(TOPUP);
        }}
      />
      <CartDialog
        open={cartOpen}
        entries={entries}
        coins={user.coins}
        ready={cartReady}
        buying={buying}
        onClose={() => setCartOpen(false)}
        onQuantity={(id, quantity) => setCart((items) => changeCartQuantity(items, id, quantity))}
        onRemove={removeFromCart}
        onClear={clearCart}
        onBuy={purchase}
        onTopUp={() => {
          setCartOpen(false);
          selectTab(TOPUP);
        }}
      />
      <PurchaseDoneDialog open={done} onClose={() => setDone(false)} />
      <GuideVideoDialog open={guide} src={START_VIDEO} onClose={() => setGuide(false)} />
    </div>
  );
};