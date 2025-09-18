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
import { Dumbbell, ChevronRight, Timer, Lock } from '@tamagui/lucide-icons';
import { getDayPlan, getLevelAccess, PROGRAMS } from '@/src/utils/program100pushups';
import { formatSets } from '../utils/formatSets';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';
import { BlurView } from 'expo-blur';
import { useThemeMode } from '../providers/TamaguiProvider';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  currentLevelIndex: string | undefined;
  currentDayIndex: number;
  isPremium?: boolean | null;
  onPlanning?: () => void;
};

export function ProgramCardPushups({
  currentLevelIndex,
  currentDayIndex,
  isPremium,
  onPlanning,
}: Props) {
  const { t } = useTranslation();
  const { mode } = useThemeMode();
  const def = currentLevelIndex ? PROGRAMS.find((p) => p.key === currentLevelIndex) : undefined;
  const day = getDayPlan(currentLevelIndex, currentDayIndex);
  const maxDay = def ? Math.max(...def.plans.map((p) => p.day)) : 6;
  const doneDays = Math.max(0, currentDayIndex - 1);
  const progressPct = Math.round((doneDays / maxDay) * 100);
  const { levelIsPremium, hasAccess } = getLevelAccess(
    currentLevelIndex,
    isPremium ? isPremium : false,
  );

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
    <Card bordered={1} p="$4" br="$6" position="relative" overflow="hidden">
      {/* Header */}
      <XStack ai="center" jc="space-between">
        <XStack ai="center" gap="$2">
          <Dumbbell size={20} />
          <H4>{t('programCard.titre')}</H4>
        </XStack>
      </XStack>

      {/* Progression */}
      <YStack gap="$3" mt="$3">
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

      {/* Overlay premium */}
      {levelIsPremium && !hasAccess && (
        <YStack
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          zIndex={10}
          ai="center"
          jc="center"
        >
          <BlurView
            experimentalBlurMethod="dimezisBlurView"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              borderRadius: 16, // doit matcher le Card
            }}
            tint={mode === 'dark' ? 'dark' : 'light'}
            intensity={20}
          />

          <LinearGradient
            colors={['rgba(70, 70, 70, 0.5)', 'rgba(0, 0, 0, 0.6)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{
              borderRadius: 16,
              padding: 16,
              borderWidth: 1,
              borderColor: 'rgba(255,255,255,0.2)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Lock size={32} color="white" />
            <SizableText size="$5" color="white" fow="700" ta="center" mt="$2">
              Niveau {currentLevelIndex} Premium
            </SizableText>
            <Paragraph size="$4" ta="center" color="white" fow="500" opacity={1} mt="$2">
              Débloque les niveaux avancés.
            </Paragraph>
            <YStack mt="$3" gap="$2" w="100%">
              <Button theme="accent">Débloquer ce niveau Premium 🚀</Button>
              <Button backgroundColor="$color4" onPress={() => console.log('Change lvl')}>
                Choisir un autre niveau
              </Button>
            </YStack>
          </LinearGradient>
        </YStack>
      )}
    </Card>
  );
}
