import { useFonts } from 'expo-font';
import { Stack } from 'expo-router';
import 'react-native-reanimated';
import { StatusBar } from 'expo-status-bar';
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { MyTamaguiProvider, useThemeMode } from '../providers/tamaguiProvider';
import { useTheme } from 'tamagui';
import { useMemo } from 'react';

function NavBridge() {
  const { mode } = useThemeMode();
  const t = useTheme();

  const navTheme = useMemo(
    () => ({
      ...(mode === 'dark' ? DarkTheme : DefaultTheme),
      colors: {
        ...(mode === 'dark' ? DarkTheme.colors : DefaultTheme.colors),
        background: t.background?.val,
        card: t.background?.val,
        text: t.color?.val,
        border: t.borderColor?.val ?? (mode === 'dark' ? '#2A2A2A' : '#E5E7EB'),
        primary: t.color?.val,
      },
    }),
    [mode, t.background?.val, t.color?.val, t.borderColor?.val],
  );

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        screenOptions={{
          contentStyle: { backgroundColor: t.background?.val },
          headerStyle: { backgroundColor: t.background?.val },
          headerTintColor: t.color?.val,
        }}
      >
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  if (!loaded) return null;

  return (
    <MyTamaguiProvider>
      <NavBridge />
    </MyTamaguiProvider>
  );
}
