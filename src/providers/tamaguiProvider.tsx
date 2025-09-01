import config from "@/tamagui.config";
import React from "react";
import { useColorScheme } from "react-native";
import { TamaguiProvider, Theme } from "tamagui";

export function MyTamaguiProvider({ children }: { children: React.ReactNode }) {
  const scheme = useColorScheme();
  const theme = scheme === "dark" ? "dark" : "light";
  return (
    <TamaguiProvider config={config} defaultTheme={theme}>
      <Theme name={theme}>{children}</Theme>
    </TamaguiProvider>
  );
}
