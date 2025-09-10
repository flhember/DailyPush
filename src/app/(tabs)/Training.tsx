import { YStack, XStack, H3, Separator } from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrainingAccordion from '@/src/components/TrainingAccordion';
import { useProfilesRead } from '@/src/api/profiles';
import { useSessionsRecordsList } from '@/src/api/sessionsRecords';

export default function TrainingTabScreen() {
  const insets = useSafeAreaInsets();

  const { data: profile } = useProfilesRead();
  const { data: sessionsRecords } = useSessionsRecordsList();

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Training.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator mt="$0" />
      <TrainingAccordion
        currentLevel={profile?.indexLevel ?? undefined}
        currentDay={profile?.indexDay ?? 0}
        sessionsRecords={sessionsRecords}
        onStart={(plan, i, levelKey) => console.log('start', levelKey, i, plan)}
      />
    </YStack>
  );
}
