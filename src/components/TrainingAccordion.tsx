import React from 'react';
import { Timer, ChevronDown, Dumbbell, CheckCircle } from '@tamagui/lucide-icons';
import { YStack, XStack, Paragraph, SizableText, ScrollView, Accordion, Square } from 'tamagui';
import { DayPlan, PROGRAMS, ProgramSlug } from '@/src/utils/program100pushups';
import { SessionRecord } from '../api/sessionsRecords';
import { Badge } from './ui/Badge';
import { Platform } from 'react-native';
import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { formatSets } from '../utils/formatSets';

// helpers dans TrainingAccordion.tsx
const buildSuccessMap = (records: SessionRecord[] = []) => {
  const m = new Map<ProgramSlug, Set<number>>();
  for (const r of records) {
    if (!r.success) continue;
    const key = r.level as ProgramSlug;
    const day = Number(r.day);
    if (!m.has(key)) m.set(key, new Set());
    m.get(key)!.add(day);
  }
  return m;
};

function DayRow({
  plan,
  isNext,
  isDone,
  onStart,
}: {
  plan: DayPlan;
  index: number;
  isNext?: boolean;
  isDone?: boolean;
  onStart?: (plan: DayPlan, index: number) => void;
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
            <XStack ai="center" gap="$1">
              <CheckCircle size={16} color="$green10" />
            </XStack>
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
          {formatSets(plan.sets)}
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
  currentDay,
  successDays,
  onStart,
  onExpandChange,
}: {
  title: string;
  subtitle: string;
  plans: DayPlan[];
  expanded?: boolean;
  currentDay: number;
  successDays?: Set<number>;
  onStart?: (plan: DayPlan, index: number) => void;
  onExpandChange?: (open: boolean) => void;
}) {
  const [value, setValue] = React.useState<string[]>(expanded ? ['open'] : []);

  React.useEffect(() => {
    setValue(expanded ? ['open'] : []);
    if (expanded) requestAnimationFrame(() => onExpandChange?.(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [expanded]);

  const handleChange = (v: string[]) => {
    setValue(v);
    onExpandChange?.(v.includes('open'));
  };

  return (
    <Accordion type="multiple" value={value} onValueChange={handleChange}>
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
              <DayRow
                key={i}
                plan={p}
                index={i}
                onStart={onStart}
                isDone={successDays?.has(p.day)}
                isNext={!!expanded && p.day === currentDay}
              />
            ))}
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

export default function TrainingAccordion({
  currentLevel,
  currentDay,
  sessionsRecords,
  onStart,
}: {
  currentLevel: string | undefined;
  currentDay: number;
  sessionsRecords?: SessionRecord[];
  onStart?: (plan: DayPlan, index: number, levelKey: string) => void;
}) {
  const tabBarHeight = useBottomTabBarHeight();
  const scrollRef = React.useRef<ScrollView>(null);
  const positionsRef = React.useRef<Record<ProgramSlug, number>>({} as any);
  const successByLevel = React.useMemo(() => buildSuccessMap(sessionsRecords), [sessionsRecords]);

  const rememberY = (slug: ProgramSlug, y: number) => {
    positionsRef.current[slug] = y;
  };

  const scrollToSlug = (slug: ProgramSlug) => {
    const y = positionsRef.current[slug];
    if (typeof y === 'number') {
      requestAnimationFrame(() => {
        scrollRef.current?.scrollTo({
          y: Math.max(0, y + 4),
          animated: true,
        });
      });
    }
  };

  console.log(buildSuccessMap(sessionsRecords));

  return (
    <ScrollView
      ref={scrollRef}
      // contentInsetAdjustmentBehavior={Platform.OS === 'ios' ? 'automatic' : undefined}
      contentContainerStyle={{
        paddingBottom: Platform.OS === 'ios' ? tabBarHeight : 0,
      }}
    >
      {/* Sections par niveau */}
      <YStack gap="$0">
        {PROGRAMS.map((lvl) => {
          const done = successByLevel.get(lvl.key) ?? new Set<number>();
          return (
            <YStack key={lvl.key} onLayout={(e) => rememberY(lvl.key, e.nativeEvent.layout.y)}>
              <LevelSection
                title={`Niveau ${lvl.label}`}
                subtitle={`Programme ${lvl.range} pompes`}
                plans={lvl.plans}
                expanded={currentLevel === lvl.key}
                currentDay={currentDay}
                successDays={done}
                onStart={(plan, i) => onStart?.(plan, i, lvl.key)}
                onExpandChange={(open) => open && scrollToSlug(lvl.key)}
              />
            </YStack>
          );
        })}
      </YStack>
    </ScrollView>
  );
}
