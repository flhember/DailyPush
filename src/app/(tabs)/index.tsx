import { YStack, XStack, Separator, H3, Button } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { NoProgramCard } from '@/src/components/NoProgramCard';
import { supabase } from '@/src/lib/supabase';
import { useEffect } from 'react';
import { useAuth } from '@/src/providers/authProvider';

export default function Home() {
  const insets = useSafeAreaInsets();
  const { profile } = useAuth();

  async function logOut() {
    console.log('Logout');
    const returnData = await supabase.auth.signOut();
    console.log(returnData);
  }

  useEffect(() => {
    console.log('Max pushup: ', profile?.maxPushups);
  }, [profile]);

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12">Daily Push.</H3>
        <ThemeSwitch />
      </XStack>
      <Separator />
      <NoProgramCard />
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
