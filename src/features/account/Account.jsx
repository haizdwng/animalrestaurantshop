import { lazy, Suspense, useCallback, useEffect, useState } from 'react';
import { IconAt, IconFingerprint, IconId, IconLock } from '@tabler/icons-react';
import { LogoutDialog, OpenidDialog, PasswordDialog, PlayerNameDialog, UsernameDialog } from '@/features/account/ProfileDialogs';
import FieldRow from '@/features/account/FieldRow';
import ProfileCard from '@/features/account/ProfileCard';
import Transactions from '@/features/account/Transactions';
import LoginStreak from '@/features/account/LoginStreak';
import useProfileForm from '@/features/account/useProfileForm';
import GiftCodeDialog from '@/features/account/GiftCodeDialog';
import InviteCodeDialog from '@/features/account/InviteCodeDialog';
import LinkDialog from '@/features/account/LinkDialog';
import * as api from '@/shared/library/api';

const AvatarEditorDialog = lazy(() => import('@/features/avatar/Avatar'));

export default function Account({ user, onUser, onLogout, onRefresh, checkin }) {
  const form = useProfileForm(onUser);
  const { show } = form;
  const [linkDialog, setLinkDialog] = useState(null);
  const [avatarOpen, setAvatarOpen] = useState(false);
  const openLink = useCallback((kind, title, request) => setLinkDialog({ kind, title, request }), []);

  useEffect(() => {
    onRefresh();
  }, [onRefresh]);

  return (
    <div className='app-screen grid gap-4 md:grid-cols-[300px_1fr] md:gap-6'>
      <div className='space-y-4 md:sticky md:top-20 md:self-start'>
        <ProfileCard
          user={user}
          onEditAvatar={() => setAvatarOpen(true)}
          onLogout={() => show('logout')}
          onRedeemGiftCode={() => show('giftcode')}
          onRedeemInvite={() => show('invite')}
          onFriendLink={() => openLink('friend', 'Liên kết kết bạn', api.getFriendLink)}
          onBuffetLink={() => openLink('buffet', 'Liên kết làm thêm', api.getBuffetLink)}
        />
        <LoginStreak checkin={checkin} onClaim={checkin?.claim} onUser={onUser} />
      </div>

      <div className='min-w-0 space-y-4'>
        <div className='divide-y divide-line rounded-2xl border border-line bg-panel'>
          <FieldRow Icon={IconAt} label='Tên đăng nhập' onEdit={() => show('username', { value: user.username })}>
            {user.username}
          </FieldRow>
          <FieldRow Icon={IconId} label='Tên người chơi' onEdit={() => show('playerName', { value: user.playerName })}>
            {user.playerName}
          </FieldRow>
          <FieldRow Icon={IconLock} label='Mật khẩu' onEdit={() => show('password')}>
            <span className='tracking-widest'>••••••••</span>
          </FieldRow>
          <FieldRow Icon={IconFingerprint} label='Mã người chơi' onEdit={() => show('openid')}>
            {user.openid}
          </FieldRow>
        </div>
        <Transactions onPaid={onRefresh} />
      </div>

      {avatarOpen && (
        <Suspense fallback={null}>
          <AvatarEditorDialog onUser={onUser} onClose={() => setAvatarOpen(false)} />
        </Suspense>
      )}
      <UsernameDialog form={form} user={user} />
      <PlayerNameDialog form={form} />
      <PasswordDialog form={form} />
      <OpenidDialog form={form} user={user} />
      <LogoutDialog form={form} user={user} onLogout={onLogout} />
      <GiftCodeDialog open={form.open === 'giftcode'} onClose={form.close} onUser={onUser} />
      <InviteCodeDialog open={form.open === 'invite'} onClose={form.close} user={user} onUser={onUser} />
      <LinkDialog
        open={!!linkDialog}
        title={linkDialog?.title}
        request={linkDialog?.request}
        onClose={() => setLinkDialog(null)}
      />
    </div>
  );
};