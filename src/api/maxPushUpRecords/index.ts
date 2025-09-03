import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export const useMaxPushUpRecordsList = () => {
  const { session } = useAuth();
  const id = session?.user.id;

  return useQuery({
    queryKey: ['maxPushUpRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('maxPushUpRecords')
        .select('*')
        .eq('user_id', id)
        .order('created_at', { ascending: false });
      if (error) {
        throw new Error(error.message);
      }
      return data;
    },
  });
};

export const useInsertMaxPushUpRecords = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newProduct } = await supabase.from('maxPushUpRecords').insert({
        numberPushUps: data.numberPushUps,
        user_id: userId,
      });

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      return newProduct;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['maxPushUpRecords'],
      });
    },
  });
};
