import { Tables } from '@/src/database.types';
import { supabase } from '@/src/lib/supabase';
import { useAuth } from '@/src/providers/AuthProvider';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

export type SessionRecord = Tables<'sessionsRecords'>;

//Use for read the history of the record of sessions
export const useSessionsRecordsList = () => {
  const { session } = useAuth();
  const userId = session?.user.id;

  return useQuery<SessionRecord[]>({
    queryKey: ['sessionsRecords'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('sessionsRecords')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });
      if (error) {
        console.log('sessionsRecords read error: ', error);
        throw new Error(error.message);
      }
      return data;
    },
  });
};

//Use it for add a record of a session
export const useInsertSessionRecord = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user.id;

  return useMutation({
    async mutationFn(data: any) {
      const { error, data: newRecord } = await supabase.from('sessionsRecords').insert({
        user_id: userId,
        level: data.level,
        day: data.day,
        sets_target: data.sets_target,
        sets_actual: data.sets_actual,
        success: data.success,
        last_set_reps: data.last_set_reps,
        total_reps: data.total_reps,
      });

      if (error) {
        console.log('sessionsRecords insert error: ', error);
        throw new Error(error.message);
      }
      return newRecord;
    },
    async onSuccess() {
      await queryClient.invalidateQueries({
        queryKey: ['sessionsRecords'],
      });
    },
  });
};
