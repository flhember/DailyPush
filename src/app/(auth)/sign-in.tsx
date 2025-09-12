import { useState, useMemo, useCallback } from 'react';
import { KeyboardAvoidingView, Platform } from 'react-native';
import { router } from 'expo-router';
import {
  YStack,
  XStack,
  Card,
  H2,
  Paragraph,
  Input,
  Label,
  Button,
  Separator,
  Spinner,
  useTheme,
  SizableText,
} from 'tamagui';
import { Eye, EyeOff, LogIn, Mail, Lock, ArrowRight, Chrome } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';
import { useTranslation } from 'react-i18next';

export default function SignInScreen() {
  const th = useTheme();
  const { t } = useTranslation();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwdValid = useMemo(() => pwd.length >= 6, [pwd]);
  const canSubmit = emailValid && pwdValid && !loading;
  const MIN_PWD = 6;

  async function onSubmit() {
    console.log('Signing in with email:', email);
    setLoading(true);
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: pwd,
    });
    if (error) setError(error?.message);
    setLoading(false);
  }

  const continueWithGoogle = useCallback(async () => {
    console.log('Log with google');
  }, []);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: th.background?.val }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
          <Card elevate bordered boc={th.borderColor} bw={1} p="$5" w="90%" maw={420} br="$6">
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <H2 ta="center">{t('auth.signIn.title')}</H2>
                <Paragraph ta="center">{t('auth.signIn.subtitle')}</Paragraph>
              </YStack>

              {/* Email */}
              <YStack gap="$1">
                <Label htmlFor="email">{t('auth.signIn.emailLabel')}</Label>
                <XStack ai="center" gap="$2">
                  <Mail size={18} />
                  <Input
                    id="email"
                    f={1}
                    size="$4"
                    placeholder={t('auth.signIn.emailPlaceholder')}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    textContentType="emailAddress"
                    value={email}
                    onChangeText={setEmail}
                    returnKeyType="next"
                  />
                </XStack>
                {!emailValid && email.length > 0 && (
                  <SizableText size="$2" color="$red10">
                    {t('auth.signIn.invalidEmail')}
                  </SizableText>
                )}
              </YStack>

              {/* Password */}
              <YStack gap="$1">
                <Label htmlFor="password">{t('auth.signIn.passwordLabel')}</Label>
                <XStack ai="center" gap="$2">
                  <Lock size={18} />
                  <YStack f={1} pos="relative">
                    <Input
                      id="password"
                      size="$4"
                      pr={50}
                      placeholder={t('auth.signIn.passwordPlaceholder')}
                      secureTextEntry={!showPwd}
                      textContentType="password"
                      value={pwd}
                      onChangeText={setPwd}
                      onSubmitEditing={onSubmit}
                      returnKeyType="go"
                    />
                    <Button
                      pos="absolute"
                      right="$2"
                      top="50%"
                      mt={-18}
                      size="$2"
                      circular
                      chromeless
                      icon={showPwd ? EyeOff : Eye}
                      aria-label={t(showPwd ? 'auth.signIn.hidePwd' : 'auth.signIn.showPwd')}
                      onPress={() => setShowPwd((v: any) => !v)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    />
                  </YStack>
                </XStack>
                {!pwdValid && pwd.length > 0 && (
                  <SizableText size="$2" color="$red10">
                    {t('auth.signIn.passwordMin', { count: MIN_PWD })}
                  </SizableText>
                )}
                <XStack jc="flex-end">
                  <Button
                    chromeless
                    size="$2"
                    onPress={() => {
                      console.log('forget password screen to do ');
                    }}
                  >
                    {t('auth.signIn.forgot')}
                  </Button>
                </XStack>
              </YStack>

              {/* Error */}
              {error && (
                <Paragraph color="$red10" size="$3">
                  {error}
                </Paragraph>
              )}

              {/* Submit */}
              <Button
                size="$4"
                theme="accent"
                iconAfter={loading ? undefined : ArrowRight}
                onPress={onSubmit}
                disabled={!canSubmit}
              >
                {loading ? <Spinner /> : t('auth.signIn.submit')}
              </Button>

              {/* OAuth */}
              <YStack gap="$3">
                <XStack ai="center" gap="$3">
                  <Separator f={1} />
                  <Paragraph>{t('auth.signIn.or')}</Paragraph>
                  <Separator f={1} />
                </XStack>
                <Button
                  size="$4"
                  variant="outlined"
                  icon={Chrome}
                  onPress={continueWithGoogle}
                  disabled={loading}
                >
                  {t('auth.signIn.withGoogle')}
                </Button>
              </YStack>

              {/* Footer links */}
              <XStack jc="center" gap="$2" mt="$2">
                <Paragraph>{t('auth.signIn.newHere')}</Paragraph>
                <Button chromeless size="$2" onPress={() => router.replace('/(auth)/sign-up')}>
                  {t('auth.signIn.createAccount')}
                </Button>
              </XStack>
            </YStack>
          </Card>

          <XStack ai="center" gap="$2">
            <LogIn size={16} />
            <Paragraph size="$2">{t('auth.signIn.legalTagline')}</Paragraph>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
