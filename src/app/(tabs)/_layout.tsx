import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { HapticTab } from '@/src/components/HapticTab';
import { Dumbbell, House, History, User } from '@tamagui/lucide-icons';
import { useTheme, YStack } from 'tamagui';
import { useTranslation } from 'react-i18next';

export default function TabLayout() {
  const th = useTheme();
  const { t } = useTranslation();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarButton: HapticTab,
        tabBarActiveTintColor: th.color?.val,
        tabBarInactiveTintColor: th.color10?.val,
        tabBarStyle: {
          backgroundColor: th.background?.val,
          borderTopColor: th.borderColor?.val,
          ...Platform.select({ ios: { position: 'absolute' } }),
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: t('nav.home'),
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <House size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
      <Tabs.Screen
        name="program"
        options={{
          title: t('nav.program'),
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <Dumbbell size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
      <Tabs.Screen
        name="history"
        options={{
          title: t('nav.history'),
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <History size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: t('nav.profile'),
          tabBarIcon: ({ color, focused }) => (
            <YStack ai="center" gap="$1" animation="bouncy" scale={focused ? 1.05 : 1}>
              <User size={24} color={color as string} />
            </YStack>
          ),
        }}
      />
    </Tabs>
  );
}
