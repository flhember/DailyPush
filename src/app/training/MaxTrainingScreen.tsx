import { YStack, H1, Paragraph, Button } from 'tamagui';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { StopTrainingDialog } from '@/src/components/StopTrainingDiag';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useInsertMaxPushUpRecords } from '@/src/api/maxPushUpRecords';
import { useAuth } from '@/src/providers/AuthProvider';
import { useUpdateMaxPushUpsProfile } from '@/src/api/profiles';
import { findLevelIndex } from '@/src/utils/findLevelIndex';
import { useTranslation } from 'react-i18next';

export default function MaxTrainingScreen() {
  const [maxPushups, setMaxPushups] = useState<number>(0);
  const insets = useSafeAreaInsets();
  const { mutate: insertMaxPushUpRecords } = useInsertMaxPushUpRecords();
  const { mutate: updateMaxPushUpsProfile } = useUpdateMaxPushUpsProfile();
  const { t } = useTranslation();
  const { profile } = useAuth();

  const onPress = () => {
    setMaxPushups((c) => c + 1);
  };

  const handleStopTraining = () => {
    console.log('Training stopped!');
    router.replace('/(tabs)');
  };

  const handleValideTraining = () => {
    const indexLevel = findLevelIndex(maxPushups);
    const datePushUps = new Date().toISOString();

    insertMaxPushUpRecords(
      {
        numberPushUps: maxPushups,
        datePushUps,
      },
      {
        onSuccess: () => {
          if (
            profile?.maxPushups !== undefined &&
            (profile?.maxPushups === null || profile?.maxPushups < maxPushups)
          ) {
            updateMaxPushUpsProfile({
              numberPushUps: maxPushups,
              datePushUps,
              indexLevel,
              indexDay: 1,
            });
          }
          router.back();
        },
      },
    );
  };

  return (
    <YStack f={1} animation="quicker">
      <Pressable style={{ flex: 1 }} onPress={onPress}>
        <YStack f={1} jc="center" ai="center">
          <StopTrainingDialog onConfirm={handleStopTraining} />
          <YStack jc="center" ai="center" p={10}>
            <H1>{maxPushups}</H1>
            <Paragraph size="$8">
              {t('maxTrainingScreen.pushupsLabel', { count: maxPushups })}
            </Paragraph>
          </YStack>
        </YStack>

        <YStack gap="$3" ai="center" mb={insets.bottom + 30}>
          <Paragraph size="$7">{t('maxTrainingScreen.happy')}</Paragraph>
          <Button
            theme="accent"
            disabled={maxPushups === 0 ? true : false}
            opacity={maxPushups === 0 ? 0.5 : 1}
            onPress={handleValideTraining}
            zIndex={10000}
          >
            {t('maxTrainingScreen.save')}
          </Button>
        </YStack>
      </Pressable>
    </YStack>
  );
}
