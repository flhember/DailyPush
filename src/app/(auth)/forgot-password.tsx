import { useState, useMemo } from 'react';
import { KeyboardAvoidingView, Platform, Alert } from 'react-native';
import * as Linking from 'expo-linking';
import {
  YStack,
  XStack,
  Card,
  Paragraph,
  Input,
  Label,
  Button,
  Spinner,
  SizableText,
} from 'tamagui';
import { Mail, ArrowRight, ChevronLeft } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useTranslation } from 'react-i18next';
import { router } from 'expo-router';

export default function ForgotPasswordScreen() {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [busy, setBusy] = useState(false);
  const [sent, setSent] = useState(false);
  const [urlUI, setUrlUI] = useState<string | null>(null);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email.trim().toLowerCase()), [email]);

  const onSend = async () => {
    console.log(Linking.createURL('/auth/reset-password'));

    if (!emailValid || busy) return;
    try {
      setBusy(true);
      const redirectTo = Linking.createURL('/(auth)/reset-password');
      setUrlUI(redirectTo);
      const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
        redirectTo,
      });

      if (error) throw error;
      setSent(true);
    } catch (e: any) {
      Alert.alert('Reset password', e?.message);
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
            <YStack gap="$4">
              <XStack ai="center" jc="space-between">
                <Button
                  size="$2"
                  circular
                  chromeless
                  icon={ChevronLeft}
                  accessibilityLabel="Retour"
                  onPress={() => router.back()}
                />
                <Paragraph size="$7" fow="700" ta="center" f={1}>
                  {t('auth.forgot.title', 'Mot de passe oublié')}
                </Paragraph>
                <YStack w={32} />
              </XStack>
              <Paragraph ta="center" o={0.8}>
                {t('auth.forgot.subtitle')}
              </Paragraph>

              <YStack gap="$1">
                <Label htmlFor="fp-email">{t('auth.signIn.emailLabel')}</Label>
                <XStack ai="center" gap="$2">
                  <Mail size={18} />
                  <Input
                    id="emailForgot"
                    f={1}
                    size="$4"
                    placeholder={t('auth.signIn.emailPlaceholder')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    autoComplete="email"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="go"
                    onSubmitEditing={onSend}
                  />
                </XStack>
                {!emailValid && email.length > 0 && (
                  <SizableText size="$2" color="$red10">
                    {t('auth.signIn.invalidEmail')}
                  </SizableText>
                )}
              </YStack>

              <Button
                size="$4"
                theme="accent"
                iconAfter={busy ? undefined : ArrowRight}
                onPress={onSend}
                disabled={!emailValid || busy}
              >
                {busy ? <Spinner /> : t('auth.forgot.send')}
              </Button>

              {sent && (
                <Paragraph ta="center" color="$green10">
                  {t('auth.forgot.sent')}
                </Paragraph>
              )}
            </YStack>
          </Card>
          <SizableText size="$2" color="$color12">
            {urlUI}
          </SizableText>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
