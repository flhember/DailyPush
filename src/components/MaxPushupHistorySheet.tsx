import { useMemo } from 'react';
import {
  Sheet,
  YStack,
  XStack,
  Paragraph,
  H4,
  Button,
  Separator,
  Card,
  SizableText,
  Spinner,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Trophy } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useMaxPushUpRecordsList } from '@/src/api/maxPushUpRecords';
import { formatInDeviceTZ } from '@/src/utils/datetime'; // ton helper
import { useTranslation } from 'react-i18next';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  limit?: number;
};

export function MaxPushupHistorySheet({ open, onOpenChange, limit = 10 }: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { data = [], isLoading } = useMaxPushUpRecordsList();

  const items = useMemo(() => (data || []).slice(0, limit), [data, limit]);

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[50]}
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame animation="quick" p="$4" pb={insets.bottom + 20} gap="$3">
        <XStack ai="center" jc="space-between">
          <H4>{t('maxPushupCard.historyTitle')}</H4>
          <Button chromeless circular size="$2" icon={X} onPress={() => onOpenChange(false)} />
        </XStack>

        <Separator />

        {isLoading ? (
          <XStack ai="center" jc="center" h={120}>
            <Spinner />
            <Paragraph ml="$2">{t('common.loading')}</Paragraph>
          </XStack>
        ) : items.length === 0 ? (
          <YStack ai="center" gap="$2" p="$4">
            <Paragraph>{t('maxPushupCard.empty')}</Paragraph>
          </YStack>
        ) : (
          <Sheet.ScrollView>
            <YStack gap="$2" pb="$4">
              {items.map((r: any) => {
                const iso = r.datePushUps;
                return (
                  <Card key={r.id} bordered p="$3" pressStyle={{ scale: 0.99 }}>
                    <XStack jc="space-between" ai="center">
                      <XStack ai="center" gap="$3">
                        <Trophy size={18} />
                        <YStack>
                          <SizableText size="$7" fow="700">
                            {r.numberPushUps}
                          </SizableText>
                          <Paragraph>
                            {formatInDeviceTZ(iso, { locale: 'fr-FR', withTime: true })}
                          </Paragraph>
                        </YStack>
                      </XStack>
                    </XStack>
                  </Card>
                );
              })}
            </YStack>
          </Sheet.ScrollView>
        )}

        <Separator />
        <XStack jc="flex-end" gap="$2">
          <Button
            variant="outlined"
            onPress={() => {
              onOpenChange(false);
              router.push('/history');
            }}
          >
            {t('maxPushupCard.viewAll')}
          </Button>
          <Button
            theme="accent"
            onPress={() => {
              onOpenChange(false);
              router.push('/training/MaxTrainingScreen');
            }}
          >
            {t('common.newTest')}
          </Button>
        </XStack>
      </Sheet.Frame>
      <Sheet.Handle display="none" />
    </Sheet>
  );
}
