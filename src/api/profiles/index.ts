import { Tables } from '@/src/database.types';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type Profile = Tables<'profiles'>;

//Use for read the profile information of the currant user
export const useProfilesRead = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery<Profile>({
    queryKey: ['profiles'],
    queryFn: async () => {
      const { data, error } = await supabase.from('profiles').select('*').eq('id', id).single();
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//Use for update the max push ups value in profile, once the value is update we reload the profile
//by invalidate the cache.
export const useUpdateMaxPushUpsProfile = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
      if (!userId) throw new Error('Not authenticated');

      const { data: profileData, error } = await supabase
        .from('profiles')
        .update({
          maxPushups: data.numberPushUps,
          maxPushupsDate: data.datePushUps,
          indexLevel: data.indexLevel,
          indexDay: data.indexDay,
        })
        .eq('id', userId)
        .select('id, maxPushups')
        .single();

      console.log(error);
      if (error) throw new Error(error.message);
      return profileData;
    },
    onSuccess: () => {
      console.log('onSuccess useUpdateMaxPushUpsProfile');
      if (!userId) return;
      queryClient.invalidateQueries({ queryKey: ['profiles'] });
    },
  });
};
