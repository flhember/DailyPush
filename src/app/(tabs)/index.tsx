import { YStack, XStack, Separator, H3, Button } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useEffect } from 'react';
import { MaxPushupRecordCard } from '@/src/components/MaxPushupRecordCard';
import { router } from 'expo-router';
import { useProfilesRead } from '@/src/api/profiles';
import { useMaxPushUpRecordsList } from '@/src/api/maxPushUpRecords';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { data: profile } = useProfilesRead();
  const { data } = useMaxPushUpRecordsList();

  async function logOut() {
    await supabase.auth.signOut();
  }

  const startMaxPushUps = () => {
    console.log('Start Max Push Ups!');
    router.push('/training');
  };

  useEffect(() => {
    console.log(data);
  }, []);

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
      />
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
    </YStack>
  );
}
