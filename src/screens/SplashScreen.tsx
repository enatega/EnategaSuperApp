import React, { useEffect, useRef } from 'react';
import { Animated, Easing, Image, StyleSheet, View } from 'react-native';

type Props = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const redOverlayOpacity = useRef(new Animated.Value(1)).current;
  const totalDurationMs = 1400;
  const redToWhiteDelayMs = 450;
  const redToWhiteDurationMs = 650;

  useEffect(() => {
    const animation = Animated.sequence([
      Animated.delay(redToWhiteDelayMs),
      Animated.timing(redOverlayOpacity, {
        toValue: 0,
        duration: redToWhiteDurationMs,
        easing: Easing.inOut(Easing.cubic),
        useNativeDriver: true,
      }),
    ]);

    const timer = setTimeout(() => {
      onFinish?.();
    }, totalDurationMs);

    animation.start();

    return () => {
      animation.stop();
      clearTimeout(timer);
    };
  }, [
    onFinish,
    redOverlayOpacity,
    redToWhiteDelayMs,
    redToWhiteDurationMs,
    totalDurationMs,
  ]);

  return (
    <View style={styles.container}>
      <View style={styles.whiteLayer} />
      <Animated.View
        pointerEvents="none"
        style={[styles.redLayer, { opacity: redOverlayOpacity }]}
      />

      <View style={styles.centerContent}>
        <Image
          source={require('../../assets/splash-icon.png')}
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  whiteLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#FFFFFF',
  },
  redLayer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#D7262E',
  },
  centerContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logo: {
    width: 180,
    height: 180,
  },
});
