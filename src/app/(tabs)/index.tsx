import { YStack, XStack, Separator, H3 } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaxPushupRecordCard } from '@/src/components/MaxPushupRecordCard';
import { router } from 'expo-router';
import { useProfilesRead } from '@/src/api/profiles';
import { useEffect, useState } from 'react';
import { MaxPushupHistorySheet } from '@/src/components/MaxPushupHistorySheet';
import { ProgramCardPushups } from '@/src/components/ProgramCardPushups';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useTranslation } from 'react-i18next';

export default function Home() {
  const { t } = useTranslation();

  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { data: profile } = useProfilesRead();

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    console.log(historyOpen);
  }, [historyOpen]);

  const startMaxPushUps = () => {
    console.log('Start Max Push Ups!');
    router.push('/training/MaxTrainingScreen');
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} pb={tabBarHeight} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12">{t('common.appName')}</H3>
        <ThemeSwitch />
      </XStack>
      <Separator borderColor="$borderColor" />
      <MaxPushupRecordCard
        value={profile?.maxPushups}
        date={profile?.maxPushupsDate}
        onPressTest={startMaxPushUps}
        onPressHistory={() => setHistoryOpen(true)}
      />
      <ProgramCardPushups
        currentLevelIndex={profile?.indexLevel ?? undefined}
        currentDayIndex={profile?.indexDay ?? 0}
        onPlanning={() => router.navigate('/(tabs)/program')}
        isPremium={profile?.isPremium}
      />
      <MaxPushupHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} limit={10} />
    </YStack>
  );
}
