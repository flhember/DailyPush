import { useEffect, useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { YStack, Card, Paragraph, Input, Label, Button, Spinner, SizableText } from 'tamagui';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { router } from 'expo-router';
import { useTranslation } from 'react-i18next';

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(false);
  const [stage, setStage] = useState<'waiting' | 'ready'>('waiting');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const pwdOk = useMemo(() => pwd.length >= 6, [pwd]);
  const match = pwd && pwd2 && pwd === pwd2;

  useEffect(() => {
    let mounted = true;

    const { data: sub } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      console.log('[reset] onAuthStateChange', _event, !!nextSession?.user?.id);
      if (!mounted) return;

      if (nextSession?.user) {
        setStage('ready');
        setError(null);
      } else {
        setStage('waiting');
      }
    });

    const verifySessionOnce = async () => {
      if (!mounted) return;

      const { data } = await supabase.auth.getSession();

      if (data?.session) {
        setStage('ready');
      } else {
        setStage('waiting');
      }
    };

    void verifySessionOnce();

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  const onUpdate = async () => {
    if (!pwdOk || !match || busy) return;
    try {
      setBusy(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({ password: pwd });
      if (error) throw error;

      router.replace('/');
    } catch (e: any) {
      setError(e?.message);
    } finally {
      setBusy(false);
    }
  };

  const onGoBackLogIn = async () => {
    await supabase.auth.signOut();
    router.replace('/(auth)/sign-in');
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
          <Card bordered p="$5" w="90%" maw={420} br="$6">
            {stage !== 'ready' ? (
              <YStack ai="center" gap="$2">
                <Spinner />
                <Paragraph>{t('auth.reset.loading', 'Ouverture du lien…')}</Paragraph>
              </YStack>
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
              </YStack>
            )}
            <Button mt={30} onPress={onGoBackLogIn}>
              {t('auth.reset.backToSignIn', 'Retour à la connexion')}
            </Button>
          </Card>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
