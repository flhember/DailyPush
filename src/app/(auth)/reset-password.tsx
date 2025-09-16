import { useEffect, useState, useMemo } from 'react';
import { Alert, KeyboardAvoidingView, Platform } from 'react-native';
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

import * as Linking from 'expo-linking';
import * as QueryParams from 'expo-auth-session/build/QueryParams';

function parseTokensFromUrl(url: string) {
  const hash = url.split('#')[1]; // tout après le #
  if (!hash) return null;

  const params = new URLSearchParams(hash);
  return {
    access_token: params.get('access_token'),
    refresh_token: params.get('refresh_token'),
    expires_in: params.get('expires_in'),
    token_type: params.get('token_type'),
  };
}

export default function ResetPasswordScreen() {
  const { t } = useTranslation();
  const [busy, setBusy] = useState(true);
  const [stage, setStage] = useState<'waiting' | 'ready'>('waiting');
  const [pwd, setPwd] = useState('');
  const [pwd2, setPwd2] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [tokenUI, setTokenUI] = useState<string | null>(null);
  const [initialized, setInitialized] = useState(false);

  const pwdOk = useMemo(() => pwd.length >= 6, [pwd]);
  const match = pwd && pwd2 && pwd === pwd2;

  const createSessionFromUrl = async (url: string | null) => {
    console.log('createSessionFromUrl: ', url);
    if (!url) return;

    const { params, errorCode } = QueryParams.getQueryParams(url);
    if (errorCode) throw new Error(errorCode);

    const { access_token, refresh_token } = params;
    console.log('access_token ', access_token);
    console.log('refresh_token', refresh_token);

    if (!access_token) return;
    console.log(access_token);

    /*const { data, error } = await supabase.auth.setSession({
      access_token,
      refresh_token,
    });*/
    const { data, error } = await supabase.auth.verifyOtp({
      email: 'florian.hembertjaj@gmail.com',
      token: access_token,
      type: 'recovery',
    });

    console.log('error ', error);
    console.log('data ', data);
    setStage('ready');
    setBusy(false);
    if (error) {
      console.log(error);
    }
    return data.session;
  };

  useEffect(() => {
    let mounted = true;

    Linking.getInitialURL().then(createSessionFromUrl);

    const listener = (event: { url: string }) => createSessionFromUrl(event.url);
    Linking.addEventListener('url', listener);

    return () => {
      mounted = false;
      //Linking.removeEventListener('url', listener);
    };
  }, [initialized, t]);

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
      setError(e?.message);
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
              <YStack ai="center" gap="$3">
                <Paragraph ta="center" color="$red10">
                  {error ??
                    t('auth.reset.invalid', 'Lien invalide ou expiré. Recommence la procédure.')}
                </Paragraph>
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

                <XStack jc="center">
                  <Button chromeless onPress={() => router.replace('/(auth)/sign-in')}>
                    {t('auth.reset.backToSignIn', 'Retour à la connexion')}
                  </Button>
                </XStack>
              </YStack>
            )}
            <Button mt={30} onPress={() => router.replace('/(auth)/sign-in')}>
              {t('auth.reset.backToSignIn', 'Retour à la connexion')}
            </Button>
          </Card>
          <SizableText size="$2" color="$color12">
            {tokenUI}
          </SizableText>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
