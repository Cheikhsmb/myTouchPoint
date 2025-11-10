import { useRouter } from 'expo-router';
import { useState } from 'react';
import {
    KeyboardAvoidingView,
    Platform,
    Pressable,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from 'react-native';

export default function RegistrationScreen() {
  const router = useRouter();
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [pin, setPin] = useState('');

  const handleContinue = () => {
    router.replace('/(tabs)');
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <StatusBar barStyle="light-content" />
      <ScrollView
        contentContainerStyle={styles.content}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text style={styles.heading}>Create your MyTouchPoint wallet</Text>
        <Text style={styles.subheading}>
          Get ready to experience fast, secure African payments tailored to you.
        </Text>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Full name</Text>
          <TextInput
            value={fullName}
            onChangeText={setFullName}
            style={styles.input}
            placeholder="Amina Diallo"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            value={email}
            onChangeText={setEmail}
            style={styles.input}
            placeholder="amina@mytouchpoint.africa"
            keyboardType="email-address"
            autoCapitalize="none"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Mobile number</Text>
          <TextInput
            value={phone}
            onChangeText={setPhone}
            style={styles.input}
            placeholder="+221 77 000 00 00"
            keyboardType="phone-pad"
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </View>

        <View style={styles.formGroup}>
          <Text style={styles.label}>Create a 4-digit PIN</Text>
          <TextInput
            value={pin}
            onChangeText={setPin}
            style={styles.input}
            placeholder="••••"
            keyboardType="number-pad"
            maxLength={4}
            secureTextEntry
            placeholderTextColor="rgba(255,255,255,0.4)"
          />
        </View>

        <Pressable style={styles.primaryButton} onPress={handleContinue} accessibilityRole="button">
          <Text style={styles.primaryButtonText}>Finish setup</Text>
        </Pressable>

        <Pressable onPress={() => router.replace('/(tabs)')} style={styles.secondaryButton}>
          <Text style={styles.secondaryButtonText}>Maybe later</Text>
        </Pressable>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#051419',
  },
  content: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 48,
  },
  heading: {
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F2',
    marginBottom: 12,
  },
  subheading: {
    fontSize: 16,
    lineHeight: 24,
    color: '#D0DEE0',
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.7)',
    marginBottom: 8,
  },
  input: {
    height: 52,
    borderRadius: 16,
    paddingHorizontal: 16,
    backgroundColor: 'rgba(22, 46, 56, 0.8)',
    color: '#FFFFFF',
    fontSize: 16,
  },
  primaryButton: {
    marginTop: 16,
    backgroundColor: '#F7931A',
    borderRadius: 26,
    paddingVertical: 16,
    alignItems: 'center',
  },
  primaryButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#051419',
    letterSpacing: 0.4,
  },
  secondaryButton: {
    marginTop: 20,
    paddingVertical: 14,
    alignItems: 'center',
  },
  secondaryButtonText: {
    fontSize: 15,
    color: '#B7C7CC',
    fontWeight: '600',
  },
});



