import { Monicon } from '@monicon/native';
import { useRouter } from 'expo-router';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function CustomerServiceScreen() {
  const router = useRouter();
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}> 
        <TouchableOpacity activeOpacity={0.8} onPress={() => router.canGoBack() ? router.back() : null}>
          <Monicon name="mdi:arrow-left" size={22} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Service client</Text>
        <View style={{ width: 22 }} />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 24 }}>
        <View style={styles.section}> 
          <Text style={styles.sectionTitle}>Contact us through :</Text>

          <View style={styles.contactRow}>
            <ContactItem iconName="mdi:whatsapp" label="Whatsapp" color="#25D366" />
            <ContactItem iconName="mdi:phone" label="Call" color="#12D43A" />
            <ContactItem iconName="mdi:email" label="E-mail" color="#3BA9FF" />
            <ContactItem iconName="mdi:message-text" label="SMS" color="#1AD65B" />
          </View>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.or}>OR</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.myTicketsRow}>
            <Text style={styles.myTickets}>My tickets</Text>
            <TouchableOpacity style={styles.newClaimBtn} activeOpacity={0.9}>
              <Monicon name="mdi:plus" size={18} color="#fff" />
              <Text style={styles.newClaimText}>New Claim</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.filtersRow}>
            <View style={styles.inputBox}>
              <Monicon name="mdi:magnify" size={18} color="#666" />
              <TextInput
                style={styles.input}
                placeholder="Search ..."
                placeholderTextColor="#999"
              />
            </View>
            <View style={styles.inputBox}>
              <Monicon name="mdi:calendar" size={18} color="#666" />
              <Text style={styles.inputPlaceholder}>Jan 05, ...</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function ContactItem({ iconName, label, color }: { iconName: string; label: string; color: string }) {
  return (
    <View style={styles.contactItem}>
      <View style={[styles.contactIconWrap, { backgroundColor: '#fff', borderColor: '#E6E6E6' }]}> 
        <Monicon name={iconName} size={28} color={color} />
      </View>
      <Text style={styles.contactLabel}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    backgroundColor: '#1B2A6B',
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerTitle: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 15,
    color: '#111',
    fontWeight: '600',
    marginBottom: 12,
  },
  contactRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  contactItem: {
    alignItems: 'center',
    width: '23%',
  },
  contactIconWrap: {
    width: 58,
    height: 58,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    marginBottom: 6,
  },
  contactLabel: {
    fontSize: 12,
    color: '#333',
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
    marginBottom: 8,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: '#E5E5EA',
  },
  or: {
    marginHorizontal: 16,
    color: '#999',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  myTicketsRow: {
    marginTop: 8,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  myTickets: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1A1A1A',
  },
  newClaimBtn: {
    backgroundColor: '#B31942',
    paddingHorizontal: 16,
    height: 44,
    borderRadius: 10,
    flexDirection: 'row',
    alignItems: 'center',
    boxShadow: '0px 2px 4px rgba(0,0,0,0.15)',
  },
  newClaimText: {
    marginLeft: 8,
    color: '#fff',
    fontWeight: '700',
  },
  filtersRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8F8F8',
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 48,
    width: '48%',
  },
  input: {
    flex: 1,
    marginLeft: 8,
    color: '#333',
  },
  inputPlaceholder: {
    marginLeft: 8,
    color: '#999',
  },
});


