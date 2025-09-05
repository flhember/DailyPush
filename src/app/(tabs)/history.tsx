import { useMemo, useState } from 'react';
import { SectionList, RefreshControl } from 'react-native';
import { YStack, XStack, Card, Paragraph, SizableText, Button, Separator, H4 } from 'tamagui';
import { Trophy, Trash2, Plus } from '@tamagui/lucide-icons';
import { useMaxPushUpRecordsList } from '@/src/api/maxPushUpRecords';
//import { useDeleteMaxPushUpRecord } from '@/src/api/maxPushUpRecords.delete'; // ci-dessous
import { router } from 'expo-router';
import { formatInDeviceTZ } from '@/src/utils/datetime';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

type RecordItem = {
  id: string;
  numberPushUps: number;
  performed_at?: string | null; // ou datePushUps selon ta colonne
  datePushUps?: string | null;
};

function monthKey(dateISO: string) {
  const d = new Date(dateISO);
  return d.toLocaleString('fr-FR', { month: 'long', year: 'numeric' });
}

function getISO(item: RecordItem) {
  return (item.performed_at || item.datePushUps || '') as string;
}

export default function HistoryScreen() {
  const insets = useSafeAreaInsets();
  const [range, setRange] = useState<'30' | '90' | 'all'>('30');
  const { data = [], isLoading, refetch, isRefetching } = useMaxPushUpRecordsList();
  //const del = useDeleteMaxPushUpRecord();

  // filtrage par période
  const filtered = useMemo(() => {
    if (!data?.length) return [];
    if (range === 'all') return data;
    const days = range === '30' ? 30 : 90;
    const since = Date.now() - days * 24 * 3600 * 1000;
    return data.filter((r) => {
      const iso = getISO(r);
      if (!iso) return false;
      return new Date(iso).getTime() >= since;
    });
  }, [data, range]);

  // meilleur record pour badge
  const best = useMemo(() => {
    return filtered.reduce((m, r) => Math.max(m, r.numberPushUps || 0), 0);
  }, [filtered]);

  // groupage par mois
  const sections = useMemo(() => {
    const map = new Map<string, RecordItem[]>();
    for (const r of filtered) {
      const iso = getISO(r);
      if (!iso) continue;
      const key = monthKey(iso);
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(r);
    }
    return Array.from(map.entries()).map(([title, items]) => ({
      title,
      data: items.sort((a, b) => new Date(getISO(b)).getTime() - new Date(getISO(a)).getTime()),
    }));
  }, [filtered]);

  const stats = useMemo(() => {
    const total = filtered.reduce((s, r) => s + (r.numberPushUps || 0), 0);
    const count = filtered.length;
    return { best, total, count };
  }, [filtered, best]);

  const onDelete = (id: string) => {
    console.log('delete: ', id);
  };

  return (
    <YStack f={1} p="$4" pt={insets.top + 10} gap="$3" animation="quicker">
      {/* Header + filtres */}
      <YStack p="$4" gap="$3">
        <H4>Historique</H4>

        <XStack gap="$2" fw="wrap">
          <Button
            size="$2"
            variant={range === '30' ? 'outlined' : 'ghost'}
            onPress={() => setRange('30')}
          >
            30 j
          </Button>
          <Button
            size="$2"
            variant={range === '90' ? 'outlined' : 'ghost'}
            onPress={() => setRange('90')}
          >
            90 j
          </Button>
          <Button
            size="$2"
            variant={range === 'all' ? 'outlined' : 'ghost'}
            onPress={() => setRange('all')}
          >
            Tout
          </Button>
        </XStack>

        {/* KPIs */}
        <XStack gap="$3" fw="wrap">
          <Card f={1} p="$3" bordered elevate>
            <XStack ai="center" gap="$2">
              <Trophy size={16} />
              <Paragraph>Meilleur</Paragraph>
            </XStack>
            <SizableText size="$8" fow="700">
              {stats.best}
            </SizableText>
          </Card>
          <Card f={1} p="$3" bordered>
            <Paragraph>Séances</Paragraph>
            <SizableText size="$8" fow="700">
              {stats.count}
            </SizableText>
          </Card>
          <Card f={1} p="$3" bordered>
            <Paragraph>Total reps</Paragraph>
            <SizableText size="$8" fow="700">
              {stats.total}
            </SizableText>
          </Card>
        </XStack>
      </YStack>

      <Separator />

      {/* Liste groupée */}
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 16, paddingBottom: 120 }}
        refreshControl={
          <RefreshControl refreshing={isLoading || isRefetching} onRefresh={refetch} />
        }
        renderSectionHeader={({ section: { title } }) => (
          <Paragraph mt="$3" mb="$2">
            {title}
          </Paragraph>
        )}
        renderItem={({ item }) => {
          const iso = getISO(item);
          const isBest = item.numberPushUps === best;
          return (
            <Card bordered p="$3" mb="$2" pressStyle={{ scale: 0.99 }}>
              <XStack ai="center" jc="space-between">
                <XStack ai="center" gap="$3">
                  <SizableText size="$8" fow="700">
                    {item.numberPushUps}
                  </SizableText>
                  <YStack>
                    <Paragraph>
                      {formatInDeviceTZ(iso, { withTime: true, locale: 'fr-FR' })}
                    </Paragraph>
                    {/* si tu stockes un champ note, ajoute-le ici */}
                  </YStack>
                </XStack>
                <XStack ai="center" gap="$2">
                  <Button
                    size="$2"
                    chromeless
                    icon={Trash2}
                    onPress={() => onDelete(item.id)}
                    aria-label="Supprimer"
                  />
                </XStack>
              </XStack>
            </Card>
          );
        }}
        ListEmptyComponent={
          <YStack ai="center" p="$6" gap="$2">
            <Paragraph>Aucun record pour cette période.</Paragraph>
            <Button theme="accent" onPress={() => router.push('/training/MaxTrainingScreen')}>
              Nouveau test
            </Button>
          </YStack>
        }
      />

      {/* FAB */}
      <Button
        pos="absolute"
        bottom="$6"
        right="$6"
        size="$5"
        circular
        elevate
        theme="accent"
        icon={Plus}
        onPress={() => router.push('/training/MaxTrainingScreen')}
        aria-label="Nouveau test"
      />
    </YStack>
  );
}
