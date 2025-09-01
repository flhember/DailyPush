import { defaultConfig } from '@tamagui/config/v4'
import { shorthands } from '@tamagui/shorthands'
import { createTamagui } from 'tamagui'

const config = createTamagui({
  ...defaultConfig,
  shorthands: {
    ...(defaultConfig as any).shorthands,
    ...shorthands,
  },
})

export type AppConfig = typeof config

declare module 'tamagui' {
  // permet l’auto-complétion des tokens/thèmes
   
  // eslint-disable-next-line @typescript-eslint/no-empty-object-type
  interface TamaguiCustomConfig extends AppConfig {}
}

export default config