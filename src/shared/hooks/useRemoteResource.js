import { useCallback, useEffect, useRef, useState } from 'react';

export default function useRemoteResource(fetcher) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(false);
  const request = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    const id = ++request.current;
    setLoading(true);
    setError('');
    try {
      const next = await fetcherRef.current();
      if (mounted.current && id === request.current) setData(next);
      return next;
    } catch (e) {
      if (mounted.current && id === request.current) setError(e?.message || 'Không tải được dữ liệu');
      return null;
    } finally {
      if (mounted.current && id === request.current) setLoading(false);
    };
  }, []);

  useEffect(() => {
    mounted.current = true;
    reload();
    return () => {
      mounted.current = false;
      request.current += 1;
    };
  }, [reload]);

  return { data, setData, loading, error, reload };
};