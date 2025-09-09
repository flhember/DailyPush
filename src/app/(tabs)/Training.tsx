import { YStack, XStack, H3, Separator } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrainingAccordion from '@/src/components/TrainingAccordion';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';

export default function TrainingTabScreen() {
  const insets = useSafeAreaInsets();
  const tabBarHeight = useBottomTabBarHeight();

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} pb={tabBarHeight} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Training.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator mt="$0" />
      <TrainingAccordion
        currentIndexByLevel={{ '26_30': 1 }}
        completedByLevel={{ '26_30': [true, false, false, false, false, false] }}
        onStart={(plan, i, levelKey) => console.log('start', levelKey, i, plan)}
        onToggleDone={(i, levelKey) => console.log('toggle', levelKey, i)}
      />
    </YStack>
  );
}
