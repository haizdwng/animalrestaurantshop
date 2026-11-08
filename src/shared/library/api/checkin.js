import { call } from '@/shared/library/api/client';
import { withUser } from '@/shared/library/api/auth';

export const CHECKIN_REWARDS = [5, 5, 5, 5, 5, 5, 30];
export const CHECKIN_DAYS = 7;
export const rewardForDay = (day) => {
  const d = Math.min(Math.max(Number(day) || 1, 1), CHECKIN_DAYS);
  return CHECKIN_REWARDS[d - 1];
};
export const getCheckin = () => call('GET', '/user/checkin', undefined, { track: false });
export const claimCheckin = async () => withUser(await call('POST', '/user/checkin', undefined, { coin: true }));