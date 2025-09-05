import {
  YStack,
  XStack,
  H3,
  Separator,
  Button,
  Paragraph,
  SizableText,
  Card,
  Stack,
  ScrollView,
  Accordion,
} from 'tamagui';
import { ThemeSwitch } from '@/src/components/ThemeToggle';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
/*
export default function PlanningScreen() {
  const insets = useSafeAreaInsets();

  async function logOut() {
    await supabase.auth.signOut();
  }

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Planning.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator />
      <Button
        pos="absolute"
        left="$4"
        right="$4"
        bottom={insets.bottom + 60}
        size="$5"
        theme="error"
        onPress={logOut}
      >
        Log out
      </Button>
    </YStack>
  );
}*/

import React, { useMemo } from 'react';
import {
  CalendarDays,
  Play,
  Check,
  Timer,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Dumbbell,
} from '@tamagui/lucide-icons';

// --- Import tes plans depuis ton fichier data ---
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

// --- Types ---
export type DayPlan = {
  day: 1 | 2 | 3 | 4 | 5 | 6;
  restSec: number;
  sets: (number | 'max')[];
  minLastSet: number;
  minRestAfterDays: number;
};

// --- Mini Badge maison ---
function Badge({
  children,
  color = '$color',
  bg = '$backgroundPress',
}: {
  children: React.ReactNode;
  color?: string;
  bg?: string;
}) {
  return (
    <XStack px="$2" py="$1" br="$4" ai="center" jc="center" bc={bg}>
      <Paragraph size="$2" fow="600" col={color}>
        {children}
      </Paragraph>
    </XStack>
  );
}

// --- Utils ---
const fmtSets = (sets: (number | 'max')[]) =>
  sets.map((s) => (typeof s === 'number' ? s : 'max')).join(' • ');

const LEVELS: { key: string; label: string; range: string; plans: DayPlan[] }[] = [
  { key: 'u5', label: '< 5', range: '< 5 pompes', plans: pushupsUnder5 },
  { key: '6_10', label: '6–10', range: '6 à 10', plans: pushups6to10 },
  { key: '11_20', label: '11–20', range: '11 à 20', plans: pushups11to20 },
  { key: '21_25', label: '21–25', range: '21 à 25', plans: pushups21to25 },
  { key: '26_30', label: '26–30', range: '26 à 30', plans: pushups26to30 },
  { key: '31_35', label: '31–35', range: '31 à 35', plans: pushups31to35 },
  { key: '36_40', label: '36–40', range: '36 à 40', plans: pushups36to40 },
  { key: '41_45', label: '41–45', range: '41 à 45', plans: pushups41to45 },
  { key: '46_50', label: '46–50', range: '46 à 50', plans: pushups46to50 },
  { key: '51_55', label: '51–55', range: '51 à 55', plans: pushups51to55 },
  { key: '56_60', label: '56–60', range: '56 à 60', plans: pushups56to60 },
  { key: 'o60', label: '60+', range: '> 60', plans: pushupsOver60 },
];

// --- Lignes de séance ---
function DayRow({
  plan,
  index,
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
        <XStack gap="$2">
          <Button
            size="$2"
            variant={isDone ? 'outlinedActive' : 'outlined'}
            icon={Check}
            onPress={() => onToggleDone?.(index)}
          >
            {isDone ? 'Marqué' : 'Fait'}
          </Button>
          {!isDone && (
            <Button
              size="$2"
              theme="accent"
              onPress={() => onStart?.(plan, index)}
              icon={Play}
              iconAfter={ChevronRight}
            >
              Commencer
            </Button>
          )}
        </XStack>
      </XStack>
    </YStack>
  );
}

// --- Section par niveau ---
function LevelSection({
  title,
  subtitle,
  plans,
  currentIndex = 0,
  completed = [],
  defaultOpen = false,
  onStart,
  onToggleDone,
}: {
  title: string;
  subtitle: string;
  plans: DayPlan[];
  currentIndex?: number;
  completed?: boolean[];
  defaultOpen?: boolean;
  onStart?: (plan: DayPlan, index: number) => void;
  onToggleDone?: (index: number) => void;
}) {
  return (
    <Accordion type="multiple" defaultValue={defaultOpen ? ['open'] : []}>
      <Accordion.Item value="open">
        <Accordion.Trigger>
          {({ open = true }) => (
            <XStack
              ai="center"
              jc="space-between"
              p="$3"
              br="$5"
              bw={1}
              boc="$borderColor"
              bc="$background"
            >
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
              {open ? <ChevronUp /> : <ChevronDown />}
            </XStack>
          )}
        </Accordion.Trigger>
        <Accordion.Content>
          <YStack gap="$2" p="$3">
            {plans.map((p, i) => (
              <DayRow
                key={i}
                plan={p}
                index={i}
                isNext={i === currentIndex}
                isDone={completed[i]}
                onStart={onStart}
                onToggleDone={onToggleDone}
              />
            ))}
          </YStack>
        </Accordion.Content>
      </Accordion.Item>
    </Accordion>
  );
}

// --- Écran Planning ---
function PlanningScreen({
  selectedMax,
  currentIndexByLevel = {},
  completedByLevel = {},
  onStart,
  onToggleDone,
}: {
  selectedMax?: number; // si fourni, on ouvre la section correspondante
  currentIndexByLevel?: Record<string, number>;
  completedByLevel?: Record<string, boolean[]>;
  onStart?: (plan: DayPlan, index: number, levelKey: string) => void;
  onToggleDone?: (index: number, levelKey: string) => void;
}) {
  // Détermine le niveau par défaut à ouvrir selon selectedMax
  const defaultOpenKey = useMemo(() => {
    if (selectedMax == null) return undefined;
    if (selectedMax <= 5) return 'u5';
    if (selectedMax <= 10) return '6_10';
    if (selectedMax <= 20) return '11_20';
    if (selectedMax <= 25) return '21_25';
    if (selectedMax <= 30) return '26_30';
    if (selectedMax <= 35) return '31_35';
    if (selectedMax <= 40) return '36_40';
    if (selectedMax <= 45) return '41_45';
    if (selectedMax <= 50) return '46_50';
    if (selectedMax <= 55) return '51_55';
    if (selectedMax <= 60) return '56_60';
    return 'o60';
  }, [selectedMax]);

  return (
    <ScrollView contentContainerStyle={{ padding: 16 }}>
      <YStack gap="$3">
        {/* Header */}
        <XStack ai="center" jc="space-between">
          <XStack ai="center" gap="$2">
            <CalendarDays size={18} />
            <SizableText size="$7" fow="700">
              Planning
            </SizableText>
          </XStack>
          {selectedMax != null && <Badge>Max: {selectedMax}</Badge>}
        </XStack>

        <Separator />

        {/* Sections par niveau */}
        <YStack gap="$3">
          {LEVELS.map((lvl) => (
            <LevelSection
              key={lvl.key}
              title={`Niveau ${lvl.label}`}
              subtitle={`Programme ${lvl.range} pompes`}
              plans={lvl.plans}
              currentIndex={currentIndexByLevel[lvl.key] ?? 0}
              completed={completedByLevel[lvl.key] ?? []}
              defaultOpen={lvl.key === defaultOpenKey}
              onStart={(plan, i) => onStart?.(plan, i, lvl.key)}
              onToggleDone={(i) => onToggleDone?.(i, lvl.key)}
            />
          ))}
        </YStack>
      </YStack>
    </ScrollView>
  );
}

// --- Exemple d'usage ---
// <PlanningScreen
//   selectedMax={28}
//   currentIndexByLevel={{ '26_30': 1 }}
//   completedByLevel={{ '26_30': [true, false, false, false, false, false] }}
//   onStart={(plan, i, levelKey) => console.log('start', levelKey, i, plan)}
//   onToggleDone={(i, levelKey) => console.log('toggle', levelKey, i)}
// />

export default function PlanningTabScreen() {
  const insets = useSafeAreaInsets();

  async function logOut() {
    await supabase.auth.signOut();
  }

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      <XStack ai="center" justifyContent="space-between">
        <H3 color="$color12" animation="quicker" animateOnly={['color']}>
          Planning.
        </H3>
        <ThemeSwitch />
      </XStack>
      <Separator />
      <PlanningScreen
        currentIndexByLevel={{ '26_30': 1 }}
        completedByLevel={{ '26_30': [true, false, false, false, false, false] }}
        onStart={(plan, i, levelKey) => console.log('start', levelKey, i, plan)}
        onToggleDone={(i, levelKey) => console.log('toggle', levelKey, i)}
      />
      <Button
        pos="absolute"
        left="$4"
        right="$4"
        bottom={insets.bottom + 60}
        size="$5"
        theme="error"
        onPress={logOut}
      >
        Log out
      </Button>
    </YStack>
  );
}
