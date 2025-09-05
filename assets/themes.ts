import { createThemes, defaultComponentThemes } from '@tamagui/theme-builder';
import * as Colors from '@tamagui/colors';

const darkPalette = [
  'hsla(248, 16%, 10%, 1)',
  'hsla(248, 16%, 14%, 1)',
  'hsla(248, 16%, 19%, 1)',
  'hsla(248, 16%, 23%, 1)',
  'hsla(248, 16%, 28%, 1)',
  'hsla(248, 16%, 32%, 1)',
  'hsla(248, 16%, 37%, 1)',
  'hsla(248, 16%, 41%, 1)',
  'hsla(248, 16%, 46%, 1)',
  'hsla(248, 16%, 50%, 1)',
  'hsla(0, 15%, 93%, 1)',
  'hsla(0, 15%, 99%, 1)',
];
const lightPalette = [
  'hsl(0, 0%, 96%)', // 0 background
  'hsl(0, 0%, 98%)', // 1 card surface
  'hsl(0, 0%, 100%)', // 2 alt surface
  'hsl(0, 0%, 88%)', // 3 separator (#e0e0e0) ✅ contraste
  'hsl(0, 0%, 91%)', // 4 card border
  'hsl(0, 0%, 86%)', // 5
  'hsl(0, 0%, 80%)', // 6
  'hsl(0, 0%, 74%)', // 7
  'hsl(0, 0%, 68%)', // 8
  'hsl(0, 0%, 60%)', // 9 generic border
  'hsl(0, 0%, 15%)', // 10 text
  'hsl(0, 0%, 3%)', // 11 hi-contrast text
];

const lightShadows = {
  shadow1: 'rgba(0,0,0,0.04)',
  shadow2: 'rgba(0,0,0,0.08)',
  shadow3: 'rgba(0,0,0,0.16)',
  shadow4: 'rgba(0,0,0,0.24)',
  shadow5: 'rgba(0,0,0,0.32)',
  shadow6: 'rgba(0,0,0,0.4)',
};

const darkShadows = {
  shadow1: 'rgba(0,0,0,0.2)',
  shadow2: 'rgba(0,0,0,0.3)',
  shadow3: 'rgba(0,0,0,0.4)',
  shadow4: 'rgba(0,0,0,0.5)',
  shadow5: 'rgba(0,0,0,0.6)',
  shadow6: 'rgba(0,0,0,0.7)',
};

const builtThemes = createThemes({
  componentThemes: defaultComponentThemes,

  base: {
    palette: {
      dark: darkPalette,
      light: lightPalette,
    },

    extra: {
      light: {
        ...Colors.green,
        ...Colors.red,
        ...Colors.yellow,
        ...lightShadows,
        shadowColor: lightShadows.shadow1,
      },
      dark: {
        ...Colors.greenDark,
        ...Colors.redDark,
        ...Colors.yellowDark,
        ...darkShadows,
        shadowColor: darkShadows.shadow1,
      },
    },
  },

  accent: {
    palette: {
      dark: [
        'hsla(250, 50%, 35%, 1)',
        'hsla(250, 50%, 38%, 1)',
        'hsla(250, 50%, 41%, 1)',
        'hsla(250, 50%, 43%, 1)',
        'hsla(250, 50%, 46%, 1)',
        'hsla(250, 50%, 49%, 1)',
        'hsla(250, 50%, 52%, 1)',
        'hsla(250, 50%, 54%, 1)',
        'hsla(250, 50%, 57%, 1)',
        'hsla(250, 50%, 60%, 1)',
        'hsla(250, 50%, 90%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
      light: [
        'hsla(250, 50%, 40%, 1)',
        'hsla(250, 50%, 43%, 1)',
        'hsla(250, 50%, 46%, 1)',
        'hsla(250, 50%, 48%, 1)',
        'hsla(250, 50%, 51%, 1)',
        'hsla(250, 50%, 54%, 1)',
        'hsla(250, 50%, 57%, 1)',
        'hsla(250, 50%, 59%, 1)',
        'hsla(250, 50%, 62%, 1)',
        'hsla(250, 50%, 65%, 1)',
        'hsla(250, 50%, 95%, 1)',
        'hsla(250, 50%, 95%, 1)',
      ],
    },
  },

  childrenThemes: {
    warning: {
      palette: {
        dark: Object.values(Colors.yellowDark),
        light: Object.values(Colors.yellow),
      },
    },

    error: {
      palette: {
        dark: Object.values(Colors.redDark),
        light: Object.values(Colors.red),
      },
    },

    success: {
      palette: {
        dark: Object.values(Colors.greenDark),
        light: Object.values(Colors.green),
      },
    },
  },

  grandChildrenThemes: {
    alt1: {
      template: 'alt1',
    },
    alt2: {
      template: 'alt2',
    },
    surface1: {
      template: 'surface1',
    },
    surface2: {
      template: 'surface2',
    },
    surface3: { template: 'surface3' },
  },
});

export type Themes = typeof builtThemes;

export const themes: Themes =
  process.env.TAMAGUI_ENVIRONMENT === 'client' && process.env.NODE_ENV === 'production'
    ? ({} as any)
    : (builtThemes as any);
