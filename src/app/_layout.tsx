import { useFonts } from 'expo-font';
import { router, Stack, useSegments } from 'expo-router';
import { useEffect, useMemo, useRef } from 'react';
import 'react-native-reanimated';
import { PortalProvider, useTheme } from 'tamagui';
import { StatusBar } from 'expo-status-bar';
import {
  ThemeProvider as NavThemeProvider,
  DarkTheme,
  DefaultTheme,
} from '@react-navigation/native';
import { MyTamaguiProvider, useThemeMode } from '@/src/providers/TamaguiProvider';
import AuthProvider, { useAuth } from '@/src/providers/AuthProvider';
import QueryProvider from '@/src/providers/QueryProvider';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { initI18n } from '@/src/i18n';

function NavBridge() {
  const t = useTheme();
  const { mode } = useThemeMode();
  const { session, loading } = useAuth();
  const segments = useSegments();
  const navigating = useRef(false);

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

  useEffect(() => {
    if (loading || navigating.current) return;

    const group = segments[0];

    if (group === 'training') return;

    const inAuth = group === '(auth)';
    const inTabs = group === '(tabs)';

    if (!session && !inAuth) {
      navigating.current = true;
      router.replace('/(auth)/sign-in');
      setTimeout(() => (navigating.current = false), 0);
      return;
    }

    if (session && !inTabs) {
      console.log(session.user.email);
      navigating.current = true;
      console.log('Redirecting to /(tabs)');
      router.replace('/(tabs)');
      setTimeout(() => (navigating.current = false), 0);
    }
  }, [session, loading, segments]);

  return (
    <NavThemeProvider value={navTheme}>
      <StatusBar style={mode === 'dark' ? 'light' : 'dark'} />
      <Stack
        initialRouteName="index"
        screenOptions={{
          contentStyle: { backgroundColor: t.background?.val },
          headerStyle: { backgroundColor: t.background?.val },
          headerTintColor: t.color?.val,
        }}
      >
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false, animation: 'none' }} />
        <Stack.Screen name="training" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
      </Stack>
    </NavThemeProvider>
  );
}

export default function RootLayout() {
  useEffect(() => {
    (async () => {
      await initI18n();
    })();
  }, []);

  const [loaded] = useFonts({
    Inter: require('@tamagui/font-inter/otf/Inter-Medium.otf'),
    InterBold: require('@tamagui/font-inter/otf/Inter-Bold.otf'),
  });
  if (!loaded) return null;

  return (
    <SafeAreaProvider>
      <MyTamaguiProvider>
        <PortalProvider shouldAddRootHost>
          <AuthProvider>
            <QueryProvider>
              <NavBridge />
            </QueryProvider>
          </AuthProvider>
        </PortalProvider>
      </MyTamaguiProvider>
    </SafeAreaProvider>
  );
}
