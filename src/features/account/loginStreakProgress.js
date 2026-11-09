const DAYS = 7;

export function getLoginStreakProgress({ streak = 0, claimedToday = false, canClaim = false, rewards = [] } = {}) {
  const count = Math.min(DAYS, Math.max(0, Math.trunc(Number(streak) || 0)));
  const newCycle = canClaim && !claimedToday && count === DAYS;
  const completed = newCycle ? 0 : count;
  const todayDay = canClaim ? Math.min(completed + 1, DAYS) : claimedToday ? completed : null;
  return {
    completed,
    newCycle,
    todayDay,
    days: Array.from({ length: DAYS }, (_, index) => {
      const day = index + 1;
      return {
        day,
        reward: rewards[index] ?? (day === DAYS ? 30 : 5),
        done: day <= completed,
        isToday: todayDay === day
      };
    })
  };
};