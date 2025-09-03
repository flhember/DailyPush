import { useRouter } from 'expo-router';
import { Card, CardHeader, CardFooter, H3, Paragraph, Button, YStack } from 'tamagui';

export function NoProgramCard() {
  const router = useRouter();

  return (
    <Card elevate bordered={0.3} p="$4" gap="$3" ai="center">
      <CardHeader>
        <H3 ta="center">Fais ton max 💪</H3>
        <Paragraph ta="center" opacity={0.7}>
          pour définir ton programme
        </Paragraph>
      </CardHeader>
      <CardFooter>
        <YStack gap="$2">
          <Button size="$4" onPress={() => router.push('/training')}>
            Créer mon programme
          </Button>
        </YStack>
      </CardFooter>
    </Card>
  );
}
