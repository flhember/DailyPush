import { YStack, XStack, Separator, H3, Button } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { MaxPushupRecordCard } from '@/src/components/MaxPushupRecordCard';
import { router } from 'expo-router';
import { useProfilesRead } from '@/src/api/profiles';
import { useEffect, useState } from 'react';
import { MaxPushupHistorySheet } from '@/src/components/MaxPushupHistorySheet';
import { ProgramDayCard } from '@/src/components/ProgramDayCard';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfilesRead();
  const [historyOpen, setHistoryOpen] = useState(false);
  const [day, setDay] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  useEffect(() => {
    console.log(historyOpen);
  }, [historyOpen]);

  async function logOut() {
    await supabase.auth.signOut();
  }

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
      <Separator />
      <MaxPushupRecordCard
        value={profile?.maxPushups}
        date={profile?.maxPushupsDate}
        onPressTest={startMaxPushUps}
        onPressHistory={() => setHistoryOpen(true)}
      />
      <ProgramDayCard day={day} level={2} onChangeDay={setDay} />
      <Button
        pos="absolute"
        left="$4"
        right="$4"
        bottom={insets.bottom + 60}
        size="$5"
        theme="error"
        onPress={logOut}
      >
        Log out
      </Button>
      <MaxPushupHistorySheet open={historyOpen} onOpenChange={setHistoryOpen} limit={10} />
    </YStack>
  );
}
