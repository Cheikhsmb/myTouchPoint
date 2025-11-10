import AsyncStorage from '@react-native-async-storage/async-storage';
import { useRouter } from 'expo-router';
import { useEffect, useRef } from 'react';
import { Image, StatusBar, StyleSheet, Text, View } from 'react-native';
import Animated, {
    Easing,
    useAnimatedStyle,
    useSharedValue,
    withTiming,
} from 'react-native-reanimated';

const SPLASH_DURATION = 2400;
const LOGO = require('../assets/images/myTouchPointLogo1.png');

export default function SplashScreen() {
  const router = useRouter();
  const scale = useSharedValue(0.8);
  const opacity = useSharedValue(0);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    opacity.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.ease) });
    scale.value = withTiming(1, { duration: 900, easing: Easing.out(Easing.back(1.2)) });

    timeoutRef.current = setTimeout(async () => {
      try {
        const hasSeen = await AsyncStorage.getItem('hasSeenOnboarding');
        if (hasSeen === 'true') {
          router.replace('/(tabs)');
        } else {
          router.replace('/onboarding');
        }
      } catch (error) {
        router.replace('/onboarding');
      }
    }, SPLASH_DURATION);

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, [opacity, router, scale]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <Animated.View style={[styles.logoContainer, animatedStyle]}>
        <View style={styles.glow} />
        <Image source={LOGO} style={styles.logo} resizeMode="contain" />
        <Text style={styles.title}>MyTouchPoint</Text>
        <Text style={styles.subtitle}>Connecting Africa through secure payments</Text>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#061317',
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  glow: {
    position: 'absolute',
    width: 260,
    height: 260,
    borderRadius: 130,
    backgroundColor: 'rgba(255, 140, 0, 0.25)',
    transform: [{ scale: 1.1 }],
  },
  logo: {
    width: 180,
    height: 180,
  },
  title: {
    marginTop: 16,
    fontSize: 28,
    fontWeight: '700',
    color: '#F4F4F2',
    letterSpacing: 1.2,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 16,
    color: '#D0DEE0',
    textAlign: 'center',
    maxWidth: 280,
  },
});

