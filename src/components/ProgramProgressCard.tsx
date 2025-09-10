import React from 'react';
import { Card, YStack, XStack, H4, Paragraph, Button, Progress, SizableText } from 'tamagui';
import { Dumbbell, ChevronRight, List } from '@tamagui/lucide-icons';
import { PROGRAMS, ProgramSlug, DayPlan } from '@/src/utils/program100pushups';

type Props = {
  level?: ProgramSlug | string; // ex: '6-10'
  day?: number; // ex: 4  (prochaine séance à faire)
  onResume?: () => void; // bouton "Reprendre"
  onOpenPlanning?: () => void; // bouton "Planning"
};

function labelFromLevelSlug(slug?: string) {
  if (!slug) return undefined;
  return PROGRAMS.find((p) => p.key === slug)?.label;
}

function getDayPlan(level?: string, day?: number): DayPlan | undefined {
  if (!level || !day) return;
  const def = PROGRAMS.find((p) => p.key === level);
  return def?.plans.find((p) => p.day === day);
}

function formatSets(sets: (number | 'max')[]) {
  return sets.map((s) => (typeof s === 'number' ? s : 'max')).join(' • ');
}

export function ProgramProgressCard({ level, day, onResume, onOpenPlanning }: Props) {
  const def = level ? PROGRAMS.find((p) => p.key === level) : undefined;
  const lvlLabel = labelFromLevelSlug(level);
  const maxDay = def ? Math.max(...def.plans.map((p) => p.day)) : 6;

  // Jour à afficher (borné au range)
  const currentDay = Math.min(Math.max(day ?? 1, 1), maxDay);

  // Progression: journées complétées vs total (si day=4 => 3/6 complétées)
  const doneDays = Math.max(0, currentDay - 1);
  const progressPct = Math.round((doneDays / maxDay) * 100);

  const nextPlan = getDayPlan(level, currentDay);

  // Pas de niveau enregistré → message “faire un test max”
  if (!def || !lvlLabel) {
    return (
      <Card bordered p="$4" br="$6">
        <YStack gap="$3">
          <XStack ai="center" gap="$2">
            <Dumbbell size={20} />
            <H4>Programme</H4>
          </XStack>
          <Paragraph opacity={0.75}>
            Pas encore de programme. Faites un test max pour connaître votre niveau et démarrer.
          </Paragraph>
          <XStack jc="flex-end">
            <Button theme="accent" iconAfter={ChevronRight} onPress={onOpenPlanning}>
              Démarrer
            </Button>
          </XStack>
        </YStack>
      </Card>
    );
  }

  return (
    <Card bordered p="$4" br="$6" pressStyle={{ scale: 0.99 }}>
      <YStack gap="$3">
        {/* Header */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <Dumbbell size={20} />
            <H4>Programme {lvlLabel}</H4>
          </XStack>
        </XStack>

        {/* Progress */}
        <YStack gap="$2">
          <XStack ai="center" jc="space-between">
            <Paragraph>Avancement</Paragraph>
            <SizableText size="$6" fow="700">
              Jour {currentDay} / {maxDay}
            </SizableText>
          </XStack>

          <Progress value={progressPct} bg="$color3" br="$10">
            <Progress.Indicator bc="$accentColor" animation="bouncy" br="$10" />
          </Progress>
        </YStack>

        {/* Prochaine séance (aperçu) */}
        {nextPlan && (
          <YStack gap="$1" mt="$1">
            <Paragraph opacity={0.6}>Prochaine séance</Paragraph>
            <SizableText size="$6" fow="600">
              {formatSets(nextPlan.sets)}
            </SizableText>
            <Paragraph opacity={0.7}>
              Repos {nextPlan.restSec}s • Dernière série min&nbsp;: {nextPlan.minLastSet}
            </Paragraph>
          </YStack>
        )}

        {/* Actions */}
        <XStack mt="$2" jc="flex-end" gap="$2" fw="wrap">
          <Button size="$3" variant="outlined" icon={List} onPress={onOpenPlanning}>
            Planning
          </Button>
          <Button size="$3" theme="accent" iconAfter={ChevronRight} onPress={onResume}>
            Reprendre
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
