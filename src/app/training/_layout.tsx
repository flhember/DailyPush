import { Stack } from 'expo-router';

export default function TrainingLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="MaxTrainingScreen"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: false,
        }}
      />
      <Stack.Screen
        name="DayTrainingScreen"
        options={{
          headerTitle: '',
          headerTransparent: true,
          headerShown: false,
        }}
      />
    </Stack>
  );
}
