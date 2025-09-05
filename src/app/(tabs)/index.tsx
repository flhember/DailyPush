import { YStack, XStack, Separator, H3 } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaxPushupRecordCard } from '@/src/components/MaxPushupRecordCard';
import { router } from 'expo-router';
import { useProfilesRead } from '@/src/api/profiles';
import { useEffect, useState } from 'react';
import { MaxPushupHistorySheet } from '@/src/components/MaxPushupHistorySheet';
import { ProgramDayCard } from '@/src/components/ProgramDayCard';
import { ProgramCardPushups } from '@/src/components/ProgramCardPushups';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfilesRead();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [day, setDay] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  useEffect(() => {
    console.log(historyOpen);
  }, [historyOpen]);

  const startMaxPushUps = () => {
    console.log('Start Max Push Ups!');
    router.push('/training/MaxTrainingScreen');
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12">Daily Push.</H3>
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
        title="Programme Pompes"
        maxPushups={28}
        currentDayIndex={0}
        onStart={(day) => console.log('start day plan:', day)}
        onPlanning={() => console.log('open planning')}
      />
      <MaxPushupHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} limit={10} />
    </YStack>
  );
}
//      <ProgramDayCard day={day} level={2} onChangeDay={setDay} />
