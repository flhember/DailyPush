import React from 'react';
import { Timer, ChevronDown, Dumbbell } from '@tamagui/lucide-icons';
import { YStack, XStack, Paragraph, SizableText, ScrollView, Accordion, Square } from 'tamagui';
import { DayPlan, LEVELS } from '@/src/utils/program100pushups';
import { SessionRecord } from '../api/sessionsRecords';
import { Badge } from './ui/Badge';

// --- Utils ---
const fmtSets = (sets: (number | 'max')[]) =>
  sets.map((s) => (typeof s === 'number' ? s : 'max')).join(' • ');

function DayRow({
  plan,
  isNext,
  isDone,
  onStart,
  onToggleDone,
}: {
  plan: DayPlan;
  index: number;
  isNext?: boolean;
  isDone?: boolean;
  onStart?: (plan: DayPlan, index: number) => void;
  onToggleDone?: (index: number) => void;
}) {
  return (
    <YStack
      p="$3"
      br="$5"
      bw={1}
      boc="$borderColor"
      bc={isNext ? '$backgroundFocus' : '$background'}
      gap="$2"
    >
      <XStack ai="center" jc="space-between" gap="$2" fw="wrap">
        <XStack ai="center" gap="$2" fw="wrap">
          <Badge
            bg={isNext ? '$accentColor' : '$backgroundPress'}
            color={isNext ? 'white' : '$color'}
          >
            Jour {plan.day}
          </Badge>
          {isDone && (
            <Badge bg="$green10" color="$green1">
              Fait
            </Badge>
          )}
          {isNext && !isDone && (
            <Badge bg="$accentColor" color="white">
              Prochaine
            </Badge>
          )}
        </XStack>

        <XStack ai="center" gap="$2" fw="wrap">
          <XStack ai="center" gap="$1">
            <Timer size={14} />
            <Paragraph size="$2" opacity={0.8}>
              {plan.restSec}s repos
            </Paragraph>
          </XStack>
          <Paragraph size="$2" opacity={0.6}>
            Min dernière: {plan.minLastSet}
          </Paragraph>
        </XStack>
      </XStack>

      <XStack ai="center" jc="space-between" gap="$2" fw="wrap">
        <Paragraph size="$3" fow="600">
          {fmtSets(plan.sets)}
        </Paragraph>
      </XStack>
    </YStack>
  );
}

// --- Section par niveau ---
function LevelSection({
  title,
  subtitle,
  plans,
  expanded,
  onStart,
  onToggleDone,
}: {
  title: string;
  subtitle: string;
  plans: DayPlan[];
  expanded?: boolean;
  onStart?: (plan: DayPlan, index: number) => void;
  onToggleDone?: (index: number) => void;
}) {
  const [value, setValue] = React.useState<string[]>(expanded ? ['open'] : []);

  React.useEffect(() => {
    setValue(expanded ? ['open'] : []);
  }, [expanded]);

  return (
    <Accordion type="multiple" value={value} onValueChange={setValue}>
      <Accordion.Item value="open">
        {/* HEADER ACCORDION*/}
        <Accordion.Trigger>
          {({ open = true }) => (
            <XStack ai="center" jc="space-between">
              <XStack ai="center" gap="$2">
                <Dumbbell size={18} />
                <YStack>
                  <SizableText size="$6" fow="700">
                    {title}
                  </SizableText>
                  <Paragraph size="$2" opacity={0.7}>
                    {subtitle}
                  </Paragraph>
                </YStack>
              </XStack>
              <YStack ai="flex-end">
                <Square animation="quick" rotate={open ? '180deg' : '0deg'}>
                  <ChevronDown size="$1" />
                </Square>
              </YStack>
            </XStack>
          )}
        </Accordion.Trigger>

        {/* ACCORDION CONTENT */}
        <Accordion.Content>
          <YStack gap="$2">
            {plans.map((p, i) => (
              <DayRow key={i} plan={p} index={i} onStart={onStart} onToggleDone={onToggleDone} />
            ))}
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export default function TrainingAccordion({
  currentLevel,
  sessionsRecords,
  onStart,
  onToggleDone,
}: {
  currentLevel: string | undefined;
  sessionsRecords?: SessionRecord[];
  onStart?: (plan: DayPlan, index: number, levelKey: string) => void;
  onToggleDone?: (index: number, levelKey: string) => void;
}) {
  console.log(currentLevel);

  return (
    <ScrollView contentInsetAdjustmentBehavior="automatic" contentContainerStyle={{ padding: 5 }}>
      {/* Sections par niveau */}
      <YStack gap="$0">
        {LEVELS.map((lvl) => (
          <LevelSection
            key={lvl.key}
            title={`Niveau ${lvl.label}`}
            subtitle={`Programme ${lvl.range} pompes`}
            plans={lvl.plans}
            expanded={currentLevel === lvl.key}
            onStart={(plan, i) => onStart?.(plan, i, lvl.key)}
            onToggleDone={(i) => onToggleDone?.(i, lvl.key)}
          />
        ))}
      </YStack>
    </ScrollView>
  );
}
