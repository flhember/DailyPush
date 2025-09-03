import { Card, YStack, XStack, H4, Paragraph, SizableText, Button, Separator } from 'tamagui';
import { Trophy, Calendar, History } from '@tamagui/lucide-icons';

type Props = {
  value?: number | null;
  date?: Date | number | null;
  loading?: boolean;
  onPressTest?: () => void;
  onPressHistory?: () => void;
};

function formatDate(d?: Date | number | null) {
  if (!d) return '';
  const date = typeof d === 'number' ? new Date(d) : d;
  const day = String(date.getDate()).padStart(2, '0');
  const month = date.toLocaleString('fr-FR', { month: 'short' }); // ex: sept.
  const year = date.getFullYear();
  return `${day} ${month} ${year}`;
}

export function MaxPushupRecordCard({ value, date, loading, onPressTest, onPressHistory }: Props) {
  const hasRecord = typeof value === 'number' && value > 0;

  return (
    <Card elevate bordered p="$4" br="$6" pressStyle={{ scale: 0.99 }}>
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
                <Paragraph>Atteint le {formatDate(date)}</Paragraph>
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
