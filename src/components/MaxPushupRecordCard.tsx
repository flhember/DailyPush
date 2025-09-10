import { Card, YStack, XStack, H4, Paragraph, SizableText, Button } from 'tamagui';
import { Trophy, History } from '@tamagui/lucide-icons';

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
    <Card bordered={1} p="$4" br="$6">
      <YStack gap="$3">
        {/* HEADER */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <Trophy size={20} />
            <H4>Record max pompes</H4>
          </XStack>
          {hasRecord && (
            <Button size="$2" icon={History} onPress={onPressHistory} circular chromeless />
          )}
        </XStack>

        {/* CONTENU */}
        {loading ? (
          <Paragraph>Chargement…</Paragraph>
        ) : hasRecord ? (
          <YStack gap="$2">
            <XStack ai="center" jc="space-between">
              <YStack>
                <SizableText size="$10" fow="700">
                  {value}
                </SizableText>
                <Paragraph>répétitions</Paragraph>
              </YStack>
              <Button mt={'$6'} size="$3" theme="accent" onPress={onPressTest}>
                Nouveau test
              </Button>
            </XStack>
          </YStack>
        ) : (
          <YStack gap="$2">
            <Paragraph>Aucun record enregistré pour le moment.</Paragraph>
            <Button size="$3" theme="accent" onPress={onPressTest}>
              Faire un test max 💪
            </Button>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}
