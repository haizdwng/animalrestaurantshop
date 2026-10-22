import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from '@/shared/components/ui';
import * as api from '@/shared/library/api';

const EXPIRED = 'Phiên đăng nhập đã hết hạn, hãy đăng nhập lại';

export default function useSession() {
  const [status, setStatus] = useState('checking');
  const [user, setUser] = useState(null);
  const [syncing, setSyncing] = useState(false);
  const [bootError, setBootError] = useState('');
  const mounted = useRef(false);
  const bootRequest = useRef(0);

  const signIn = useCallback((u) => {
    setUser(u);
    setStatus('authed');
  }, []);

  const signOut = useCallback((msg, kind = 'info') => {
    setUser(null);
    setStatus('guest');
    if (msg) toast(msg, kind);
  }, []);

  const logout = useCallback(() => {
    api.logout();
    signOut('Đã đăng xuất');
  }, [signOut]);

  const boot = useCallback(() => {
    if (!api.hasToken()) return setStatus('guest');
    const id = ++bootRequest.current;
    setStatus('checking');
    setBootError('');
    api.getMe().then((r) => {
      if (mounted.current && id === bootRequest.current) signIn(r.user);
    }).catch((e) => {
      if (!mounted.current || id !== bootRequest.current) return;
      if (e.code === 'UNAUTHORIZED') {
        api.logout();
        setStatus('guest');
        toast(EXPIRED, 'err');
      } else setBootError(e.message);
    });
  }, [signIn]);

  const abandonBoot = useCallback(() => {
    api.logout();
    setBootError('');
    setStatus('guest');
  }, []);

  useEffect(() => {
    mounted.current = true;
    api.setUnauthorizedHandler(() => signOut(EXPIRED, 'err'));
    boot();
    return () => {
      mounted.current = false;
      bootRequest.current += 1;
      api.setUnauthorizedHandler(() => {});
    };
  }, [signOut, boot]);

  const refreshUser = useCallback(async () => {
    setSyncing(true);
    try {
      const { user: u } = await api.getMe();
      if (mounted.current && u) setUser((prev) => (prev?.avatar && u.avatar && prev.avatar.split('?')[0] === u.avatar ? { ...u, avatar: prev.avatar } : u));
    } catch (e) {
      if (!mounted.current) return;
      if (e.code === 'UNAUTHORIZED') {
        api.logout();
        signOut(EXPIRED, 'err');
      } else toast(e.message, 'err');
    } finally {
      if (mounted.current) setSyncing(false);
    };
  }, [signOut]);

  return { status, user, setUser, syncing, bootError, boot, abandonBoot, signIn, logout, refreshUser };
};