import React, { memo, useEffect, useRef } from 'react';
import { Animated, Easing, StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useTheme } from '../theme/theme';

type Props = {
  width: number;
  height?: number;
  indicatorWidth?: number;
  trackColor?: string;
  colors?: [string, string, string];
};

function AnimatedSweepBar({
  width,
  height = 3,
  indicatorWidth,
  trackColor,
  colors,
}: Props) {
  const { colors: themeColors } = useTheme();
  const sweep = useRef(new Animated.Value(0)).current;
  const resolvedIndicatorWidth = indicatorWidth ?? Math.min(118, width * 0.3);
  const resolvedTrackColor = trackColor ?? themeColors.findingRideSweepTrack;
  const resolvedGradientColors = colors ?? [
    themeColors.findingRideSweepEdge,
    themeColors.findingRideSweepCenter,
    themeColors.findingRideSweepEdge,
  ];

  useEffect(() => {
    const animation = Animated.loop(
      Animated.sequence([
        Animated.timing(sweep, {
          toValue: 1,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
        Animated.timing(sweep, {
          toValue: 0,
          duration: 1300,
          easing: Easing.inOut(Easing.ease),
          useNativeDriver: true,
        }),
      ]),
    );

    animation.start();

    return () => animation.stop();
  }, [sweep]);

  const translateX = sweep.interpolate({
    inputRange: [0, 1],
    outputRange: [0, Math.max(width - resolvedIndicatorWidth, 0)],
  });

  return (
    <View
      style={[
        styles.track,
        {
          width,
          height,
          borderRadius: height / 2,
          backgroundColor: resolvedTrackColor,
        },
      ]}
    >
      <Animated.View
        style={[
          styles.indicatorWrap,
          {
            width: resolvedIndicatorWidth,
            transform: [{ translateX }],
          },
        ]}
      >
        <LinearGradient
          colors={resolvedGradientColors}
          start={{ x: 0, y: 0.5 }}
          end={{ x: 1, y: 0.5 }}
          style={[
            styles.indicator,
            {
              height,
              borderRadius: height / 2,
              shadowColor: themeColors.findingRideSweepCenter,
            },
          ]}
        />
      </Animated.View>
    </View>
  );
}

export default memo(AnimatedSweepBar);

const styles = StyleSheet.create({
  track: {
    overflow: 'hidden',
  },
  indicatorWrap: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
  },
  indicator: {
    width: '100%',
    shadowOpacity: 0.2,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
  },
});
