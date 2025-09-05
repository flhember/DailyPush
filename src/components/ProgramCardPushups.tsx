import { Card, YStack, XStack, Paragraph, SizableText, Button, Separator, H4 } from 'tamagui';
import { Dumbbell, Calendar, ChevronRight, Timer } from '@tamagui/lucide-icons';

// --- IMPORTS DE TES TABLEAUX ---
// (importe-les depuis ton fichier où tu les as définis)
import {
  pushupsUnder5,
  pushups6to10,
  pushups11to20,
  pushups21to25,
  pushups26to30,
  pushups31to35,
  pushups36to40,
  pushups41to45,
  pushups46to50,
  pushups51to55,
  pushups56to60,
  pushupsOver60,
} from '@/src/utils/program100pushups';

// --- TYPES (tes DayPlan)
export type DayPlan = {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  restSec: number;
  sets: (number | 'max')[];
  minLastSet: number;
  minRestAfterDays: number;
};

// --- HELPERS ---
function pickPlanByMax(maxPushups: number): DayPlan[] {
  if (maxPushups <= 5) return pushupsUnder5;
  if (maxPushups <= 10) return pushups6to10;
  if (maxPushups <= 20) return pushups11to20;
  if (maxPushups <= 25) return pushups21to25;
  if (maxPushups <= 30) return pushups26to30;
  if (maxPushups <= 35) return pushups31to35;
  if (maxPushups <= 40) return pushups36to40;
  if (maxPushups <= 45) return pushups41to45;
  if (maxPushups <= 50) return pushups46to50;
  if (maxPushups <= 55) return pushups51to55;
  if (maxPushups <= 60) return pushups56to60;
  return pushupsOver60;
}

function formatSets(sets: (number | 'max')[]) {
  // ex: "12 • 17 • 13 • 13 • max"
  return sets.map((s) => (typeof s === 'number' ? s : 'max')).join(' • ');
}

type Props = {
  title: string;
  maxPushups: number;
  currentDayIndex: number; // 0-based index de la prochaine séance à faire
  onStart?: (plan: DayPlan) => void;
  onPlanning?: () => void;
  onPressCard?: () => void;
};

export function ProgramCardPushups({
  title,
  maxPushups,
  currentDayIndex,
  onStart,
  onPlanning,
  onPressCard,
}: Props) {
  const plan = pickPlanByMax(maxPushups);
  const clampedIndex = Math.max(0, Math.min(currentDayIndex, plan.length - 1));
  const day = plan[clampedIndex];

  return (
    <Card elevate bordered={1} p="$4" br="$6" onPress={onPressCard}>
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
          <Button size="$3" variant="outlined" icon={Calendar} onPress={onPlanning}>
            Planning
          </Button>
          <Button size="$3" theme="accent" onPress={() => onStart?.(day)} iconAfter={ChevronRight}>
            Commencer
          </Button>
        </XStack>
      </YStack>
    </Card>
  );
}
