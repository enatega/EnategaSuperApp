import React, { useMemo, useRef, useState } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderGestureState,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';

type Props = {
  value: number;
  title?: string;
  subtitle?: string;
  width?: number;
  height?: number;
  initiallyFlipped?: boolean;
};

const FLIP_ANGLE = 180;
const DRAG_DISTANCE_FOR_FULL_FLIP = 180;

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function FlipNumberCard({
  value,
  title = 'Lucky Card',
  subtitle = 'Tap or drag sideways',
  width = 176,
  height = 244,
  initiallyFlipped = false,
}: Props) {
  const { colors } = useTheme();
  const initialValue = initiallyFlipped ? FLIP_ANGLE : 0;
  const rotate = useRef(new Animated.Value(initialValue)).current;
  const [isFlipped, setIsFlipped] = useState(initiallyFlipped);
  const dragStart = useRef(initialValue);

  const frontRotate = rotate.interpolate({
    inputRange: [0, FLIP_ANGLE],
    outputRange: ['0deg', '180deg'],
  });

  const backRotate = rotate.interpolate({
    inputRange: [0, FLIP_ANGLE],
    outputRange: ['180deg', '360deg'],
  });

  const animateTo = (nextFlipped: boolean) => {
    const toValue = nextFlipped ? FLIP_ANGLE : 0;
    setIsFlipped(nextFlipped);
    Animated.timing(rotate, {
      toValue,
      duration: 280,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  };

  const handleRelease = (gesture: PanResponderGestureState) => {
    const travelled = Math.abs(gesture.dx);
    const isTap = travelled < 8 && Math.abs(gesture.dy) < 8 && Math.abs(gesture.vx) < 0.15;

    if (isTap) {
      animateTo(!isFlipped);
      return;
    }

    const projected = clamp(
      dragStart.current + ((gesture.dx / DRAG_DISTANCE_FOR_FULL_FLIP) * FLIP_ANGLE),
      0,
      FLIP_ANGLE,
    );
    const shouldFlip =
      projected >= FLIP_ANGLE / 2
      || gesture.vx > 0.45
      || (isFlipped && gesture.vx > -0.2);

    animateTo(shouldFlip);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) =>
          Math.abs(gesture.dx) > 4 || Math.abs(gesture.dy) > 4,
        onPanResponderGrant: () => {
          rotate.stopAnimation((current) => {
            dragStart.current = current;
          });
        },
        onPanResponderMove: (_evt, gesture) => {
          const next = clamp(
            dragStart.current + ((gesture.dx / DRAG_DISTANCE_FOR_FULL_FLIP) * FLIP_ANGLE),
            0,
            FLIP_ANGLE,
          );
          rotate.setValue(next);
        },
        onPanResponderRelease: (_evt, gesture) => {
          handleRelease(gesture);
        },
        onPanResponderTerminate: (_evt, gesture) => {
          handleRelease(gesture);
        },
      }),
    [isFlipped, rotate],
  );

  return (
    <View style={styles.wrapper}>
      <Pressable onPress={() => animateTo(!isFlipped)}>
        <Animated.View
          {...panResponder.panHandlers}
          style={[
            styles.cardFrame,
            {
              width,
              height,
            },
          ]}
        >
          <Animated.View
            style={[
              styles.cardFace,
              styles.frontFace,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
                transform: [{ perspective: 1000 }, { rotateY: frontRotate }],
              },
            ]}
          >
            <View style={styles.cornerBlock}>
              <Text variant="caption" weight="semiBold" style={[styles.cornerSuit, { color: colors.primary }]}>
                A
              </Text>
              <Text weight="bold" style={[styles.cornerPip, { color: colors.primary }]}>
                ♠
              </Text>
            </View>
            <View style={styles.centerBlock}>
              <Text variant="subtitle" weight="bold" style={[styles.title, { color: colors.text }]}>
                {title}
              </Text>
              <Text variant="caption" color={colors.mutedText} style={styles.subtitle}>
                {subtitle}
              </Text>
              <Text style={[styles.hint, { color: colors.primaryDark }]}>
                Reveal number
              </Text>
            </View>
            <View style={[styles.cornerBlock, styles.cornerBlockBottom]}>
              <Text variant="caption" weight="semiBold" style={[styles.cornerSuit, { color: colors.primary }]}>
                A
              </Text>
              <Text weight="bold" style={[styles.cornerPip, { color: colors.primary }]}>
                ♠
              </Text>
            </View>
          </Animated.View>

          <Animated.View
            pointerEvents="none"
            style={[
              styles.cardFace,
              styles.backFace,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.shadowColor,
                transform: [{ perspective: 1000 }, { rotateY: backRotate }],
              },
            ]}
          >
            <View style={[styles.backPattern, { borderColor: 'rgba(255,255,255,0.22)' }]}>
              <View style={[styles.numberPlate, { backgroundColor: colors.white }]}>
                <Text style={[styles.revealedValue, { color: colors.primaryDark }]}>
                  {value}
                </Text>
              </View>
              <Text variant="caption" weight="semiBold" style={[styles.backLabel, { color: colors.white }]}>
                Hidden Fare
              </Text>
            </View>
          </Animated.View>
        </Animated.View>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    alignItems: 'center',
  },
  cardFrame: {
    position: 'relative',
  },
  cardFace: {
    position: 'absolute',
    top: 0,
    right: 0,
    bottom: 0,
    left: 0,
    borderRadius: 24,
    backfaceVisibility: 'hidden',
    overflow: 'hidden',
    justifyContent: 'space-between',
    paddingHorizontal: 18,
    paddingVertical: 16,
    shadowOpacity: 0.14,
    shadowRadius: 16,
    shadowOffset: {
      width: 0,
      height: 8,
    },
    elevation: 8,
  },
  frontFace: {
    borderWidth: 1,
  },
  backFace: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  cornerBlock: {
    alignItems: 'flex-start',
  },
  cornerBlockBottom: {
    alignItems: 'flex-end',
    transform: [{ rotate: '180deg' }],
  },
  cornerSuit: {
    letterSpacing: 1.2,
  },
  cornerPip: {
    fontSize: 22,
    lineHeight: 24,
  },
  centerBlock: {
    alignItems: 'center',
    gap: 8,
  },
  title: {
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
  },
  hint: {
    fontSize: 14,
    lineHeight: 18,
  },
  backPattern: {
    width: '100%',
    height: '100%',
    borderRadius: 20,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
    padding: 16,
  },
  numberPlate: {
    minWidth: 96,
    paddingHorizontal: 20,
    paddingVertical: 18,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  revealedValue: {
    fontSize: 44,
    lineHeight: 48,
    fontWeight: '800',
  },
  backLabel: {
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
});
