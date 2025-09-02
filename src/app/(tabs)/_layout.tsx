import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/src/components/HapticTab';
import { Palette, House } from '@tamagui/lucide-icons';
import { useTheme, YStack } from 'tamagui';

export default function TabLayout() {
  const t = useTheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: t.color?.val,
        tabBarInactiveTintColor: t.color10?.val,
        tabBarStyle: {
          backgroundColor: t.background?.val,
          borderTopColor: t.borderColor?.val,
          ...Platform.select({ ios: { position: 'absolute' } }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <House size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <Palette size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
    </Tabs>
  );
}
