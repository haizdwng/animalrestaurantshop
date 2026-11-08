import { IconCalendarCheck, IconGift } from '@tabler/icons-react';
import { Button, Coin, toast } from '@/shared/components/ui';
import { formatNumber } from '@/shared/library/format';
import { CHECKIN_DAYS } from '@/shared/library/api/checkin';

export default function LoginStreak({ checkin, onClaim, onUser }) {
  const {
    streak = 0,
    claimedToday = false,
    canClaim = false,
    nextReward = 5,
    rewards = [5, 5, 5, 5, 5, 5, 30],
    loading = false,
    claiming = false,
    error = '',
    loaded = false
  } = checkin || {};

  const handleClaim = async () => {
    try {
      const result = await onClaim();
      if (!result) return;
      const gained = result.reward ?? result.checkin?.reward ?? nextReward;
      if (result.user && onUser) onUser(result.user);
      toast(`Đã nhận +${formatNumber(gained)} xu đăng nhập ngày ${result.checkin?.streak ?? streak + 1}!`, 'ok');
    } catch (e) {
      toast(e?.message || 'Không nhận được thưởng', 'err');
    };
  };

  const days = Array.from({ length: CHECKIN_DAYS }, (_, i) => {
    const day = i + 1;
    const reward = rewards[i] ?? (day === 7 ? 30 : 5);
    const done = claimedToday ? day <= streak : day < streak;
    const isToday = canClaim ? day === Math.min(streak + 1, CHECKIN_DAYS) : claimedToday && day === streak;
    return { day, reward, done, isToday };
  });

  return (
    <div className='relative overflow-hidden rounded-2xl border border-line bg-panel p-4'>
      <div aria-hidden className='absolute inset-x-0 top-0 h-16 bg-[radial-gradient(70%_100%_at_100%_0%,color-mix(in_oklab,var(--color-coin)_16%,transparent),transparent)]' />
      <div className='relative flex items-start justify-between gap-3'>
        <div className='min-w-0'>
          <div className='flex items-center gap-2'>
            <span className='grid size-8 place-items-center rounded-xl bg-coin/15 text-coin'>
              <IconCalendarCheck size={16} />
            </span>
            <div>
              <h2 className='text-sm font-extrabold tracking-tight'>Đăng nhập 7 ngày</h2>
              <p className='text-[11px] text-mute'>
                {loaded ? claimedToday ? `Chuỗi ${streak}/${CHECKIN_DAYS} ngày · Đã nhận hôm nay` : `Chuỗi ${streak}/${CHECKIN_DAYS} ngày · Nhận quà hôm nay` : 'Đang tải tiến trình…'}
              </p>
            </div>
          </div>
        </div>
        {canClaim && (
          <span className='shrink-0 rounded-full bg-lime px-2 py-0.5 text-[10px] font-extrabold text-bg'>Mới</span>
        )}
      </div>

      <div className='relative mt-4 grid grid-cols-7 gap-1.5'>
        {days.map(({ day, reward, done, isToday }) => (
          <div
            key={day}
            className={`relative flex flex-col items-center gap-1 rounded-xl px-0.5 py-2 text-center transition ${
              done ? 'bg-ok/15 ring-1 ring-ok/30' : isToday ? 'bg-coin/15 ring-1 ring-coin/40' : 'bg-bg ring-1 ring-line'
            }`}
          >
            <span className={`text-[10px] font-bold ${done ? 'text-ok' : isToday ? 'text-coin' : 'text-mute'}`}>
              Ngày {day}
            </span>
            <span
              className={`grid size-7 place-items-center rounded-full text-[10px] font-extrabold tabular-nums ${
                done ? 'bg-ok/25 text-ok' : isToday ? 'bg-coin/25 text-coin' : 'bg-raise text-mute'
              }`}
            >
              {done ? '✓' : day === 7 ? <IconGift size={12} /> : reward}
            </span>
            <span className={`flex items-center gap-0.5 text-[9px] font-bold tabular-nums ${done ? 'text-ok' : isToday ? 'text-coin' : 'text-mute'}`}>
              {day === 7 && !done ? (
                <>
                  <Coin size={10} />
                  {reward}
                </>
              ) : done ? (
                'xong'
              ) : (
                <>
                  <Coin size={10} />
                  {reward}
                </>
              )}
            </span>
          </div>
        ))}
      </div>

      <div className='relative mt-4'>
        {error && !loading && <p className='mb-2 text-[11px] text-bad'>{error}</p>}
        <Button
          variant={canClaim ? 'solid' : 'ghost'}
          size='sm'
          className='w-full'
          loading={claiming || loading}
          disabled={!canClaim || claiming || loading}
          onClick={handleClaim}
        >
          {claiming ? 'Đang nhận…' : canClaim ? (
            <>
              Nhận +{formatNumber(nextReward)} xu hôm nay
            </>
          ) : claimedToday ? 'Đã nhận quà hôm nay' : loading ? 'Đang tải…' : 'Chưa thể nhận'}
        </Button>
      </div>
    </div>
  );
};