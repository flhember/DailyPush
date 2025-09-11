import { useMemo, useState } from 'react';
import { SectionList, RefreshControl } from 'react-native';
import { YStack, XStack, Card, Paragraph, SizableText, Button, H4 } from 'tamagui';
import { Trophy, Dumbbell, CheckCircle, XCircle } from '@tamagui/lucide-icons';
import { router } from 'expo-router';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { formatInDeviceTZ } from '@/src/utils/datetime';
import { useMaxPushUpRecordsList } from '@/src/api/maxPushUpRecords';
import { useSessionsRecordsList } from '@/src/api/sessionsRecords';
import { PROGRAMS } from '@/src/utils/program100pushups';

// ---------------- Types unifiés ----------------
type Kind = 'all' | 'max' | 'training';

type BaseItem = {
  id: string;
  type: 'max' | 'training';
  dateISO: string;
};

type MaxItem = BaseItem & {
  type: 'max';
  numberPushUps: number;
};

type TrainingItem = BaseItem & {
  type: 'training';
  level: string | null;
  day: number | null;
  total_reps: number | null;
  last_set_reps: number | null;
  success: boolean | null;
};

type HistoryItem = MaxItem | TrainingItem;

// ---------------- Utils ----------------
function monthKey(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
}

function labelFromLevelSlug(slug: string | null | undefined) {
  const def = PROGRAMS.find((p) => p.key === slug);
  return def ? `Niveau ${def.label}` : (slug ?? 'Niveau ?');
}

// Normalise les deux sources vers un format commun
function normalize(maxData: any[] = [], sessData: any[] = []): HistoryItem[] {
  const maxItems: MaxItem[] = maxData
    .map((r) => {
      const iso: string | null = r.performed_at ?? r.datePushUps ?? r.created_at ?? null;
      if (!iso) return null;
      return {
        id: String(r.id ?? `${r.numberPushUps}-${iso}`),
        type: 'max',
        dateISO: iso,
        numberPushUps: Number(r.numberPushUps ?? 0),
      };
    })
    .filter(Boolean) as MaxItem[];

  const sessionItems: TrainingItem[] = sessData
    .map((r) => {
      const iso: string | null = r.completed_at ?? r.created_at ?? null;
      if (!iso) return null;
      return {
        id: String(r.id),
        type: 'training',
        dateISO: iso,
        level: r.level ?? null,
        day: r.day ?? null,
        total_reps: r.total_reps ?? null,
        last_set_reps: r.last_set_reps ?? null,
        success: r.success ?? null,
      };
    })
    .filter(Boolean) as TrainingItem[];

  return [...maxItems, ...sessionItems].sort(
    (a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime(),
  );
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [kind, setKind] = useState<Kind>('all');

  const {
    data: maxData = [],
    isLoading: loadingMax,
    refetch: refetchMax,
    isRefetching: refetchingMax,
  } = useMaxPushUpRecordsList();

  const {
    data: sessions = [],
    isLoading: loadingSess,
    refetch: refetchSess,
    isRefetching: refetchingSess,
  } = useSessionsRecordsList();

  const isLoading = loadingMax || loadingSess;
  const isRefetching = refetchingMax || refetchingSess;

  const allItems = useMemo(() => normalize(maxData, sessions), [maxData, sessions]);

  // Filtre d’affichage (ne touche pas aux KPIs)
  const filtered = useMemo(() => {
    if (kind === 'all') return allItems;
    return allItems.filter((it) => it.type === kind);
  }, [allItems, kind]);

  // Groupage par mois (affichage)
  const sections = useMemo(() => {
    const map = new Map<string, HistoryItem[]>();
    for (const it of filtered) {
      const key = monthKey(it.dateISO);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(it);
    }
    return Array.from(map.entries()).map(([title, data]) => ({
      title,
      data: data.sort((a, b) => new Date(b.dateISO).getTime() - new Date(a.dateISO).getTime()),
    }));
  }, [filtered]);

  const refetchAll = () => {
    refetchMax();
    refetchSess();
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      {/* Header + filtres */}
      <YStack p="$2" gap="$3">
        <H4>Historique</H4>

        {/* Filtres de type uniquement */}
        <XStack gap="$2" fw="wrap">
          <Button
            size="$3"
            theme={kind === 'all' ? 'accent' : undefined}
            variant={kind === 'all' ? undefined : 'outlined'}
            onPress={() => setKind('all')}
          >
            Tout
          </Button>
          <Button
            size="$3"
            theme={kind === 'max' ? 'accent' : undefined}
            variant={kind === 'max' ? undefined : 'outlined'}
            onPress={() => setKind('max')}
            icon={Trophy}
          >
            Max
          </Button>
          <Button
            size="$3"
            theme={kind === 'training' ? 'accent' : undefined}
            variant={kind === 'training' ? undefined : 'outlined'}
            onPress={() => setKind('training')}
            icon={Dumbbell}
          >
            Séances
          </Button>
        </XStack>
      </YStack>

      {/* Liste groupée */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 8, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetchAll} />
        }
        renderSectionHeader={({ section: { title } }) => <Paragraph mb="$2">{title}</Paragraph>}
        renderItem={({ item }) => {
          if (item.type === 'max') {
            // ---- Item Test Max
            return (
              <Card bordered p="$3" mb="$2">
                <XStack ai="center" jc="space-between">
                  <XStack ai="center" gap="$3">
                    <Trophy size={18} />
                    <YStack>
                      <SizableText size="$6" fow="700">
                        {item.numberPushUps} pompes (test max)
                      </SizableText>
                      <Paragraph opacity={0.8}>
                        {formatInDeviceTZ(item.dateISO, { withTime: true, locale: 'fr-FR' })}
                      </Paragraph>
                    </YStack>
                  </XStack>
                </XStack>
              </Card>
            );
          }

          // ---- Item Séance Training
          const success = !!item.success;
          return (
            <Card bordered p="$3" mb="$2">
              <XStack ai="center" jc="space-between">
                <XStack ai="center" gap="$3" fw="wrap">
                  <Dumbbell size={18} />
                  <YStack>
                    <SizableText size="$6" fow="700">
                      {labelFromLevelSlug(item.level)} · Jour {item.day ?? '?'}
                    </SizableText>
                    <Paragraph opacity={0.8}>
                      {formatInDeviceTZ(item.dateISO, { withTime: true, locale: 'fr-FR' })}
                    </Paragraph>
                  </YStack>
                </XStack>

                <XStack ai="center" gap="$2">
                  {success ? (
                    <XStack ai="center" gap="$1">
                      <CheckCircle size={18} color="$green10" />
                      <Paragraph>OK</Paragraph>
                    </XStack>
                  ) : (
                    <XStack ai="center" gap="$1">
                      <XCircle size={18} color="$red10" />
                      <Paragraph>Échec</Paragraph>
                    </XStack>
                  )}
                </XStack>
              </XStack>

              <XStack mt="$2" ai="center" gap="$3" fw="wrap">
                <Paragraph>Total reps: {item.total_reps ?? 0}</Paragraph>
                <Paragraph>Dernière: {item.last_set_reps ?? 0}</Paragraph>
              </XStack>
            </Card>
          );
        }}
        ListEmptyComponent={
          <YStack ai="center" p="$6" gap="$2">
            <Paragraph>Aucun historique pour le moment.</Paragraph>
            <XStack gap="$2">
              <Button variant="outlined" onPress={() => router.push('/training/MaxTrainingScreen')}>
                Test max
              </Button>
            </XStack>
          </YStack>
        }
      />
    </YStack>
  );
}
