import { Button, Switch, XStack } from 'tamagui';
import { useThemeMode } from '../providers/TamaguiProvider';
import { Moon, Sun } from '@tamagui/lucide-icons';

export function ThemeButton() {
  const { mode, setMode } = useThemeMode();
  return (
    <Button
      circular
      size="$3"
      icon={mode === 'dark' ? Sun : Moon}
      onPress={() => setMode(mode === 'dark' ? 'light' : 'dark')}
    />
  );
}

export function ThemeSwitch() {
  const { mode, setMode } = useThemeMode();
  return (
    <XStack ai="center" gap="$2">
      <Sun size={16} />
      <Switch
        size="$3"
        checked={mode === 'dark'}
        onCheckedChange={(v) => setMode(v ? 'dark' : 'light')}
      >
        <Switch.Thumb animation="quicker" />
      </Switch>
      <Moon size={16} />
    </XStack>
  );
}
