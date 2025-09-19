import { Session } from '@supabase/supabase-js';
import { PropsWithChildren, createContext, useContext, useEffect, useState } from 'react';
import { Tables } from '@/src/database.types';
import { supabase } from '../lib/supabase';
import * as Linking from 'expo-linking';
import { useUpdateProfileIsPremium } from '../api/profiles/updatePremiumQuery';

type AuthData = {
  session: Session | null;
  profile: Tables<'profiles'> | null;
  loading: boolean;
  forgotPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
};

const AuthContext = createContext<AuthData>({
  session: null,
  loading: true,
  profile: null,
  forgotPassword: async () => {},
  updatePassword: async () => {},
});

export default function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Tables<'profiles'> | null>(null);
  const [loading, setLoading] = useState(true);
  const { mutate: updateProfileIsPremium } = useUpdateProfileIsPremium();

  const checkPremium = (profile: Tables<'profiles'>) => {
    if (!profile?.premiumEnd) return false;
    const now = new Date();
    return new Date(profile.premiumEnd) > now;
  };

  useEffect(() => {
    let active = true;

    const fetchProfile = async (userId: string) => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', userId).single();
      if (!active) return;

      const profileData = error ? null : (data ?? null);
      if (profileData) {
        const isPremium = checkPremium(profileData);
        if (profileData.isPremium !== isPremium) {
          updateProfileIsPremium({ isPremium, userId });
          profileData.isPremium = isPremium;
        }
      }

      setProfile(profileData);
      return profileData;
    };

    (async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!active) return;
      setSession(session ?? null);

      if (session?.user?.id) {
        await fetchProfile(session.user.id);
      } else {
        setProfile(null);
      }
      setLoading(false);
    })();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, nextSession) => {
      if (!active) return;
      setLoading(true);
      setSession(nextSession ?? null);

      if (nextSession?.user?.id) {
        setTimeout(() => {
          void (async () => {
            try {
              await fetchProfile(nextSession.user.id);
            } catch (e) {
              console.error('fetchProfile background failed', e);
              setProfile(null);
            } finally {
              if (active) setLoading(false);
            }
          })();
        }, 0);
      } else {
        setProfile(null);
        setLoading(false);
      }
    });

    return () => {
      console.log('Auth provider unsubscribe');
      active = false;
      subscription.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const forgotPassword = async (email: string) => {
    const redirectTo = Linking.createURL('/(auth)/reset-password');

    const { error } = await supabase.auth.resetPasswordForEmail(email.trim().toLowerCase(), {
      redirectTo,
    });
    if (error) throw error;
  };

  const updatePassword = async (password: string) => {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();
    if (sessionError || !session) throw new Error('Session invalid. Try resetting again.');
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        profile,
        forgotPassword,
        updatePassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
