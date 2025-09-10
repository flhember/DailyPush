import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, Platform, Alert } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { YStack, XStack, H1, Paragraph, Button, Progress, Separator, SizableText } from 'tamagui';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';

import { StopTrainingDialog } from '@/src/components/StopTrainingDiag';
import { getDayPlan, ProgramSlug, DayPlan } from '@/src/utils/program100pushups';
import { useInsertSessionRecord } from '@/src/api/sessionsRecords';
import { useUpdateMaxPushUpsProfile } from '@/src/api/profiles';
import { getNextSession } from '@/src/utils/getNextSession';

export default function DayTrainingScreen() {
  useKeepAwake();

  const { levelSlug, day } = useLocalSearchParams<{
    levelSlug?: ProgramSlug;
    day?: string;
  }>();

  const dayNumber = Math.max(1, Math.min(6, Number(day) || 1));

  const plan: DayPlan | undefined = levelSlug ? getDayPlan(levelSlug, dayNumber) : undefined;

  // Session State
  const [setIdx, setSetIdx] = useState(0);
  const [count, setCount] = useState(0);
  const [state, setState] = useState<'active' | 'rest' | 'finished'>('active');
  const [restLeft, setRestLeft] = useState(0);
  const [setsActual, setSetsActual] = useState<number[]>([]);

  // Timer Rest
  const restTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const insertRecord = useInsertSessionRecord();
  const { mutate: updateMaxPushUpsProfile } = useUpdateMaxPushUpsProfile();

  // Dérivés (non conditionnels)
  const totalSets = plan?.sets.length ?? 0;
  const currentTarget = plan?.sets?.[setIdx];

  const canFinishSet = useMemo(() => {
    if (state !== 'active' || !plan) return false;
    if (currentTarget === 'max') return count >= plan.minLastSet;
    return typeof currentTarget === 'number' ? count >= currentTarget : false;
  }, [state, plan, currentTarget, count]);

  const progress =
    typeof currentTarget === 'number' && currentTarget > 0
      ? Math.min(100, Math.max(0, Math.round((count / currentTarget) * 100)))
      : 0;

  const indicatorBg =
    typeof currentTarget === 'number' && currentTarget > 0
      ? progress >= 100
        ? '$green10'
        : progress >= 50
          ? '$yellow10'
          : '$accentColor'
      : '$accentColor';

  const addRep = () => {
    if (state !== 'active') return;
    setCount((c) => c + 1);
    if (Platform.OS !== 'android') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
  };

  // Valide la série courante
  const finishSet = () => {
    if (!plan || !canFinishSet) return;

    const repsDone = count;

    setSetsActual((prev) => {
      const next = [...prev];
      next[setIdx] = repsDone;
      return next;
    });

    const isLastSet = setIdx >= totalSets - 1;
    if (isLastSet) {
      setState('finished');
      return;
    }

    setState('rest');
    setRestLeft(plan.restSec);
    setCount(0);
  };

  useEffect(() => {
    if (!plan) return;
    if (state !== 'rest') return;

    restTimerRef.current && clearInterval(restTimerRef.current);
    restTimerRef.current = setInterval(() => {
      setRestLeft((s) => {
        if (s <= 1) {
          clearInterval(restTimerRef.current!);
          restTimerRef.current = null;
          setSetIdx((i) => i + 1);
          setState('active');
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          return 0;
        }
        return s - 1;
      });
    }, 1000);

    return () => {
      if (restTimerRef.current) {
        clearInterval(restTimerRef.current);
        restTimerRef.current = null;
      }
    };
  }, [state, plan]);

  useEffect(() => {
    if (!plan) return;
    if (state !== 'active') return;
    if (typeof currentTarget === 'number' && count === currentTarget) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    }
  }, [count, state, currentTarget, plan]);

  const stop = () => router.back();

  // Fin de seance to Do :
  //    -Save historique seance.
  //    -Update level + day
  //
  const finalizeSession = () => {
    if (!plan || !levelSlug) return;

    const last_set_reps = setsActual[totalSets - 1] ?? count;

    const completedSets = Array.from({ length: totalSets }, (_, i) => {
      const v = i === totalSets - 1 ? last_set_reps : setsActual[i];
      return Math.max(0, Number(v) || 0);
    });
    const total_reps = completedSets.reduce((acc, n) => acc + n, 0);

    const success = last_set_reps >= plan.minLastSet;

    insertRecord.mutate(
      {
        level: levelSlug,
        day: plan.day,
        sets_target: plan.sets,
        sets_actual:
          setsActual.length === totalSets
            ? setsActual
            : [...setsActual.slice(0, totalSets - 1), last_set_reps],
        last_set_reps,
        total_reps,
        success,
      },
      {
        onSuccess: () => {
          const next = getNextSession({
            currentLevel: levelSlug,
            currentDay: plan.day,
            success,
          });

          updateMaxPushUpsProfile({
            indexLevel: next.level,
            indexDay: next.day,
          });
          router.replace('/(tabs)');
        },
        onError: (err) => {
          console.error('insert session error:', err);
          Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          Alert.alert('Erreur', err instanceof Error ? err.message : 'Une erreur est survenue.');
        },
      },
    );
  };

  if (!plan || !levelSlug) {
    return (
      <YStack f={1} jc="center" ai="center" gap="$3" p="$4">
        <Paragraph>Paramètres invalides.</Paragraph>
        <Button onPress={() => router.back()}>Retour</Button>
      </YStack>
    );
  }

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
              <Progress value={progress} w={260} bg="$color3" br="$10">
                <Progress.Indicator bc={indicatorBg} animation="bouncy" />
              </Progress>
              <Paragraph>
                {count} / {currentTarget}
              </Paragraph>
            </>
          ) : (
            <Paragraph>Série “max” — minimum {plan.minLastSet}</Paragraph>
          )}

          {/* Overlay plein écran pour compter */}
          <Pressable style={{ position: 'absolute', inset: 0 }} onPress={addRep} />

          <Button
            theme="accent"
            disabled={!canFinishSet}
            onPress={finishSet}
            opacity={canFinishSet ? 1 : 0.5}
          >
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
              // Passer le repos
              if (restTimerRef.current) {
                clearInterval(restTimerRef.current);
                restTimerRef.current = null;
              }
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
          <Paragraph ta="center">
            Respecte {plan.minRestAfterDays} jour{plan.minRestAfterDays > 1 ? 's' : ''} de repos
            minimum.
          </Paragraph>
          <Separator />
          <XStack gap="$3">
            <Button onPress={() => router.replace('/(tabs)')}>Retour</Button>
            <Button theme="accent" onPress={finalizeSession}>
              Enregistrer
            </Button>
          </XStack>
        </YStack>
      )}
    </YStack>
  );
}
