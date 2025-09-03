import { YStack, H1, Paragraph, Button } from 'tamagui';
import { useState } from 'react';
import { Pressable } from 'react-native';
import { StopTrainingDialog } from '@/src/components/StopTrainingDiag';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { generateProgram } from '@/src/scripts/generateProgram';

export default function TrainingScreen() {
  const [maxPushups, setMaxPushups] = useState(0);
  const insets = useSafeAreaInsets();

  const onPress = () => {
    setMaxPushups((c) => c + 1);
  };

  const handleStopTraining = () => {
    console.log('Training stopped!');
    router.replace('/(tabs)');
  };

  const handleValideTraining = () => {
    let level: number;

    if (maxPushups < 10) level = 1;
    else if (maxPushups < 20) level = 2;
    else if (maxPushups < 35) level = 3;
    else if (maxPushups < 50) level = 4;
    else level = 5;

    const program = generateProgram(maxPushups);
    console.log(program[level].sessions[0]);
    console.log(program[level].sessions[1]);
    console.log(program[level].sessions[2]);

    console.log(program[level].week);
    //router.replace('/(tabs)');
  };

  return (
    <YStack f={1} animation="quicker">
      <Pressable style={{ flex: 1 }} onPress={onPress}>
        <YStack f={1} jc="center" ai="center">
          <StopTrainingDialog onConfirm={handleStopTraining} />
          <YStack jc="center" ai="center" p={10}>
            <H1>{maxPushups}</H1>
            <Paragraph size="$8">Pompes</Paragraph>
          </YStack>
        </YStack>
        {maxPushups > 0 && (
          <YStack gap="$3" ai="center" mb={insets.bottom + 30}>
            <Paragraph size="$7">Content de ton score ?</Paragraph>
            <Button theme="accent" onPress={handleValideTraining}>
              Valider mon entraînement
            </Button>
          </YStack>
        )}
      </Pressable>
    </YStack>
  );
}
