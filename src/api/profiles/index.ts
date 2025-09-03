import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const useUpdateMaxPushUpsProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    mutationFn: async (reps: number) => {
      if (!userId) throw new Error('Not authenticated');

      const { data, error } = await supabase
        .from('profiles')
        .update({
          maxPushups: reps,
        })
        .eq('id', userId)
        .select('id, maxPushups')
        .single();

      console.log(error);
      if (error) throw new Error(error.message);
      return data;
    },
    onSuccess: () => {
      console.log('onSuccess useUpdateMaxPushUpsProfile');
      if (!userId) return;
      queryClient.invalidateQueries({ queryKey: ['profiles', userId] });
      queryClient.invalidateQueries({ queryKey: ['maxPushups', userId] });
    },
  });
};
