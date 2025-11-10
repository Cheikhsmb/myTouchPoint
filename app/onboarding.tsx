import { useEffect } from 'react';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

export default function OnboardingScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Mark onboarding as completed
      AsyncStorage.setItem('@viewedOnboarding', 'true');
      // Navigate to the main app
      router.replace('/(tabs)');
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.logoContainer}>
        <Image 
          source={require('../assets/images/myTouchPointLogo1.png')} 
          style={styles.logo} 
          resizeMode="contain"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.7,
    height: width * 0.7,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  }
});

