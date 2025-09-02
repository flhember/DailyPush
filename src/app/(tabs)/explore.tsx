import { YStack, XStack, H3, Separator } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabTwoScreen() {
  const insets = useSafeAreaInsets();

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Explorer.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator />
    </YStack>
  );
}
