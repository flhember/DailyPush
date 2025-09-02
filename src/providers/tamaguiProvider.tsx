import React, { createContext, useContext, useState } from 'react';
import { TamaguiProvider, Theme } from 'tamagui';
import config from '../../tamagui.config';

const Ctx = createContext({
  mode: 'light',
  setMode: (m: 'light' | 'dark') => {},
});
export const useThemeMode = () => useContext(Ctx);

export function MyTamaguiProvider({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<'light' | 'dark'>('light');

  return (
    <Ctx.Provider value={{ mode, setMode }}>
      <TamaguiProvider config={config} defaultTheme={mode}>
        <Theme name={mode} key={mode}>
          {children}
        </Theme>
      </TamaguiProvider>
    </Ctx.Provider>
  );
}
