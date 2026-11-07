import { useCallback, useEffect, useRef, useState } from 'react';
import { CHAT_POLL_INTERVAL } from '@/features/chat/config';

// Fetches immediately, then every few seconds while the tab is visible.
export default function usePolling(fetcher, deps = [], interval = CHAT_POLL_INTERVAL) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;
  const alive = useRef(true);
  const inflight = useRef(false);
  const generation = useRef(0);

  const refresh = useCallback(async () => {
    if (inflight.current) return;
    inflight.current = true;
    const current = generation.current;
    try {
      const next = await fetcherRef.current();
      if (alive.current && current === generation.current) {
        setData(next);
        setError('');
      };
    } catch (e) {
      if (alive.current && current === generation.current) setError(e?.message || 'Không tải được dữ liệu');
    } finally {
      inflight.current = false;
      if (alive.current && current === generation.current) setLoading(false);
    };
  }, []);

  useEffect(() => {
    alive.current = true;
    generation.current += 1;
    inflight.current = false;
    setData(null);
    setLoading(true);
    refresh();

    let timer;
    const start = () => {
      clearInterval(timer);
      timer = setInterval(() => !document.hidden && refresh(), interval);
    };
    const onVisible = () => !document.hidden && refresh();
    start();
    document.addEventListener('visibilitychange', onVisible);
    return () => {
      alive.current = false;
      clearInterval(timer);
      document.removeEventListener('visibilitychange', onVisible);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [refresh, interval, ...deps]);

  return { data, setData, error, loading, refresh };
};
