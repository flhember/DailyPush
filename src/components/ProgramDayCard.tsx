import { Card, XStack, H4, Paragraph, Button, SizableText, Separator } from 'tamagui';
import { Play, ChevronLeft, ChevronRight, Timer, Dumbbell } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { pushups6to10 } from '@/src/utils/program100pushups';

type Props = {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  level: 1 | 2 | 3; // 1=A, 2=B, 3=C
  onChangeDay?: (next: 1 | 2 | 3 | 4 | 5 | 6) => void;
  onStart?: (params: { day: number; level: number }) => void;
};

// Mini "Badge"-like maison
function Pill({
  children,
  tone = 'default',
}: {
  children: React.ReactNode;
  tone?: 'default' | 'accent' | 'warn';
}) {
  const tones = {
    default: { bc: '$color3', color: '$color11' },
    accent: { bc: '$accent2', color: '$accent11' },
    warn: { bc: '$yellow3', color: '$yellow11' },
  } as const;
  const t = tones[tone];
  return (
    <XStack ai="center" px="$2" py={6} br="$10" backgroundColor={t.bc}>
      <SizableText size="$2" color={t.color}>
        {children}
      </SizableText>
    </XStack>
  );
}

const levelToLabel = (level: 1 | 2 | 3) => ({ 1: 'A', 2: 'B', 3: 'C' })[level];

export function ProgramDayCard({ day, level, onChangeDay, onStart }: Props) {
  const plan = pushups6to10[day - 1];
  const sets = plan?.sets ?? [];
  const restSec = plan?.restSec ?? 60;
  const minLast = plan?.minLastSet;

  const start = () => {
    if (onStart) return onStart({ day, level });
    router.push({
      pathname: '/training/DayTrainingScreen',
      params: { day: String(day), level: String(level) },
    });
  };

  const nextDay = (dir: -1 | 1) => {
    if (!onChangeDay) return;
    const raw = day + dir;
    const bounded = Math.min(6, Math.max(1, raw)) as 1 | 2 | 3 | 4 | 5 | 6;
    onChangeDay(bounded);
  };

  return (
    <Card elevate bordered p="$4" br="$6" gap="$3">
      <XStack ai="center" jc="space-between">
        <XStack ai="center" gap="$2">
          <Dumbbell size={18} />
          <H4>Séance du jour</H4>
        </XStack>

        <XStack ai="center" gap="$2">
          <Pill>Jour {day}</Pill>
          <Pill tone="accent">Niveau {levelToLabel(level)}</Pill>
        </XStack>
      </XStack>

      <Paragraph>Objectif séries :</Paragraph>

      {/* Chips de séries */}
      <XStack gap="$2" fw="wrap">
        {sets.map((s, i) => (
          <Pill key={i} tone={s === 'max' ? 'warn' : 'default'}>
            {s === 'max' ? 'MAX' : `${s}`}
          </Pill>
        ))}
      </XStack>

      <XStack ai="center" gap="$2" mt="$2">
        <Timer size={16} />
        <Paragraph>
          Repos conseillé : {restSec}s{' '}
          {typeof minLast === 'number' ? `· Dernière série min : ${minLast}` : ''}
        </Paragraph>
      </XStack>

      <Separator />

      <XStack jc="space-between" ai="center" gap="$2">
        <XStack gap="$1">
          <Button
            size="$2"
            variant="outlined"
            icon={ChevronLeft}
            onPress={() => nextDay(-1)}
            disabled={!onChangeDay}
          />
          <Button
            size="$2"
            variant="outlined"
            iconAfter={ChevronRight}
            onPress={() => nextDay(+1)}
            disabled={!onChangeDay}
          />
        </XStack>

        <Button theme="accent" icon={Play} onPress={start}>
          Commencer
        </Button>
      </XStack>
    </Card>
  );
}
