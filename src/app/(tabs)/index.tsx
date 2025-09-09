import { YStack, XStack, Separator, H3, Button } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { MaxPushupRecordCard } from '@/src/components/MaxPushupRecordCard';
import { router } from 'expo-router';
import { useProfilesRead } from '@/src/api/profiles';
import { useEffect, useState } from 'react';
import { MaxPushupHistorySheet } from '@/src/components/MaxPushupHistorySheet';
import { ProgramCardPushups } from '@/src/components/ProgramCardPushups';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { useInsertSessionRecord, useSessionsRecordsList } from '@/src/api/sessionsRecords';

export default function Home() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();
  const { data: profile } = useProfilesRead();

  const { data: sessionsRecords } = useSessionsRecordsList();
  const { mutate: insertSessionRecord } = useInsertSessionRecord();

  const [historyOpen, setHistoryOpen] = useState(false);

  useEffect(() => {
    console.log(historyOpen);
  }, [historyOpen]);

  const startMaxPushUps = () => {
    console.log('Start Max Push Ups!');
    router.push('/training/MaxTrainingScreen');
  };

  const readFt = () => {
    console.log('Sessions Records: ', sessionsRecords);
  };

  const addFt = () => {
    console.log('Add');

    insertSessionRecord({});
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} pb={tabBarHeight} gap="$3" animation="quicker">
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
        onPlanning={() => router.navigate('/(tabs)/Training')}
      />
      <MaxPushupHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} limit={10} />
      <Button size="$3" variant="outlined" onPress={readFt}>
        Read
      </Button>
      <Button size="$3" theme="accent" onPress={addFt}>
        Add
      </Button>
    </YStack>
  );
}
//      <ProgramDayCard day={day} level={2} onChangeDay={setDay} />
