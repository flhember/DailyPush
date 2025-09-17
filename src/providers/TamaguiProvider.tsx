import React, { createContext, useContext, useEffect, useState } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../../tamagui.config';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Appearance } from 'react-native';

type Mode = 'light' | 'dark';

type CtxType = {
  mode: Mode;
  setMode: (m: Mode) => void;
  followSystem: boolean;
  setFollowSystem: (v: boolean) => void;
  initialized: boolean;
};

const KEY = '@dailypush:themeMode';
const KEY_FOLLOW = '@dailypush:themeFollowSystem';

const Ctx = createContext<CtxType>({
  mode: 'light',
  setMode: () => {},
  followSystem: false,
  setFollowSystem: () => {},
  initialized: false,
});
export const useThemeMode = () => useContext(Ctx);

export function MyTamaguiProvider({ children }: { children: React.ReactNode }) {
  const [mode, setModeState] = useState<Mode>('light');
  const [followSystem, setFollowSystemState] = useState<boolean>(true);
  const [initialized, setInitialized] = useState(false);

  const applyMode = (m: Mode) => {
    setModeState(m);
  };

  const persistMode = async (m: Mode) => {
    try {
      await AsyncStorage.setItem(KEY, m);
    } catch (e) {
      console.warn('Failed to persist theme mode', e);
    }
  };

  const persistFollow = async (v: boolean) => {
    try {
      await AsyncStorage.setItem(KEY_FOLLOW, v ? '1' : '0');
    } catch (e) {
      console.warn('Failed to persist followSystem', e);
    }
  };

  useEffect(() => {
    let mounted = true;

    (async () => {
      try {
        const [savedMode, savedFollow] = await Promise.all([
          AsyncStorage.getItem(KEY),
          AsyncStorage.getItem(KEY_FOLLOW),
        ]);

        const follow = savedFollow === '1';
        if (!mounted) return;

        setFollowSystemState(follow);

        if (follow) {
          const sys = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
          setModeState(sys);
        } else if (savedMode === 'dark' || savedMode === 'light') {
          setModeState(savedMode as Mode);
        } else {
          const sys = Appearance.getColorScheme();
          setModeState(sys === 'dark' ? 'dark' : 'light');
        }
      } catch (err) {
        console.warn('Failed to load theme preference', err);
      } finally {
        if (mounted) setInitialized(true);
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    if (!followSystem) return;

    const subscription = Appearance.addChangeListener((prefs: any) => {
      const next = prefs.colorScheme === 'dark' ? 'dark' : 'light';
      applyMode(next);
    });

    return () => subscription.remove();
  }, [followSystem]);

  const setMode = (m: Mode) => {
    if (followSystem) setFollowSystem(false);
    applyMode(m);
    void persistMode(m);
  };

  const setFollowSystem = (v: boolean) => {
    setFollowSystemState(v);
    void persistFollow(v);
    if (v) {
      const sys = Appearance.getColorScheme() === 'dark' ? 'dark' : 'light';
      applyMode(sys);
    }
  };

  if (!initialized) return null;

  return (
    <Ctx.Provider value={{ mode, setMode, followSystem, setFollowSystem, initialized }}>
      <TamaguiProvider config={config} defaultTheme={mode}>
        <Theme name={mode} key={mode}>
          {children}
        </Theme>
      </TamaguiProvider>
    </Ctx.Provider>
  );
}
