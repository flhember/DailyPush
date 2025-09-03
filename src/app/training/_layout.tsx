import { Stack } from 'expo-router';

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={{
          headerTitle: '',
          headerTransparent: true, // enlève le texte du bouton retour
          headerShown: false,
        }}
      />
    </Stack>
  );
}
