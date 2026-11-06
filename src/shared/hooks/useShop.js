import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '@/shared/library/api';

const INITIAL = { tabs: null, loading: false, error: '', ready: null, readyMessage: '' };

export default function useShop(enabled, skipReady = false) {
  const [shop, setShop] = useState(INITIAL);
  const request = useRef(0);
  const skipReadyRef = useRef(skipReady);
  skipReadyRef.current = skipReady;

  const load = useCallback(async () => {
    const requestId = ++request.current;
    setShop({ ...INITIAL, loading: true });

    if (!skipReadyRef.current) {
      try {
        const ready = await api.checkShopReady();
        if (requestId !== request.current) return;
        if (ready?.success !== true) {
          setShop({ ...INITIAL, ready: false, readyMessage: ready?.message || 'Cửa hàng hiện chưa sẵn sàng' });
          return;
        };
      } catch (error) {
        if (requestId === request.current) setShop({ ...INITIAL, ready: false, readyMessage: error?.message || 'Không thể kiểm tra trạng thái cửa hàng' });
        return;
      };
    };

    try {
      const response = await api.getShop();
      if (requestId === request.current) setShop({ tabs: Array.isArray(response.tabs) ? response.tabs : [], loading: false, error: '', ready: true, readyMessage: '' });
    } catch (error) {
      if (requestId === request.current) setShop((current) => ({ ...current, loading: false, error: error?.message || 'Không tải được cửa hàng', ready: true }));
    };
  }, []);

  useEffect(() => {
    if (!enabled) {
      request.current += 1;
      setShop(INITIAL);
      return;
    };

    load();
    return () => {
      request.current += 1;
    };
  }, [enabled, load]);

  return { shop, load };
};