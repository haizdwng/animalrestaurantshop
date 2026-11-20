import { useSyncExternalStore } from 'react';
import { getPendingRequestCount, subscribeToRequests } from '@/shared/library/api/client';

export default function useRequestPending() {
  return useSyncExternalStore(subscribeToRequests, getPendingRequestCount, getPendingRequestCount) > 0;
};