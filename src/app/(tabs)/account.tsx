import { useMemo, useState } from 'react';
import {
  YStack,
  XStack,
  H3,
  Paragraph,
  Separator,
  Card,
  SizableText,
  Button,
  Sheet,
  Input,
  Label,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { LogOut, Edit3, Trophy } from '@tamagui/lucide-icons';
import { useInsertAvatar, useProfilesRead, useUpdateProfileName } from '@/src/api/profiles';
import { useSessionsRecordsList } from '@/src/api/sessionsRecords';
import { supabase } from '@/src/lib/supabase';
import { formatInDeviceTZ } from '@/src/utils/datetime';
import { useMaxPushUpRecordsList } from '@/src/api/maxPushUpRecords';
import { useAuth } from '@/src/providers/AuthProvider';
import { useTranslation } from 'react-i18next';
import i18n from '@/src/i18n';
import { Alert, Platform } from 'react-native';
import { deleteOrphanAvatars } from '@/src/utils/deleteOrphanAvatars';
import { AccountAvatar } from '@/src/components/AccountAvatar';
import { pickAndUploadAvatar } from '@/src/utils/pickAndUploadAvatar';
import { LanguageSwitch } from '@/src/components/LanguageMenu';

function getInitials(name?: string | null, email?: string | null) {
  const base = name?.trim() || email?.split('@')[0] || 'U';
  return base
    .split(/\s+/)
    .map((w) => w[0])
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

export default function AccountScreen() {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfilesRead();
  const { data: sessions = [] } = useSessionsRecordsList();
  const { data: maxData = [] } = useMaxPushUpRecordsList();
  const { mutate: updateProfileName } = useUpdateProfileName();
  const { session } = useAuth();
  const locale = i18n.language || 'en-US';
  const [uploading, setUploading] = useState(false);
  const userId = session?.user.id;
  const { mutate: insertAvatar } = useInsertAvatar();

  const onPickUp = async () => {
    try {
      setUploading(true);
      if (!userId || typeof userId !== 'string') throw new Error(t('errorMsg.UnauthenticatedUser'));

      const publicUrl = await pickAndUploadAvatar(userId);
      if (!publicUrl) {
        return;
      }

      insertAvatar(
        { avatar: publicUrl },
        {
          onSuccess: async () => {
            await deleteOrphanAvatars({ userId, currentUrl: publicUrl });
          },
          onError: (err: any) => {
            Alert.alert('Upload', err?.message);
          },
          onSettled: () => {
            setUploading(false);
          },
        },
      );
    } catch (e: any) {
      Alert.alert('Upload', e?.message);
    } finally {
      setUploading(false);
    }
  };

  // KPIs
  const sessionCount = sessions.length + maxData.length;
  const totalRepsSession = useMemo(
    () => sessions.reduce((s, r: any) => s + (r.total_reps ?? 0), 0),
    [sessions],
  );
  const totalRepsMax = useMemo(
    () => maxData.reduce((s, r: any) => s + (r.numberPushUps ?? 0), 0),
    [maxData],
  );
  const totalReps = totalRepsSession + totalRepsMax;

  const best = profile?.maxPushups ?? 0;

  // Sheet édition
  const [open, setOpen] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name ?? '');
  const [username, setUsername] = useState(profile?.username ?? '');

  const initials = getInitials(profile?.full_name, profile?.username ?? session?.user.email);

  const saveProfile = async () => {
    updateProfileName({ fullName, username });
    setOpen(false);
  };

  const logout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      {/* Header */}
      <XStack ai="center" jc="space-between">
        <H3 color="$color12">{t('account.title')}</H3>
        <Button
          size="$2"
          variant="outlined"
          icon={Edit3}
          onPress={() => {
            setFullName(profile?.full_name ?? '');
            setUsername(profile?.username ?? '');
            setOpen(true);
          }}
        >
          {t('account.edit')}
        </Button>
      </XStack>
      <Separator />
      {/* Hero profil */}
      <Card bordered p="$2" br="$6">
        {/* Switch langue en haut à droite */}
        <YStack position="absolute" top="$3" right="$3" zi={1}>
          <LanguageSwitch size="$2" />
        </YStack>
        <XStack ai="center" gap="$3">
          <YStack>
            <AccountAvatar
              url={profile?.avatar_url ?? undefined}
              initials={initials}
              uploading={uploading}
              onPick={onPickUp}
            />
          </YStack>
          <YStack f={1}>
            <SizableText size="$7" fow="700">
              {profile?.full_name || t('account.userFallback')}
            </SizableText>
            <Paragraph opacity={0.7}>{profile?.username || '—'}</Paragraph>
          </YStack>
        </XStack>
      </Card>
      {/* KPIs */}
      <XStack gap="$3" fw="wrap">
        <Card f={1} p="$3" bordered>
          <XStack ai="center" gap="$2">
            <Trophy size={16} />
            <Paragraph>{t('account.kpis.record')}</Paragraph>
          </XStack>
          <SizableText size="$8" fow="800">
            {best}
          </SizableText>
          {!!profile?.maxPushupsDate && (
            <Paragraph size="$2" opacity={0.6}>
              {t('account.kpis.recordOn', {
                date: formatInDeviceTZ(profile.maxPushupsDate, { withTime: false, locale }),
              })}
            </Paragraph>
          )}
        </Card>
        <Card f={1} p="$3" bordered>
          <Paragraph>{t('account.kpis.sessions')}</Paragraph>
          <SizableText size="$8" fow="800">
            {sessionCount}
          </SizableText>
        </Card>
        <Card f={1} p="$3" bordered>
          <Paragraph>{t('account.kpis.totalReps')}</Paragraph>
          <SizableText size="$8" fow="800">
            {totalReps}
          </SizableText>
        </Card>
      </XStack>
      {/* Déconnexion */}
      <Button
        pos="absolute"
        left="$4"
        right="$4"
        bottom={Platform.OS === 'ios' ? insets.bottom + 60 : 10}
        size="$5"
        theme="error"
        icon={LogOut}
        onPress={logout}
      >
        {t('account.logout')}
      </Button>
      {/* Sheet édition profil */}
      <Sheet
        modal
        open={open}
        onOpenChange={setOpen}
        snapPoints={[50]}
        dismissOnSnapToBottom
        forceRemoveScrollEnabled={open}
        zIndex={100_000}
        animation="medium"
      >
        <Sheet.Overlay
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
          backgroundColor="$shadow6"
          animation="lazy"
        />
        <Sheet.Frame animation="quick" p="$4" pb={insets.bottom + 20} gap="$3">
          <H3>{t('account.editSheet.title')}</H3>
          <YStack gap="$2">
            <Label htmlFor="full_name">{t('account.editSheet.fullName')}</Label>
            <Input id="full_name" value={fullName} onChangeText={setFullName} />

            <Label htmlFor="username">{t('account.editSheet.username')}</Label>
            <Input id="username" value={username} onChangeText={setUsername} />
          </YStack>
          <XStack jc="flex-end" gap="$2" mt="$2">
            <Button onPress={() => setOpen(false)}>{t('account.editSheet.cancel')}</Button>
            <Button theme="accent" onPress={saveProfile}>
              {t('account.editSheet.save')}
            </Button>
          </XStack>
        </Sheet.Frame>
        <Sheet.Handle display="none" />
      </Sheet>
    </YStack>
  );
}
