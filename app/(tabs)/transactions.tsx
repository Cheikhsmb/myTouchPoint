import { Monicon } from '@monicon/native';
import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Transaction = {
  id: string;
  date: string; // ISO date string
  title: string;
  amount: number; // positive for credit, negative for debit
  channel: 'Wave' | 'Orange Money' | 'Card' | 'Cash';
  status: 'success' | 'pending' | 'failed';
};

const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX-9823', date: '2025-01-05T09:42:00Z', title: 'Send money to Awa', amount: -25000, channel: 'Wave', status: 'success' },
  { id: 'TX-9822', date: '2025-01-03T18:22:00Z', title: 'Airtime Orange', amount: -2000, channel: 'Orange Money', status: 'success' },
  { id: 'TX-9819', date: '2024-12-29T13:10:00Z', title: 'Payment - Boutique', amount: -12500, channel: 'Card', status: 'pending' },
  { id: 'TX-9818', date: '2024-12-28T08:31:00Z', title: 'Refund - Store', amount: 5000, channel: 'Card', status: 'success' },
  { id: 'TX-9815', date: '2024-12-20T15:00:00Z', title: 'Cash-in', amount: 100000, channel: 'Cash', status: 'success' },
];

export default function TransactionsScreen() {
  const [query, setQuery] = useState('');
  const router = useRouter();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return MOCK_TRANSACTIONS;
    return MOCK_TRANSACTIONS.filter(t =>
      t.title.toLowerCase().includes(q) ||
      t.id.toLowerCase().includes(q) ||
      t.channel.toLowerCase().includes(q)
    );
  }, [query]);

  const renderItem = ({ item }: { item: Transaction }) => {
    const isCredit = item.amount > 0;
    return (
      <View style={styles.row}>
        <View style={styles.rowLeft}>
          <View style={[styles.avatar, { backgroundColor: isCredit ? '#E8F5E9' : '#E3F2FD' }]}>
            <Monicon name={isCredit ? 'mdi:arrow-down-bold' : 'mdi:arrow-up-bold'} size={18} color={isCredit ? '#2E7D32' : '#1565C0'} />
          </View>
          <View style={styles.rowText}>
            <Text style={styles.rowTitle}>{item.title}</Text>
            <Text style={styles.rowSub}>
              {new Date(item.date).toLocaleDateString()} • {item.channel} • {item.id}
            </Text>
          </View>
        </View>
        <View style={styles.rowRight}>
          <Text style={[styles.amount, { color: isCredit ? '#2E7D32' : '#C62828' }]}>
            {isCredit ? '+' : '-'} {Math.abs(item.amount).toLocaleString()} CFA
          </Text>
          <View style={[styles.badge, item.status === 'success' ? styles.badgeSuccess : item.status === 'pending' ? styles.badgePending : styles.badgeFailed]}>
            <Text style={styles.badgeText}>{item.status}</Text>
          </View>
        </View>
      </View>
    );
  };

  const handleBack = () => {
    if (router.canGoBack()) router.back(); else router.push('/');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <View style={styles.headerLeftRow}>
          <TouchableOpacity onPress={handleBack} accessibilityRole="button" accessibilityLabel="Go back" style={{ paddingRight: 6 }}>
            <Monicon name="mdi:arrow-left" size={22} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Transactions</Text>
        </View>
        <View style={{ width: 22 }} />
      </View>

      <View style={styles.searchBar}>
        <Monicon name="mdi:magnify" size={20} color="#666" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name, ID, channel..."
          placeholderTextColor="#999"
          value={query}
          onChangeText={setQuery}
          returnKeyType="search"
        />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <View style={styles.emptyIconWrap}>
              <Monicon name="mdi:history" size={36} color="#9AA0A6" />
            </View>
            <Text style={styles.emptyTitle}>No transactions yet</Text>
            <Text style={styles.emptySub}>Your activity will show up here.</Text>
          </View>
        )}
      />
      <TouchableOpacity style={styles.fab} activeOpacity={0.85}>
        <Monicon name="mdi:filter-variant" size={22} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  header: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    backgroundColor: '#00008B',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '600',
  },
  headerLeftRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  searchBar: {
    margin: 16,
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    paddingHorizontal: 12,
    height: 46,
    flexDirection: 'row',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  listContent: {
    paddingHorizontal: 12,
    paddingBottom: 24,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 80,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F3F4',
    marginBottom: 12,
  },
  emptyTitle: {
    color: '#3C4043',
    fontWeight: '700',
    marginBottom: 4,
  },
  emptySub: {
    color: '#8A8F94',
  },
  row: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 10,
  },
  rowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  rowText: {
    flex: 1,
  },
  rowTitle: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
  },
  rowSub: {
    marginTop: 2,
    color: '#666',
    fontSize: 12,
  },
  rowRight: {
    alignItems: 'flex-end',
  },
  amount: {
    fontSize: 14,
    fontWeight: '700',
  },
  badge: {
    marginTop: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    color: '#fff',
    fontSize: 11,
    textTransform: 'capitalize',
  },
  badgeSuccess: {
    backgroundColor: '#2E7D32',
  },
  badgePending: {
    backgroundColor: '#F9A825',
  },
  badgeFailed: {
    backgroundColor: '#C62828',
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#00008B',
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
    boxShadow: '0px 2px 6px rgba(0,0,0,0.2)',
  },
});


