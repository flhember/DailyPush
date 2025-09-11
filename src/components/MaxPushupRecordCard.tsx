import { Card, YStack, XStack, H4, Paragraph, SizableText, Button } from 'tamagui';
import { Trophy, History } from '@tamagui/lucide-icons';
import { useTranslation } from 'react-i18next';

type Props = {
  value?: number | null;
  date?: string | null | undefined;
  loading?: boolean;
  onPressTest?: () => void;
  onPressHistory?: () => void;
};

export function MaxPushupRecordCard({ value, date, loading, onPressTest, onPressHistory }: Props) {
  const { t } = useTranslation();
  const hasRecord = typeof value === 'number' && value > 0;

  return (
    <Card bordered={1} p="$4" br="$6">
      <YStack gap="$3">
        {/* HEADER */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <Trophy size={20} />
            <H4>{t('maxPushupCard.pushupMaxTitle')}</H4>
          </XStack>
          {hasRecord && (
            <Button size="$2" icon={History} onPress={onPressHistory} circular chromeless />
          )}
        </XStack>

        {/* CONTENU */}
        {loading ? (
          <Paragraph>{t('common.loading')}</Paragraph>
        ) : hasRecord ? (
          <YStack gap="$2">
            <XStack ai="center" jc="space-between">
              <YStack>
                <SizableText size="$10" fow="700">
                  {value}
                </SizableText>
                <Paragraph>{t('common.repetition')}</Paragraph>
              </YStack>
              <Button mt={'$6'} size="$3" theme="accent" onPress={onPressTest}>
                {t('common.newTest')}
              </Button>
            </XStack>
          </YStack>
        ) : (
          <YStack gap="$2">
            <Paragraph>{t('maxPushupCard.pushupMaxEmpty')}</Paragraph>
            <Button size="$3" theme="accent" onPress={onPressTest}>
              {t('maxPushupCard.pushupMaxDoTest')}
            </Button>
          </YStack>
        )}
      </YStack>
    </Card>
  );
}
