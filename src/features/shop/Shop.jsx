import { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { IconPlayerPlay, IconRefresh, IconShoppingCart, IconTrash } from '@tabler/icons-react';
import { formatNumber } from '@/shared/library/format';
import { Button, Coin, ErrorState, toast, toastError } from '@/shared/components/ui';
import usePaginatedData from '@/shared/hooks/usePaginatedData';
import useRequestPending from '@/shared/hooks/useRequestPending';
import { matchesShopFilter, ownershipStatus } from '@/features/shop/shopFilters';
import * as api from '@/shared/library/api';
import TopUp from '@/shared/components/payment/TopUp';
import { TOPUP } from '@/features/shop/config';
import { hasPrice, matches } from '@/features/shop/shopUtilities';
import { addCategoryToCart, cartCount, cartLineId, cartPayload, cartTotal, createCartLine, isDirectlyAvailable, putInCart, removeCategoryFromCart, resolveCart } from '@/features/shop/cartUtils';
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
const quantityId = (category, key) => JSON.stringify([category, key]);

export default function Shop({ user, onUser, shop, onReload, onRefresh, onPurchase }) {
  const navigate = useNavigate();
  const requestPending = useRequestPending();
  const { section } = useParams();
  const tabs = shop.tabs || [];
  const tabId = section || tabs[0]?.id || null;
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState('all');
  const [now, setNow] = useState(() => Date.now());
  const [editing, setEditing] = useState(null);
  const [cart, setCart] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [buying, setBuying] = useState(false);
  const [guide, setGuide] = useState(false);
  const [done, setDone] = useState(false);
  const maxQuantity = api.isAdmin(user) ? api.ADMIN_MAX_QTY : api.MAX_QTY;
  const selectTab = (next) => navigate(`/shop/${next}`);

  useEffect(() => {
    const refreshClock = () => setNow(Date.now());
    const interval = window.setInterval(refreshClock, 30000);
    window.addEventListener('focus', refreshClock);
    document.addEventListener('visibilitychange', refreshClock);
    return () => {
      window.clearInterval(interval);
      window.removeEventListener('focus', refreshClock);
      document.removeEventListener('visibilitychange', refreshClock);
    };
  }, []);
  useEffect(() => {
    if (!tabs.length) return;
    if (!section || (section !== TOPUP && !tabs.some((tab) => tab.id === section))) navigate(`/shop/${tabs[0].id}`, { replace: true });
  }, [tabs, section, navigate]);

  const topup = tabId === TOPUP;
  const current = tabs.find((tab) => tab.id === tabId);
  const needle = query.trim().toLowerCase();
  const entries = useMemo(() => resolveCart(cart, shop.tabs, maxQuantity, now), [cart, shop.tabs, maxQuantity, now]);
  const total = cartTotal(entries);
  const quantites = useMemo(() => {
    const map = new Map();
    for (const entry of cart) {
      const id = quantityId(entry.category, entry.key);
      map.set(id, (map.get(id) || 0) + entry.amount);
    };
    return map;
  }, [cart]);
  const productsIn = (category) => (category?.products || []).filter((product) => matches(product, needle) && matchesShopFilter(product, filter, { cart, category: category.id, accountLimit: maxQuantity, now }));
  const products = useMemo(() => productsIn(current), [current, needle, filter, cart, maxQuantity, now]);
  const hits = useMemo(() => Object.fromEntries(tabs.map((tab) => [tab.id, productsIn(tab).length])), [tabs, needle, filter, cart, maxQuantity, now]);
  const { rows: productRows, pager: productPager } = usePaginatedData(products, `${tabId}|${needle}|${filter}`);
  const ownedCount = (current?.products || []).filter((product) => ownershipStatus(product) === true).length;
  const categoryProducts = current?.products || [];
  const eligible = categoryProducts.filter((node) => isDirectlyAvailable(node, now));
  const categoryAdded = eligible.filter((node) => cart.some((line) => line.category === current.id && line.key === node.key && Object.keys(line.selections || {}).length === 0)).length;
  const allCategoryAdded = eligible.length > 0 && categoryAdded === eligible.length;
  const cartReady = shop.ready === true && Array.isArray(shop.tabs);
  const canPurchase = cartReady && entries.length > 0 && entries.length <= 5000 && entries.every((entry) => !entry.invalid) && Number.isSafeInteger(total) && total <= user.coins && !requestPending;

  const addToCart = (line, replaceLineId = null) => {
    try {
      const baseline = replaceLineId ? cart.filter((entry) => cartLineId(entry) !== replaceLineId) : cart;
      const next = putInCart(baseline, line, shop.tabs, maxQuantity, now);
      setCart(next);
      setEditing(null);
      toast('Đã cập nhật giỏ hàng');
    } catch (error) {
      toast(error.message || 'Không thể thêm vào giỏ', 'err');
    };
  };
  const toggleCategoryCart = () => {
    if (!current || !cartReady || buying || !eligible.length) return;
    if (allCategoryAdded) {
      setCart(removeCategoryFromCart(cart, current.id));
      toast('Đã xóa vật phẩm thuộc danh mục khỏi giỏ');
    } else {
      const next = addCategoryToCart(cart, current.id, categoryProducts, shop.tabs, maxQuantity, now);
      setCart(next);
      toast(`Đã thêm ${next.length - cart.length} loại vật phẩm vào giỏ`);
    };
  };
  const removeFromCart = (id) => {
    const next = cart.filter((entry) => cartLineId(entry) !== id);
    setCart(next);
    if (!next.length) setCartOpen(false);
  };
  const clearCart = () => { setCart([]); setCartOpen(false); };
  const updateAmount = (id, amount) => setCart((currentCart) => currentCart.map((entry) => cartLineId(entry) === id ? { ...entry, amount } : entry));
  const editEntry = (entry) => {
    setCartOpen(false);
    setEditing({ item: entry.node, category: tabs.find((tab) => tab.id === entry.category), line: entry });
  };
  const purchase = async () => {
    if (!canPurchase || buying) return;
    const fresh = resolveCart(cart, shop.tabs, maxQuantity, Date.now());
    if (fresh.some((entry) => entry.invalid)) {
      setNow(Date.now());
      toast('Giỏ hàng không còn hợp lệ; hãy kiểm tra lại', 'err');
      return;
    };
    setBuying(true);
    try {
      const response = await api.buy(cartPayload(fresh));
      if (Number.isSafeInteger(response.coin)) onUser({ ...user, coin: response.coin, coins: response.coin });
      setCart([]);
      setCartOpen(false);
      setDone(true);
      toast(response.message || 'Mua thành công');
      await onPurchase?.();
    } catch (error) {
      toastError(error);
    } finally {
      setBuying(false);
    };
  };

  const renderCatalogue = () => {
    if (shop.ready === false) return <div className='flex min-h-[min(26rem,calc(100dvh-12rem))] items-center justify-center p-4 sm:p-8' role='alert'>
      <div className='w-full max-w-md rounded-2xl border border-bad/40 bg-panel p-5 text-center sm:p-8'>
        <h2 className='text-base font-bold'>Cửa hàng chưa sẵn sàng</h2>
        <p className='mt-2 text-sm text-mute'>{shop.readyMessage}</p>
        <div className='mt-5 grid gap-2 sm:grid-cols-2'>
          <Button variant='ghost' onClick={() => setGuide(true)}><IconPlayerPlay size={16} /> Xem hướng dẫn</Button>
          <Button loading={shop.loading} requestAction onClick={onReload}><IconRefresh size={16} /> Kiểm tra lại</Button>
        </div>
      </div>
    </div>;
    if (!shop.tabs) return shop.error ? <ErrorState message={shop.error} onRetry={onReload} loading={shop.loading} /> : <ShopSkeleton />;
    return <>
      <ShopToolbar title={current?.name} count={products.length} ownedCount={ownedCount} query={query} onQuery={setQuery} filter={filter} onFilter={setFilter} pager={products.length ? productPager : null} loading={shop.loading} onReload={onReload} />
      <div className='mb-4 flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-panel px-3 py-2.5'>
        <p className='text-[11px] text-mute'>Trong danh mục: <strong className='text-fg'>{formatNumber(categoryAdded)} / {formatNumber(eligible.length)}</strong> vật phẩm thông thường đã thêm<span className='hidden sm:inline'> · Sản phẩm có tùy chọn cần chọn riêng</span></p>
        <Button size='sm' variant={allCategoryAdded ? 'ghost' : 'solid'} className={allCategoryAdded ? 'text-bad!' : ''} disabled={!cartReady || buying || !eligible.length} onClick={toggleCategoryCart}>
          {allCategoryAdded ? <IconTrash size={15} /> : <IconShoppingCart size={15} />}{allCategoryAdded ? 'Xóa tất cả' : 'Thêm tất cả vào giỏ'}
        </Button>
      </div>
      {!products.length ? <EmptyProducts searching={!!needle || filter !== 'all'} tabs={tabs} hits={hits} onSelect={selectTab} /> : <ul key={tabId} className='grid animate-fade gap-2 transition-opacity sm:grid-cols-2 xl:grid-cols-3'>
        {productRows.map((product, index) => <ProductItem key={`${product.key}-${index}`} p={product} poor={hasPrice(product) && product.price > user.coins} cartQuantity={quantites.get(quantityId(current.id, product.key)) || 0} maxQuantity={maxQuantity} onBuy={() => setEditing({ item: product, category: current, line: null })} now={now} />)}
      </ul>}
    </>;
  };

  return <div className={shop.ready === false ? 'md:px-6 md:py-6' : 'md:grid md:grid-cols-[220px_1fr] md:gap-6 md:px-6 md:py-6'}>
    {shop.ready !== false && <CategoryNav tabs={shop.tabs} tabId={tabId} hits={hits} onSelect={selectTab} />}
    <section className={`app-screen min-w-0 md:p-0 ${cart.length ? 'pb-28 md:pb-24' : ''}`}>
      {topup && shop.ready !== false ? <TopUp user={user} onPaid={onRefresh} /> : renderCatalogue()}
    </section>
    {cart.length > 0 && <div className='fixed inset-x-3 bottom-[calc(var(--app-bottom-nav-h)+.75rem+env(safe-area-inset-bottom))] z-30 mx-auto max-w-md md:right-5 md:bottom-5 md:left-auto md:mx-0'>
      <button type='button' onClick={() => setCartOpen(true)} className='flex w-full cursor-pointer items-center gap-3 rounded-2xl border border-lime/35 bg-panel px-3 py-3 text-left shadow-xl shadow-black/40 backdrop-blur-md transition hover:border-lime hover:bg-raise'>
        <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-lime text-bg'><IconShoppingCart size={20} /></span>
        <span className='min-w-0 flex-1'><span className='block text-xs font-extrabold'>Giỏ hàng · {formatNumber(cartCount(entries))} vật phẩm</span><span className='mt-0.5 flex items-center gap-1 text-xs font-bold text-coin'><Coin size={13} /> {formatNumber(total)}</span></span>
        <span className='shrink-0 rounded-lg bg-lime px-3 py-2 text-[11px] font-extrabold text-bg'>Xem giỏ & mua</span>
      </button>
    </div>}
    <BuyDialog key={`${editing?.category?.id || ''}:${editing?.item?.key || ''}:${editing?.line?.lineId || ''}`} item={editing?.item} category={editing?.category} tabs={shop.tabs} user={user} entries={entries} editLine={editing?.line} maxQuantity={maxQuantity} now={now} onAdd={addToCart} onRemove={removeFromCart} onClose={() => setEditing(null)} onTopUp={() => { setEditing(null); selectTab(TOPUP); }} />
    <CartDialog open={cartOpen} entries={entries} coins={user.coins} ready={cartReady} buying={buying} requestPending={requestPending} accountLimit={maxQuantity} onClose={() => setCartOpen(false)} onQuantity={updateAmount} onEdit={editEntry} onRemove={removeFromCart} onClear={clearCart} onBuy={purchase} onTopUp={() => { setCartOpen(false); selectTab(TOPUP); }} />
    <PurchaseDoneDialog open={done} onClose={() => setDone(false)} />
    <GuideVideoDialog open={guide} src={START_VIDEO} onClose={() => setGuide(false)} />
  </div>;
};