import { supabase } from '@/src/lib/supabase';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateProfileIsPremium = () => {
  const queryClient = useQueryClient();

  return useMutation({
    async mutationFn(data: any) {
      if (!data.userId) throw new Error('Not authenticated');

      const { data: profileData, error } = await supabase
        .from('profiles')
        .update({ isPremium: data.isPremium })
        .eq('id', data.userId)
        .single();

      console.log(error);
      if (error) throw new Error(error.message);
      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};

export const useUpdateProfilePremiumDate = () => {
  const queryClient = useQueryClient();
  //const { session } = useAuth();
  //const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
      if (!data.userId) throw new Error('Not authenticated');

      const { data: profileData, error } = await supabase
        .from('profiles')
        .update({ isPremium: data.isPremium, premiumEnd: data.premiumEnd })
        .eq('id', data.userId)
        .single();

      console.log(error);
      if (error) throw new Error(error.message);
      return profileData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};
