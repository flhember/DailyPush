import { defaultConfig } from "@tamagui/config/v4";
import { shorthands } from "@tamagui/shorthands";
import { createTamagui } from "tamagui";
import { themes } from "@/assets/themes";

const config = createTamagui({
  ...defaultConfig,
  shorthands: {
    ...(defaultConfig as any).shorthands,
    ...shorthands,
  },
  themes,
});

export type AppConfig = typeof config;

declare module "tamagui" {
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config;
