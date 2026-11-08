import { useCallback, useEffect, useRef, useState } from 'react';
import * as api from '@/shared/library/api';
import { CHECKIN_REWARDS } from '@/shared/library/api/checkin';

const INITIAL = {
  streak: 0,
  claimedToday: false,
  canClaim: false,
  lastClaimDate: null,
  nextReward: CHECKIN_REWARDS[0],
  rewards: CHECKIN_REWARDS,
  loading: false,
  claiming: false,
  error: '',
  loaded: false
};

export default function useCheckin(enabled = true) {
  const [state, setState] = useState(INITIAL);
  const request = useRef(0);
  const mounted = useRef(false);

  const applyPayload = useCallback((payload) => {
    if (!payload || typeof payload !== 'object') return;
    const streak = Math.max(0, Number(payload.streak) || 0);
    const claimedToday = Boolean(payload.claimedToday);
    const canClaim = payload.canClaim !== undefined ? Boolean(payload.canClaim) : !claimedToday;
    const rewards = Array.isArray(payload.rewards) && payload.rewards.length === 7 ? payload.rewards : CHECKIN_REWARDS;
    const nextDay = claimedToday ? (streak >= 7 ? 1 : streak + 1) : Math.min(Math.max(streak, 0) + 1, 7);
    const nextReward = Number(payload.nextReward) || rewards[nextDay - 1] || rewards[0];
    setState((current) => ({
      ...current,
      streak,
      claimedToday,
      canClaim,
      lastClaimDate: payload.lastClaimDate ?? null,
      nextReward,
      rewards,
      error: '',
      loaded: true
    }));
  }, []);

  const load = useCallback(async () => {
    const id = ++request.current;
    setState((current) => ({ ...current, loading: true, error: '' }));
    try {
      const data = await api.getCheckin();
      if (!mounted.current || id !== request.current) return null;
      applyPayload(data);
      return data;
    } catch (error) {
      if (!mounted.current || id !== request.current) return null;
      setState((current) => ({
        ...current,
        loading: false,
        error: error?.message || 'Không tải được tiến trình đăng nhập',
        loaded: true
      }));
      return null;
    } finally {
      if (mounted.current && id === request.current) setState((current) => ({ ...current, loading: false }));
    };
  }, [applyPayload]);

  const claim = useCallback(async () => {
    if (state.claiming || !state.canClaim) return null;
    setState((current) => ({ ...current, claiming: true, error: '' }));
    try {
      const data = await api.claimCheckin();
      if (!mounted.current) return null;
      applyPayload(data.checkin ?? data);
      setState((current) => ({ ...current, claiming: false }));
      return data;
    } catch (error) {
      if (!mounted.current) return null;
      setState((current) => ({
        ...current,
        claiming: false,
        error: error?.message || 'Không nhận được thưởng đăng nhập'
      }));
      throw error;
    };
  }, [applyPayload, state.canClaim, state.claiming]);

  useEffect(() => {
    mounted.current = true;
    if (!enabled) {
      request.current += 1;
      setState(INITIAL);
      return () => mounted.current = false;
    };
    load();
    return () => {
      mounted.current = false;
      request.current += 1;
    };
  }, [enabled, load]);

  return {
    ...state,
    load,
    claim,
    showBadge: state.loaded && state.canClaim
  };
};