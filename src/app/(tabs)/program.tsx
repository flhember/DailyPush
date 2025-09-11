import { YStack, XStack, H4 } from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import TrainingAccordion from '@/src/components/TrainingAccordion';
import { useProfilesRead } from '@/src/api/profiles';
import { useSessionsRecordsList } from '@/src/api/sessionsRecords';
import { useTranslation } from 'react-i18next';

export default function ProgramTabScreen() {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  const { data: profile } = useProfilesRead();
  const { data: sessionsRecords } = useSessionsRecordsList();

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack p="$2" gap="$3">
        <H4>{t('programScreen.titre')}</H4>
      </XStack>
      <TrainingAccordion
        currentLevel={profile?.indexLevel ?? undefined}
        currentDay={profile?.indexDay ?? 0}
        sessionsRecords={sessionsRecords}
        onStart={(plan, i, levelKey) => console.log('start', levelKey, i, plan)}
      />
    </YStack>
  );
}
