import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

//Use for read the history of the record of max push ups try
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

//Use it for add a new attemps of max push up in db
export const useInsertMaxPushUpRecords = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
      console.log(data);
      const { error, data: newRecord } = await supabase.from('maxPushUpRecords').insert({
        numberPushUps: data.numberPushUps,
        datePushUps: data.datePushUps,
        user_id: userId,
      });

      if (error) {
        console.log(error);
        throw new Error(error.message);
      }
      return newRecord;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['maxPushUpRecords'],
      });
    },
  });
};
