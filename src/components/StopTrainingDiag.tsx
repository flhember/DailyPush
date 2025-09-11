import { AlertDialog, Button, XStack, YStack } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';

type Props = {
  onConfirm: () => void;
};

export function StopTrainingDialog({ onConfirm }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();

  return (
    <AlertDialog native>
      <AlertDialog.Trigger asChild>
        <Button
          position="absolute"
          right={30}
          top={insets.top + 10}
          size="$2"
          circular
          icon={X}
          chromeless
          accessibilityLabel="Arrêter l'entraînement"
          hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          zIndex={1000}
        />
      </AlertDialog.Trigger>

      <AlertDialog.Portal>
        <AlertDialog.Overlay
          key="overlay"
          animation="quick"
          opacity={0.5}
          enterStyle={{ opacity: 0 }}
          exitStyle={{ opacity: 0 }}
        />

        <AlertDialog.Content
          key="content"
          bordered
          elevate
          animation={[
            'quick',
            {
              opacity: { overshootClamping: true },
            },
          ]}
          enterStyle={{ x: 0, y: -20, opacity: 0, scale: 0.9 }}
          exitStyle={{ x: 0, y: 10, opacity: 0, scale: 0.95 }}
          x={0}
          y={0}
          scale={1}
          opacity={1}
        >
          <YStack gap="$4">
            <AlertDialog.Title>{t('stopTraining.title')}</AlertDialog.Title>
            <AlertDialog.Description>{t('stopTraining.description')}</AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>{t('stopTraining.cancel')}</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild onPress={onConfirm}>
                <Button theme="accent">{t('stopTraining.confirm')}</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
