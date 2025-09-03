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

export default function SignInScreen() {
  const t = useTheme();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwdValid = useMemo(() => pwd.length >= 6, [pwd]);
  const canSubmit = emailValid && pwdValid && !loading;

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
        style={{ flex: 1, backgroundColor: t.background?.val }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <YStack f={1} jc="center" ai="center" p="$4" gap="$4">
          <Card elevate bordered boc={t.borderColor} bw={1} p="$5" w="90%" maw={420} br="$6">
            <YStack gap="$4">
              <YStack ai="center" gap="$2" mb="$2">
                <H2 ta="center">Bienvenue 👋</H2>
                <Paragraph ta="center">Connecte-toi pour continuer ton entraînement</Paragraph>
              </YStack>

              {/* Email */}
              <YStack gap="$1">
                <Label htmlFor="email">Email</Label>
                <XStack ai="center" gap="$2">
                  <Mail size={18} />
                  <Input
                    id="email"
                    f={1}
                    size="$4"
                    placeholder="ton@email.com"
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
                    Adresse email invalide
                  </SizableText>
                )}
              </YStack>

              {/* Password */}
              <YStack gap="$1">
                <Label htmlFor="password">Mot de passe</Label>
                <XStack ai="center" gap="$2">
                  <Lock size={18} />
                  <YStack f={1} pos="relative">
                    <Input
                      id="password"
                      size="$4"
                      pr={50}
                      placeholder="••••••••"
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
                      aria-label={showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                      onPress={() => setShowPwd((v: any) => !v)}
                      hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                    />
                  </YStack>
                </XStack>
                {!pwdValid && pwd.length > 0 && (
                  <SizableText size="$2" color="$red10">
                    6 caractères minimum
                  </SizableText>
                )}
                <XStack jc="flex-end">
                  <Button chromeless size="$2" onPress={() => router.push('/(auth)/sign-in')}>
                    Mot de passe oublié ?
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
                {loading ? <Spinner /> : 'Se connecter'}
              </Button>

              {/* OAuth */}
              <YStack gap="$3">
                <XStack ai="center" gap="$3">
                  <Separator f={1} />
                  <Paragraph>ou</Paragraph>
                  <Separator f={1} />
                </XStack>
                <Button
                  size="$4"
                  variant="outlined"
                  icon={Chrome}
                  onPress={continueWithGoogle}
                  disabled={loading}
                >
                  Continuer avec Google
                </Button>
              </YStack>

              {/* Footer links */}
              <XStack jc="center" gap="$2" mt="$2">
                <Paragraph>Nouveau ?</Paragraph>
                <Button chromeless size="$2" onPress={() => router.replace('/(auth)/sign-up')}>
                  Créer un compte
                </Button>
              </XStack>
            </YStack>
          </Card>

          <XStack ai="center" gap="$2">
            <LogIn size={16} />
            <Paragraph size="$2">
              Sécurisé & privé — nous ne partageons jamais vos données.
            </Paragraph>
          </XStack>
        </YStack>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
