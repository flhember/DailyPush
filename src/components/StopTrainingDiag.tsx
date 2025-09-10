import { AlertDialog, Button, XStack, YStack } from 'tamagui';
import { X } from '@tamagui/lucide-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type Props = {
  onConfirm: () => void;
};

export function StopTrainingDialog({ onConfirm }: Props) {
  const insets = useSafeAreaInsets();

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
            <AlertDialog.Title>Arrêter l’entraînement ?</AlertDialog.Title>
            <AlertDialog.Description>
              Si tu confirmes, la session en cours sera stoppée et non reprise.
            </AlertDialog.Description>

            <XStack gap="$3" justifyContent="flex-end">
              <AlertDialog.Cancel asChild>
                <Button>Annuler</Button>
              </AlertDialog.Cancel>
              <AlertDialog.Action asChild onPress={onConfirm}>
                <Button theme="accent">Oui, arrêter</Button>
              </AlertDialog.Action>
            </XStack>
          </YStack>
        </AlertDialog.Content>
      </AlertDialog.Portal>
    </AlertDialog>
  );
}
