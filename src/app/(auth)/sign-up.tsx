import { useState, useMemo, useCallback } from 'react';
import { KeyboardAvoidingView } from 'react-native';
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
  Progress,
  ScrollView,
  H3,
} from 'tamagui';
import { Eye, EyeOff, Mail, Lock, ArrowRight, Chrome, UserPlus } from '@tamagui/lucide-icons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { supabase } from '@/src/lib/supabase';

function passwordScore(pwd: string) {
  // Score simple: 0..4
  let s = 0;
  if (pwd.length >= 6) s++;
  if (/[A-Z]/.test(pwd)) s++;
  if (/[a-z]/.test(pwd)) s++;
  if (/\d/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++; // bonus
  return Math.min(s, 4);
}

export default function SignUpScreen() {
  const t = useTheme();

  const [email, setEmail] = useState('');
  const [pwd, setPwd] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  //const [acceptTos, setAcceptTos] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwdOk = useMemo(() => pwd.length >= 6 && /\d/.test(pwd) && /[A-Za-z]/.test(pwd), [pwd]);
  const score = useMemo(() => passwordScore(pwd), [pwd]);

  async function onSubmit() {
    console.log('Signing up with email:', email);
    setLoading(true);
    const { error } = await supabase.auth.signUp({
      email: email,
      password: pwd,
    });
    console.log(error);
    if (error) setError(error?.message || 'Création de compte impossible. Réessaie.');
    setLoading(false);
  }

  const continueWithGoogle = useCallback(async () => {
    console.log('Sign up with google');
  }, []);

  const strengthPct = (score / 4) * 100;
  const strengthLabel =
    score <= 1 ? 'Faible' : score === 2 ? 'Moyen' : score === 3 ? 'Bon' : 'Fort';

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1, backgroundColor: t.background?.val }}
        // behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <ScrollView contentContainerStyle={{ flexGrow: 1, padding: 16 }} bounces={false}>
          <YStack f={1} jc="center" ai="center">
            <Card elevate bordered boc={t.borderColor} bw={1} p="$5" w="90%" maw={420} br="$6">
              <YStack gap="$4">
                <YStack ai="center" gap="$2">
                  <H3 ta="center">Créer un compte</H3>
                  <Paragraph ta="center">Rejoins-nous et suis tes entraînements</Paragraph>
                </YStack>

                {/* Email */}
                <YStack gap="$1">
                  <Label htmlFor="email">Email</Label>
                  <XStack ai="center" gap="$2">
                    <Mail size={18} />
                    <Input
                      id="signUpEmail"
                      f={1}
                      size="$4"
                      placeholder="toi@email.com"
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
                        id="signUpPassword"
                        size="$4"
                        pr={50}
                        placeholder="Au moins 6 caractères"
                        secureTextEntry={!showPwd}
                        textContentType="newPassword"
                        value={pwd}
                        onChangeText={setPwd}
                        returnKeyType="next"
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
                        aria-label={
                          showPwd ? 'Masquer le mot de passe' : 'Afficher le mot de passe'
                        }
                        onPress={() => setShowPwd((v) => !v)}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      />
                    </YStack>
                  </XStack>

                  {/* Strength meter */}
                  {pwd.length > 0 && (
                    <YStack gap="$1">
                      <Progress value={strengthPct} w="100%" />
                      <SizableText size="$2">Sécurité : {strengthLabel}</SizableText>
                    </YStack>
                  )}

                  {!pwdOk && pwd.length > 0 && (
                    <SizableText size="$2" color="$red10">
                      Min. 6 caractères, lettres et chiffres requis
                    </SizableText>
                  )}
                </YStack>

                {/* TOS 
                <XStack ai="center" gap="$2">
                  <Button
                    size="$2"
                    chromeless
                    aria-label={acceptTos ? 'Décocher' : 'Cocher'}
                    onPress={() => setAcceptTos((v) => !v)}
                  >
                    {acceptTos ? '☑️' : '⬜️'}
                  </Button>
                  <Paragraph size="$3">
                    J’accepte les{' '}
                    <Paragraph textDecorationLine="underline">Conditions d’utilisation</Paragraph>{' '}
                    et la{' '}
                    <Paragraph textDecorationLine="underline">
                      Politique de confidentialité
                    </Paragraph>
                    .
                  </Paragraph>
                </XStack>
                */}

                {/* Error */}
                {error && (
                  <Paragraph color="$red10" size="$3">
                    {error}
                  </Paragraph>
                )}

                {/* Submit */}
                <Button
                  mt="$2"
                  size="$4"
                  theme="accent"
                  iconAfter={loading ? undefined : ArrowRight}
                  onPress={onSubmit}
                  disabled={loading}
                >
                  {loading ? <Spinner /> : 'Créer le compte'}
                </Button>

                {/* OAuth */}
                <YStack gap="$3" mt="$1">
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

                {/* Footer */}
                <XStack jc="center" gap="$2" mt="$2">
                  <Paragraph>Déjà un compte ?</Paragraph>
                  <Button chromeless size="$2" onPress={() => router.replace('/(auth)/sign-in')}>
                    Se connecter
                  </Button>
                </XStack>
              </YStack>
            </Card>

            <XStack ai="center" gap="$2" mt="$2">
              <UserPlus size={16} />
              <Paragraph size="$2">
                Un email de vérification peut être envoyé selon le fournisseur.
              </Paragraph>
            </XStack>
          </YStack>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
