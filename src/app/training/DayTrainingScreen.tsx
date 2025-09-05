import { useEffect, useMemo, useState } from 'react';
import { Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, H1, Paragraph, Button, Progress, Separator, SizableText } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import { StopTrainingDialog } from '@/src/components/StopTrainingDiag';
import { DayPlan, pushups6to10 } from '@/src/utils/program100pushups';

export default function DayTrainingScreen() {
  useKeepAwake();

  // ?day=1..6 (par défaut 1)
  const { day, pushupsLevel } = useLocalSearchParams<{ day?: string; pushupsLevel?: string }>();
  const dayIndex = Math.max(1, Math.min(6, Number(day) || 1)) - 1;
  const plan: DayPlan = pushups6to10[dayIndex];

  const [setIdx, setSetIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [state, setState] = useState<'active' | 'rest' | 'finished'>('active');
  const [restLeft, setRestLeft] = useState(0);
  const totalSets = plan.sets.length;
  const currentTarget = plan.sets[setIdx];
  //const restTimer = useRef<NodeJS.Timeout | null>(null);

  const canFinishSet = useMemo(() => {
    if (currentTarget === 'max') return count >= plan.minLastSet; // bouton actif dès qu’on a le minimum
    return count >= currentTarget;
  }, [count, currentTarget, plan.minLastSet]);

  // Incrémente une rep (tap écran)
  const addRep = () => {
    if (state !== 'active') return;
    setCount((c) => c + 1);
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // Termine la série courante
  const finishSet = () => {
    if (state !== 'active' || !canFinishSet) return;
    if (setIdx === totalSets - 1) {
      setState('finished');
      return;
    }
    // passe en repos
    setState('rest');
    setRestLeft(plan.restSec);
    setCount(0);
  };

  // Timer de repos
  /*useEffect(() => {
    if (state !== 'rest') return;
    restTimer.current && clearInterval(restTimer.current);
    restTimer.current = setInterval(() => {
      setRestLeft((s) => {
        if (s <= 1) {
          clearInterval(restTimer.current!);
          setSetIdx((i) => i + 1);
          setState('active');
          return 0;
        }
        return s - 1;
      });
    }, 1000);
    return () => restTimer.current && clearInterval(restTimer.current);
  }, [state]);*/

  // Auto-finish si cible numérique atteinte
  useEffect(() => {
    if (state !== 'active') return;
    if (typeof currentTarget === 'number' && count >= currentTarget) {
      // petite vibration et on attend un tap sur le bouton (UX claire)
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [count, state, currentTarget]);

  const progress = useMemo(() => {
    if (typeof currentTarget !== 'number' || currentTarget === 0) return 0;
    return Math.min(1, count / currentTarget);
  }, [count, currentTarget]);

  const stop = () => router.back();

  return (
    <YStack f={1} ai="center" jc="center" p="$4" gap="$5">
      <StopTrainingDialog onConfirm={stop} />

      <SizableText>
        Jour {plan.day} — Série {setIdx + 1}/{totalSets}
      </SizableText>

      {state === 'active' && (
        <>
          <H1>{count}</H1>
          <Paragraph size="$7">Pompes</Paragraph>

          {typeof currentTarget === 'number' ? (
            <>
              <Progress value={progress * 100} w={260} />
              <Paragraph>
                {count} / {currentTarget}
              </Paragraph>
            </>
          ) : (
            <Paragraph>Série “max” — minimum {plan.minLastSet}</Paragraph>
          )}

          <Pressable style={{ position: 'absolute', inset: 0 }} onPress={addRep} />

          <Button theme={'accent'} disabled={!canFinishSet} onPress={finishSet}>
            {setIdx === totalSets - 1 ? 'Terminer la séance' : 'Valider la série'}
          </Button>
        </>
      )}

      {state === 'rest' && (
        <YStack ai="center" gap="$3">
          <Paragraph size="$7">Repos</Paragraph>
          <H1>{restLeft}s</H1>
          <Paragraph>Prochaine série : {String(plan.sets[setIdx + 1])}</Paragraph>
          <Button
            onPress={() => {
              setSetIdx((i) => i + 1);
              setState('active');
              setRestLeft(0);
            }}
          >
            Passer le repos
          </Button>
        </YStack>
      )}

      {state === 'finished' && (
        <YStack ai="center" gap="$3">
          <Paragraph size="$9" fow="700" color="$green10">
            Séance terminée 🎉
          </Paragraph>
          <Paragraph>
            Respecte {plan.minRestAfterDays} jour{plan.minRestAfterDays > 1 ? 's' : ''} de repos
            minimum.
          </Paragraph>
          <Separator />
          <XStack gap="$3">
            <Button onPress={() => router.replace('/(tabs)')}>Retour</Button>
            <Button theme="accent" onPress={() => router.push('/')}>
              Jour suivant
            </Button>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
