import { IconCalendarCheck, IconGift } from '@tabler/icons-react';
import { Badge, Button, Coin, Skeleton, toast } from '@/shared/components/ui';
import { formatNumber } from '@/shared/library/format';
import { CHECKIN_DAYS } from '@/shared/library/api/checkin';
import { getLoginStreakProgress } from '@/features/account/loginStreakProgress';

function LoginStreakSkeleton() {
  return (
    <section aria-label='Đang tải tiến trình đăng nhập' aria-busy='true' className='ui-card space-y-4 p-4'>
      <header className='flex items-center gap-3'>
        <Skeleton className='size-10 shrink-0 rounded-xl' />
        <div className='min-w-0 flex-1 space-y-1.5'>
          <Skeleton className='h-3.5 w-28' />
          <Skeleton className='h-2.5 w-40 max-w-full' />
        </div>
      </header>
      <div className='grid grid-cols-7 gap-1.5'>
        {Array.from({ length: 7 }, (_, index) => (
          <div key={index} className='flex min-w-0 flex-col items-center gap-1.5 rounded-lg border border-line bg-bg px-0.5 py-2'>
            <Skeleton className='h-2.5 w-2' />
            <Skeleton className='size-7 rounded-full' />
            <Skeleton className='h-2.5 w-7 max-w-full' />
          </div>
        ))}
      </div>
      <Skeleton className='h-8 w-full rounded-lg' />
    </section>
  );
};

export default function LoginStreak({ checkin, onClaim, onUser }) {
  const { streak = 0, claimedToday = false, canClaim = false, nextReward = 5, rewards = [5, 5, 5, 5, 5, 5, 30], loading = false, claiming = false, error = '', loaded = false } = checkin || {};
  const { completed, newCycle, days } = getLoginStreakProgress({ streak, claimedToday, canClaim, rewards });
  const claimReward = newCycle ? rewards[0] ?? 5 : nextReward;

  const handleClaim = async () => {
    try {
      const result = await onClaim();
      if (!result) return;
      if (result.user && onUser) onUser(result.user);
      const gained = result.reward ?? result.checkin?.reward ?? claimReward;
      toast(`Đã nhận +${formatNumber(gained)} xu đăng nhập ngày ${result.checkin?.streak ?? (newCycle ? 1 : completed + 1)}!`);
    } catch (requestError) {
      toast(requestError?.message || 'Không nhận được phần thưởng', 'err');
    };
  };

  if (!loaded && !error) return <LoginStreakSkeleton />;

  return (
    <section className='ui-card space-y-4 p-4'>
      <header className='flex items-center gap-3'>
        <span className='grid size-10 shrink-0 place-items-center rounded-xl bg-coin/10 text-coin'><IconCalendarCheck size={21} /></span>
        <div className='min-w-0 flex-1'>
          <h2 className='text-sm font-extrabold'>Đăng nhập 7 ngày</h2>
          <p className='mt-0.5 text-[11px] text-mute'>
            {loaded ? claimedToday ? `Chuỗi ${completed}/${CHECKIN_DAYS} ngày · Đã nhận hôm nay` : newCycle ? 'Đã hoàn thành · Bắt đầu chu kỳ mới' : `Chuỗi ${completed}/${CHECKIN_DAYS} ngày` : 'Đang tải tiến trình…'}
          </p>
        </div>
        {canClaim && <Badge tone='accent'>Có quà</Badge>}
      </header>
      <div className='grid grid-cols-7 gap-1.5'>
        {days.map(({ day, reward, done, isToday }) => (
          <div key={day} aria-label={`Ngày ${day}: ${done ? 'đã nhận' : isToday ? 'có thể nhận' : 'chưa nhận'}`}
            className={`flex min-w-0 flex-col items-center gap-1.5 rounded-lg border px-0.5 py-2 text-center ${done ? 'border-ok/25 bg-ok/10' : isToday ? 'border-coin/30 bg-coin/10' : 'border-line bg-bg'}`}>
            <span className={`text-[10px] font-semibold ${done ? 'text-ok' : isToday ? 'text-coin' : 'text-mute'}`}>{day}</span>
            <span className={`grid size-7 place-items-center rounded-full text-[11px] font-bold ${done ? 'bg-ok/20 text-ok' : isToday ? 'bg-coin/20 text-coin' : 'bg-raise text-mute'}`}>
              {done ? '✓' : day === 7 ? <IconGift size={13} /> : reward}
            </span>
            <span className={`flex items-center gap-0.5 text-[10px] font-bold tabular-nums ${done ? 'text-ok' : isToday ? 'text-coin' : 'text-mute'}`}>
              {!done && <Coin size={10} />}{done ? 'Xong' : reward}
            </span>
          </div>
        ))}
      </div>
      {error && !loading && <p role='alert' className='text-xs text-bad'>{error}</p>}
      <Button requestAction className='w-full' variant={canClaim ? 'solid' : 'ghost'} size='sm' loading={claiming || loading} disabled={!canClaim || claiming || loading} onClick={handleClaim}>
        {claiming ? 'Đang nhận…' : canClaim ? `Nhận +${formatNumber(claimReward)} xu hôm nay` : claimedToday ? 'Đã nhận quà hôm nay' : loading ? 'Đang tải…' : 'Chưa thể nhận'}
      </Button>
    </section>
  );
};