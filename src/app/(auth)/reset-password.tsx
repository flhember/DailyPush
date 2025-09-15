import { useEffect, useState, useMemo } from 'react';
import { Alert, KeyboardAvoidingView, Linking, Platform } from 'react-native';
import {
  YStack,
  Card,
  Paragraph,
  Input,
  Label,
  Button,
  Spinner,
  SizableText,
  XStack,
} from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export function parseAuthFromUrl(url?: string) {
  if (!url) return { kind: 'none' as const };

  const q = new URL(url).searchParams;
  const code = q.get('code');
  if (code) return { kind: 'pkce' as const, code };

  const hash = url.split('#')[1];
  if (hash) {
    const params = new URLSearchParams(hash);
    const type = params.get('type');
    const access_token = params.get('access_token');
    const refresh_token = params.get('refresh_token');
    if (type === 'recovery' && access_token && refresh_token) {
      return { kind: 'implicit' as const, access_token, refresh_token };
    }
  }

  return { kind: 'none' as const };
}

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(true);
  const [stage, setStage] = useState<'waiting' | 'ready'>('waiting');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState<string | null>(null);

  const pwdOk = useMemo(() => pwd.length >= 6, [pwd]);
  const match = pwd && pwd2 && pwd === pwd2;

  useEffect(() => {
    let mounted = true;

    const handleInitial = async () => {
      try {
        const initial = await Linking.getInitialURL();
        const parsed = parseAuthFromUrl(initial ?? undefined);

        if (parsed.kind === 'none') {
          if (mounted) setStage('waiting');
          return;
        }

        if (parsed.kind === 'pkce') {
          // ⚠️ PKCE flow : fonctionne seulement sur build standalone
          const { data, error } = await supabase.auth.exchangeCodeForSession(parsed.code);
          if (error) throw error;
          if (mounted) setStage('ready');
        }

        if (parsed.kind === 'implicit') {
          const { data, error } = await supabase.auth.setSession({
            access_token: parsed.access_token,
            refresh_token: parsed.refresh_token,
          });
          if (error) throw error;
          if (mounted) setStage('ready');
        }
      } catch (e: any) {
        if (mounted) setError(e?.message ?? 'Lien invalide ou expiré');
      } finally {
        if (mounted) setBusy(false);
      }
    };

    void handleInitial();

    return () => {
      mounted = false;
    };
  }, []);

  const onUpdate = async () => {
    if (!pwdOk || !match || busy) return;
    try {
      setBusy(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;
      Alert.alert(
        t('auth.reset.successTitle', 'Mot de passe modifié'),
        t('auth.reset.successMsg', 'Tu peux maintenant te connecter.'),
      );
      router.replace('/(auth)/sign-in');
    } catch (e: any) {
      setError(e?.message ?? 'Impossible de mettre à jour le mot de passe.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
          <Card bordered p="$5" w="90%" maw={420} br="$6">
            {busy ? (
              <YStack ai="center" gap="$2">
                <Spinner />
                <Paragraph>{t('auth.reset.loading', 'Ouverture du lien…')}</Paragraph>
              </YStack>
            ) : stage !== 'ready' ? (
              <Paragraph ta="center" color="$red10">
                {error ?? t('auth.reset.invalid', 'Lien invalide ou expiré.')}
              </Paragraph>
            ) : (
              <YStack gap="$3">
                <Paragraph ta="center" size="$7" fow="700">
                  {t('auth.reset.title', 'Définir un nouveau mot de passe')}
                </Paragraph>
                <YStack gap="$1">
                  <Label htmlFor="pwd">{t('auth.signUp.passwordLabel', 'Mot de passe')}</Label>
                  <Input
                    id="pwd"
                    size="$4"
                    secureTextEntry
                    placeholder={t('auth.signUp.passwordPlaceholder', 'Au moins 6 caractères')}
                    value={pwd}
                    onChangeText={setPwd}
                  />
                </YStack>
                <YStack gap="$1">
                  <Label htmlFor="pwd2">
                    {t('auth.reset.confirm', 'Confirmer le mot de passe')}
                  </Label>
                  <Input
                    id="pwd2"
                    size="$4"
                    secureTextEntry
                    placeholder={t('auth.reset.confirmPlaceholder', 'Répète le mot de passe')}
                    value={pwd2}
                    onChangeText={setPwd2}
                  />
                </YStack>

                {!pwdOk && pwd.length > 0 && (
                  <SizableText size="$2" color="$red10">
                    {t('auth.signUp.passwordRule', { min: 6 })}
                  </SizableText>
                )}
                {pwd && pwd2 && !match && (
                  <SizableText size="$2" color="$red10">
                    {t('auth.reset.mismatch', 'Les mots de passe ne correspondent pas')}
                  </SizableText>
                )}
                {!!error && <Paragraph color="$red10">{error}</Paragraph>}

                <Button theme="accent" onPress={onUpdate} disabled={!pwdOk || !match || busy}>
                  {busy ? <Spinner /> : t('auth.reset.submit', 'Mettre à jour')}
                </Button>

                <XStack jc="center">
                  <Button chromeless onPress={() => router.replace('/(auth)/sign-in')}>
                    {t('auth.reset.backToSignIn', 'Retour à la connexion')}
                  </Button>
                </XStack>
              </YStack>
            )}
          </Card>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
