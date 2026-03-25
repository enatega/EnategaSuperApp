import React, { memo, useEffect, useRef } from 'react';
import {
  Animated,
  Easing,
  StyleSheet,
  View,
} from 'react-native';
import { useTheme } from '../theme/theme';

type Props = {
  size?: number;
};

function FindingRideAnimation({ size = 240 }: Props) {
  const { colors } = useTheme();
  const pulseA = useRef(new Animated.Value(0)).current;
  const pulseB = useRef(new Animated.Value(0)).current;
  const pulseC = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const createPulse = (animatedValue: Animated.Value, delay: number) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animatedValue, {
            toValue: 1,
            duration: 2200,
            easing: Easing.out(Easing.cubic),
            useNativeDriver: true,
          }),
          Animated.timing(animatedValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ]),
      );

    const animation = Animated.parallel([
      createPulse(pulseA, 0),
      createPulse(pulseB, 520),
      createPulse(pulseC, 1040),
    ]);

    animation.start();

    return () => animation.stop();
  }, [pulseA, pulseB, pulseC]);

  const renderPulse = (animatedValue: Animated.Value, tint: string) => (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.pulse,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: tint,
          opacity: animatedValue.interpolate({
            inputRange: [0, 0.65, 1],
            outputRange: [0, 0.22, 0],
          }),
          transform: [
            {
              scale: animatedValue.interpolate({
                inputRange: [0, 1],
                outputRange: [0.42, 1],
              }),
            },
          ],
        },
      ]}
    />
  );

  return (
    <View style={[styles.container, { width: size, height: size }]}>
      {renderPulse(pulseA, colors.findingRidePulseA)}
      {renderPulse(pulseB, colors.findingRidePulseB)}
      {renderPulse(pulseC, colors.findingRidePulseC)}

      <View style={styles.centerWrap}>
        <View
          style={[
            styles.centerHalo,
            { backgroundColor: colors.findingRideCenterHalo },
          ]}
        />
        <View
          style={[
            styles.centerCore,
            {
              backgroundColor: colors.findingRidePrimary,
              shadowColor: colors.findingRidePrimary,
            },
          ]}
        >
          <View style={[styles.centerDot, { backgroundColor: colors.white }]} />
        </View>
      </View>
    </View>
  );
}

export default memo(FindingRideAnimation);

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  pulse: {
    position: 'absolute',
  },
  centerWrap: {
    width: 108,
    height: 108,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerHalo: {
    position: 'absolute',
    width: 92,
    height: 92,
    borderRadius: 46,
  },
  centerCore: {
    width: 58,
    height: 58,
    borderRadius: 29,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.28,
    shadowRadius: 18,
    shadowOffset: { width: 0, height: 10 },
    elevation: 10,
  },
  centerDot: {
    width: 18,
    height: 18,
    borderRadius: 9,
  },
});
