import { Card, YStack, XStack, H4, Paragraph, SizableText, Button, Separator } from 'tamagui';
import { Trophy, Calendar, History } from '@tamagui/lucide-icons';
import { formatInDeviceTZ } from '../utils/datetime';

type Props = {
  value?: number | null;
  date?: string | null | undefined;
  loading?: boolean;
  onPressTest?: () => void;
  onPressHistory?: () => void;
};

export function MaxPushupRecordCard({ value, date, loading, onPressTest, onPressHistory }: Props) {
  const hasRecord = typeof value === 'number' && value > 0;

  return (
    <Card elevate bordered p="$4" br="$6">
      <YStack gap="$3">
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <Trophy size={20} />
            <H4>Record max pompes</H4>
          </XStack>
        </XStack>

        {loading ? (
          <Paragraph>Chargement…</Paragraph>
        ) : hasRecord ? (
          <YStack gap="$1">
            <SizableText size="$10" fow="700">
              {value}
            </SizableText>
            <Paragraph>répétitions</Paragraph>

            {!!date && (
              <XStack ai="center" gap="$2" mt="$2">
                <Calendar size={16} />
                <Paragraph>Atteint le {formatInDeviceTZ(date)}</Paragraph>
              </XStack>
            )}
          </YStack>
        ) : (
          <YStack gap="$2">
            <Paragraph>Aucun record enregistré pour le moment.</Paragraph>
            <Button size="$3" theme="accent" onPress={onPressTest}>
              Faire un test max 💪
            </Button>
          </YStack>
        )}

        {hasRecord && (
          <>
            <Separator />
            <XStack gap="$2" jc="flex-end" fw="wrap">
              <Button size="$3" variant="outlined" icon={History} onPress={onPressHistory}>
                Historique
              </Button>
              <Button size="$3" theme="accent" onPress={onPressTest}>
                Nouveau test
              </Button>
            </XStack>
          </>
        )}
      </YStack>
    </Card>
  );
}
