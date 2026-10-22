import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '@/shared/library/api';

const INITIAL = { tabs: null, loading: false, error: '', ready: null, readyMessage: '' };
const CACHE_TTL = 5 * 60 * 1000;

export default function useShop(enabled, skipReady = false) {
  const [shop, setShop] = useState(INITIAL);
  const request = useRef(0);
  const loadedAt = useRef(0);
  const skipReadyRef = useRef(skipReady);
  skipReadyRef.current = skipReady;

  const load = useCallback(async () => {
    const id = ++request.current;
    loadedAt.current = 0;
    setShop({ ...INITIAL, loading: true });
    if (!skipReadyRef.current) {
      try {
        const ready = await api.checkShopReady();
        if (id !== request.current) return;
        if (ready?.success !== true) {
          setShop({ ...INITIAL, loading: false, ready: false, readyMessage: ready?.message || 'Cửa hàng hiện chưa sẵn sàng' });
          return;
        };
      } catch (e) {
        if (id === request.current) setShop({ ...INITIAL, loading: false, ready: false, readyMessage: e?.message || 'Không thể kiểm tra trạng thái cửa hàng' });
        return;
      };
    };
    try {
      const r = await api.getShop();
      if (id === request.current) {
        loadedAt.current = Date.now();
        setShop({ tabs: Array.isArray(r.tabs) ? r.tabs : [], loading: false, error: '', ready: true, readyMessage: '' });
      };
    } catch (e) {
      if (id === request.current) setShop((s) => ({ ...s, loading: false, error: e?.message || 'Không tải được cửa hàng', ready: true }));
    };
  }, []);
  useEffect(() => {
    if (!enabled) {
      request.current += 1;
      setShop((s) => s.loading ? INITIAL : s);
    };
  }, [enabled]);
  useEffect(() => {
    if (!enabled || shop.loading || shop.ready === false) return;
    if (shop.tabs && Date.now() - loadedAt.current < CACHE_TTL) return;
    if (!shop.tabs && shop.error) return;
    load();
  }, [enabled, shop.tabs, shop.loading, shop.error, shop.ready, load]);

  return { shop, load };
};