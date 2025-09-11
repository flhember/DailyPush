import {
  Card,
  YStack,
  XStack,
  Paragraph,
  Button,
  Separator,
  H4,
  SizableText,
  Progress,
} from 'tamagui';
import { Dumbbell, ChevronRight, Timer } from '@tamagui/lucide-icons';
import { getDayPlan, PROGRAMS } from '@/src/utils/program100pushups';
import { formatSets } from '../utils/formatSets';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

type Props = {
  currentLevelIndex: string | undefined;
  currentDayIndex: number;
  onPlanning?: () => void;
};

export function ProgramCardPushups({ currentLevelIndex, currentDayIndex, onPlanning }: Props) {
  const { t } = useTranslation();

  const def = currentLevelIndex ? PROGRAMS.find((p) => p.key === currentLevelIndex) : undefined;
  const day = getDayPlan(currentLevelIndex, currentDayIndex);
  const maxDay = def ? Math.max(...def.plans.map((p) => p.day)) : 6;
  const doneDays = Math.max(0, currentDayIndex - 1);
  const progressPct = Math.round((doneDays / maxDay) * 100);

  if (!day) {
    return (
      <Card bordered p="$4" br="$6">
        <YStack gap="$3">
          <XStack ai="center" gap="$2">
            <Dumbbell size={20} />
            <H4>{t('programCard.titre')}</H4>
          </XStack>
          <Paragraph opacity={0.7}>{t('programCard.emptyDescription')}</Paragraph>
        </YStack>
      </Card>
    );
  }

  const startSession = () => {
    if (!currentLevelIndex && !day) return;
    router.push({
      pathname: '/training/DayTrainingScreen',
      params: { levelSlug: currentLevelIndex, day: String(day.day) },
    });
  };

  return (
    <Card bordered={1} p="$4" br="$6">
      <YStack gap="$3">
        {/* Header */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <Dumbbell size={20} />
            <H4>{t('programCard.titre')}</H4>
          </XStack>
        </XStack>

        {/* Progression */}
        <YStack gap="$2">
          <XStack ai="center" jc="space-between">
            <Paragraph>
              {t('programCard.level')} {currentLevelIndex}
            </Paragraph>
            <SizableText size="$6" fow="700">
              {t('programCard.dayProgress')} {currentDayIndex} / {maxDay}
            </SizableText>
          </XStack>
          <Progress value={progressPct} bg="$color3" br="$10" bc="$color6">
            <Progress.Indicator bc="$accentColor" animation="bouncy" br="$10" />
          </Progress>
        </YStack>

        {/* Bloc séance actuelle */}
        <YStack gap="$2">
          <XStack ai="center" gap="$2" fw="wrap">
            <Paragraph>{t('programCard.currentSession')}</Paragraph>
          </XStack>

          <XStack jc="center">
            <Paragraph size="$6" fow="600">
              {formatSets(day.sets)}
            </Paragraph>
          </XStack>
          <XStack ai="center" gap="$2">
            <Timer size={16} />
            <Paragraph>
              {t('programCard.restAndMinLast', {
                restSec: day.restSec,
                minLastSet: day.minLastSet,
              })}
            </Paragraph>
          </XStack>
          <Paragraph opacity={0.6}>
            {t('programCard.restAfter', { count: day.minRestAfterDays })}
          </Paragraph>
        </YStack>

        <Separator />

        {/* Actions */}
        <XStack jc="flex-end" gap="$2" fw="wrap">
          <Button size="$3" variant="outlined" icon={Dumbbell} onPress={onPlanning}>
            {t('programCard.programButton')}
          </Button>
          <Button size="$3" theme="accent" onPress={startSession} iconAfter={ChevronRight}>
            {t('programCard.startButton')}
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
