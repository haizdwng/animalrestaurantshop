import { useCallback, useEffect, useState } from 'react';

const fromHash = (keys, fallback) => {
  const h = window.location.hash.slice(1);
  return keys.includes(h) ? h : fallback;
};

export default function useHashTab(keys, fallback) {
  const [tab, setTabRaw] = useState(() => fromHash(keys, fallback));
  const setTab = useCallback((next) => {
    if (!keys.includes(next)) return;
    setTabRaw(next);
    window.history.replaceState(null, '', `#${next}`);
    window.scrollTo({ top: 0 });
  }, [keys]);

  useEffect(() => {
    const onHashChange = () => setTabRaw(fromHash(keys, fallback));
    window.addEventListener('hashchange', onHashChange);
    return () => window.removeEventListener('hashchange', onHashChange);
  }, [keys, fallback]);

  return [tab, setTab];
};