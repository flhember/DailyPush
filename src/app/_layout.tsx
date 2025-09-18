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
import * as Linking from 'expo-linking';
import { parseTokensFromUrl } from '../utils/parseTokensFromUrl';
import { supabase } from '../lib/supabase';

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
    const path = segments.join('/');
    if (path.includes('reset-password')) {
      return;
    }

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

  useEffect(() => {
    let mounted = true;

    const handleUrl = async (rawUrl: string | null) => {
      console.log('[handleUrl Root] start with ', rawUrl);
      if (!mounted || !rawUrl) return;
      try {
        if (!rawUrl.includes('type=recovery') && !rawUrl.includes('reset-password')) return;

        const parsed = parseTokensFromUrl(rawUrl);

        if (!parsed) {
          console.warn('[Root] no tokens parsed from url');
          return;
        }

        const { access_token, refresh_token } = parsed as {
          access_token?: string | null;
          refresh_token?: string | null;
        };

        if (access_token && refresh_token) {
          try {
            await supabase.auth.setSession({
              access_token,
              refresh_token,
            });
          } catch (e) {
            console.error('[Root] setSession failed', e);
          }
        } else {
          console.warn('[Root] access/refresh tokens missing - maybe fragment lost (warm start)');
        }
      } catch (e) {
        console.error('[Root] handleUrl crashed', e);
      }
    };

    void Linking.getInitialURL()
      .then((u) => handleUrl(u))
      .catch((e) => console.warn('[Root] getInitialURL err', e));

    const subscription = Linking.addEventListener('url', (ev) => {
      void handleUrl(ev.url);
    });

    return () => {
      mounted = false;
      try {
        subscription.remove();
      } catch {}
    };
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
          <QueryProvider>
            <AuthProvider>
              <NavBridge />
            </AuthProvider>
          </QueryProvider>
        </PortalProvider>
      </MyTamaguiProvider>
    </SafeAreaProvider>
  );
}
