import React from 'react';
import { XStack, Button } from 'tamagui';
import i18n, { changeLanguage, type Lang } from '@/src/i18n';

type Props = {
  size?: '$1' | '$2' | '$3';
  rounded?: number | string; // ex: '$10' ou 999
};

export function LanguageSwitch({ size = '$2', rounded = '$10' }: Props) {
  const [lang, setLang] = React.useState(i18n.language as Lang);
  const [busy, setBusy] = React.useState(false);

  React.useEffect(() => {
    const onChange = (lng: string) => setLang((lng.startsWith('fr') ? 'fr-FR' : 'en-US') as Lang);
    i18n.on('languageChanged', onChange);
    return () => i18n.off('languageChanged', onChange);
  }, []);

  const set = async (code: Lang) => {
    if (busy || lang === code) return;
    setBusy(true);
    try {
      await changeLanguage(code); // persiste aussi dans AsyncStorage (ton helper)
    } finally {
      setBusy(false);
    }
  };

  const isFR = lang.startsWith('fr');

  return (
    <XStack ai="center" gap="$2">
      <Button
        size={size}
        disabled={busy}
        theme={isFR ? 'accent' : null}
        variant={isFR ? 'solid' : 'outlined'}
        onPress={() => set('fr-FR')}
        accessibilityRole="button"
        accessibilityState={{ selected: isFR }}
      >
        🇫🇷
      </Button>

      <Button
        size={size}
        disabled={busy}
        theme={!isFR ? 'accent' : null}
        variant={!isFR ? 'solid' : 'outlined'}
        onPress={() => set('en-US')}
        accessibilityRole="button"
        accessibilityState={{ selected: !isFR }}
      >
        🇺🇸
      </Button>
    </XStack>
  );
}
