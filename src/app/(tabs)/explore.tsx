import { YStack, XStack, H3, Separator, Button } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  async function logOut() {
    await supabase.auth.signOut();
  }

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Explorer.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator />
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
