import { Card, YStack, XStack, Paragraph, Button, Separator, H4 } from 'tamagui';
import { Dumbbell, ChevronRight, Timer } from '@tamagui/lucide-icons';
import { getDayPlan } from '@/src/utils/program100pushups';
import { formatSets } from '../utils/formatSets';
import { router } from 'expo-router';

type Props = {
  title: string;
  currentLevelIndex: string | undefined;
  currentDayIndex: number;
  onPlanning?: () => void;
};

export function ProgramCardPushups({
  title,
  currentLevelIndex,
  currentDayIndex,
  onPlanning,
}: Props) {
  const day = getDayPlan(currentLevelIndex, currentDayIndex);

  if (!day) {
    return (
      <Card bordered p="$4" br="$6">
        <YStack gap="$3">
          <XStack ai="center" gap="$2">
            <Dumbbell size={20} />
            <H4>{title}</H4>
          </XStack>
          <Paragraph opacity={0.7}>
            Pas de max de pompes enregistré. Faites un test max pour savoir où vous en êtes.
          </Paragraph>
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
            <H4>{title}</H4>
          </XStack>
        </XStack>

        {/* Bloc séance actuelle */}
        <YStack gap="$2">
          <XStack ai="center" gap="$2" fw="wrap">
            <Paragraph>Séance actuelle</Paragraph>
          </XStack>

          <XStack jc="center">
            <Paragraph size="$6" fow="600">
              {formatSets(day.sets)}
            </Paragraph>
          </XStack>
          <XStack ai="center" gap="$2">
            <Timer size={16} />
            <Paragraph>
              Repos {day.restSec}s • Dernière série min: {day.minLastSet}
            </Paragraph>
          </XStack>
          <Paragraph opacity={0.6}>
            Repos recommandé après séance: {day.minRestAfterDays} jour(s)
          </Paragraph>
        </YStack>

        <Separator />

        {/* Actions */}
        <XStack jc="flex-end" gap="$2" fw="wrap">
          <Button size="$3" variant="outlined" icon={Dumbbell} onPress={onPlanning}>
            Programme
          </Button>
          <Button size="$3" theme="accent" onPress={startSession} iconAfter={ChevronRight}>
            Commencer
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
