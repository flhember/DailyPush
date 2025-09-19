import React, { useMemo } from 'react';
import {
  Sheet,
  YStack,
  XStack,
  H4,
  Button,
  Separator,
  Card,
  SizableText,
  Paragraph,
} from 'tamagui';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { X, Lock } from '@tamagui/lucide-icons';
import { PROGRAMS } from '@/src/utils/program100pushups';
import { useTranslation } from 'react-i18next';
import { Badge } from './ui/Badge';
import { router } from 'expo-router';
import { useUpdateLevelProfile } from '../api/profiles';

type Props = {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  currentLevel?: string | undefined;
  userIsPremium?: boolean | null;
};

export function LevelPickerSheet({
  open,
  onOpenChange,
  currentLevel,
  userIsPremium = false,
}: Props) {
  const insets = useSafeAreaInsets();
  const { t } = useTranslation();
  const { mutate: updateLevelProfile } = useUpdateLevelProfile();

  const freeLevels = useMemo(() => PROGRAMS.filter((p) => !p.isPremium), []);
  const premiumLevels = useMemo(() => PROGRAMS.filter((p) => p.isPremium), []);
  const list = useMemo(() => [...freeLevels, ...premiumLevels], [freeLevels, premiumLevels]);

  const handlePress = (lvlKey: string, isPremium: boolean) => {
    if (isPremium && !userIsPremium) {
      console.log('To Do: Open sub !');
      return;
    }

    updateLevelProfile({ indexLevel: lvlKey, indexDay: 1 });
    onOpenChange(false);
  };

  return (
    <Sheet
      modal
      open={open}
      onOpenChange={onOpenChange}
      snapPoints={[50, 80]}
      dismissOnSnapToBottom
      forceRemoveScrollEnabled={open}
      zIndex={100_000}
      animation="medium"
    >
      <Sheet.Overlay
        animation="lazy"
        backgroundColor="$shadow6"
        enterStyle={{ opacity: 0 }}
        exitStyle={{ opacity: 0 }}
      />
      <Sheet.Frame animation="quick" p="$4" pb={insets.bottom + 20} gap="$3">
        <XStack ai="center" jc="space-between">
          <H4>{t('common.changeLvl')}</H4>
          <Button chromeless circular size="$2" icon={X} onPress={() => onOpenChange(false)} />
        </XStack>

        <Separator />

        <Sheet.ScrollView>
          <YStack gap="$2" pb="$4">
            {list.map((lvl) => {
              const selected = lvl.key === currentLevel;

              return (
                <Card
                  key={lvl.key}
                  bordered
                  p="$3"
                  br="$6"
                  style={lvl.isPremium ? { overflow: 'hidden' } : undefined}
                >
                  {/* Ligne titre + icônes */}
                  <XStack ai="center" jc="space-between" w="100%">
                    <XStack ai="center" gap="$3">
                      <YStack>
                        <SizableText size="$6" fow={700}>
                          {lvl.label}
                        </SizableText>
                      </YStack>
                    </XStack>

                    <XStack ai="center" gap="$2">
                      {lvl.isPremium ? (
                        <Lock size={16} color={userIsPremium ? '$accent10' : undefined} />
                      ) : null}
                      {selected ? (
                        <Badge bg="$accentColor" color="white">
                          {t('selected') ?? 'Sélectionné'}
                        </Badge>
                      ) : null}
                    </XStack>
                  </XStack>

                  {/* Description sous le titre */}
                  <Paragraph size="$4" opacity={0.7} mt="$2">
                    {t(`programDescriptions.${lvl.label}`)}
                  </Paragraph>

                  {/* Bouton d'action */}
                  <XStack jc="flex-end" gap="$2">
                    <Button
                      size="$3"
                      theme={lvl.isPremium ? (userIsPremium ? 'accent' : 'alt1') : 'accent'}
                      onPress={() => handlePress(lvl.key, Boolean(lvl.isPremium))}
                      disabled={selected}
                    >
                      {lvl.isPremium
                        ? userIsPremium
                          ? t('common.select')
                          : t('common.unlock')
                        : t('common.select')}
                    </Button>
                  </XStack>
                </Card>
              );
            })}
          </YStack>
        </Sheet.ScrollView>

        <Separator />

        <XStack jc="flex-end" ai="center">
          <XStack ai="center" gap="$2">
            <Button variant="outlined" onPress={() => onOpenChange(false)}>
              {t('common.cancel')}
            </Button>
            <Button
              theme="accent"
              onPress={() => {
                onOpenChange(false);
                router.navigate('/(tabs)/program');
              }}
            >
              {t('common.seeAll')}
            </Button>
          </XStack>
        </XStack>
      </Sheet.Frame>
      <Sheet.Handle display="none" />
    </Sheet>
  );
}
