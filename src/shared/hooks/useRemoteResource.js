import { useCallback, useEffect, useRef, useState } from 'react';

export default function useRemoteResource(fetcher, enabled = true) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const mounted = useRef(false);
  const request = useRef(0);
  const fetcherRef = useRef(fetcher);
  fetcherRef.current = fetcher;

  const reload = useCallback(async () => {
    const requestId = ++request.current;
    setLoading(true);
    setError('');
    try {
      const next = await fetcherRef.current();
      if (mounted.current && requestId === request.current) setData(next);
      return next;
    } catch (fetchError) {
      if (mounted.current && requestId === request.current) setError(fetchError?.message || 'Không tải được dữ liệu');
      return null;
    } finally {
      if (mounted.current && requestId === request.current) setLoading(false);
    };
  }, []);

  useEffect(() => {
    mounted.current = true;
    if (enabled) reload();
    else {
      request.current += 1;
      setData(null);
      setLoading(false);
      setError('');
    };

    return () => {
      mounted.current = false;
      request.current += 1;
    };
  }, [reload, enabled]);

  return { data, setData, loading, error, reload };
};