import React, { ReactNode, useMemo, useRef, useEffect } from 'react';
import {
  Animated,
  Easing,
  PanResponder,
  PanResponderGestureState,
  StyleProp,
  StyleSheet,
  ViewStyle,
  View,
} from 'react-native';

type Props = {
  children: ReactNode;
  expandedHeight: number;
  collapsedHeight: number;
  initialState?: 'expanded' | 'collapsed';
  style?: StyleProp<ViewStyle>;
  onStateChange?: (state: 'expanded' | 'collapsed') => void;
  handle?: ReactNode;
  handleContainerStyle?: StyleProp<ViewStyle>;
  floatingAccessory?: ReactNode;
  floatingAccessoryStyle?: StyleProp<ViewStyle>;
  onCollapsed?: () => void;
  modal?: boolean;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

export default function SwipeableBottomSheet({
  children,
  expandedHeight,
  collapsedHeight,
  initialState = 'expanded',
  style,
  onStateChange,
  handle,
  handleContainerStyle,
  floatingAccessory,
  floatingAccessoryStyle,
  onCollapsed,
  modal = false,
}: Props) {
  const collapsedOffset = useMemo(
    () => Math.max(expandedHeight - collapsedHeight, 0),
    [expandedHeight, collapsedHeight],
  );
  const shouldAnimateOnMount = modal && initialState === 'expanded';

  const translateY = useRef(
    new Animated.Value(
      initialState === 'collapsed'
        ? collapsedOffset
        : shouldAnimateOnMount
          ? collapsedOffset
          : 0,
    ),
  ).current;
  const startY = useRef(
    initialState === 'collapsed'
      ? collapsedOffset
      : shouldAnimateOnMount
        ? collapsedOffset
        : 0,
  );
  const isDragging = useRef(false);
  const currentState = useRef<'expanded' | 'collapsed'>(initialState);
  const hasPresented = useRef(!shouldAnimateOnMount);

  useEffect(() => {
    if (isDragging.current) return;

    const target = currentState.current === 'collapsed' ? collapsedOffset : 0;

    if (!hasPresented.current && currentState.current === 'expanded') {
      translateY.setValue(collapsedOffset);
      Animated.timing(translateY, {
        toValue: 0,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        startY.current = 0;
        hasPresented.current = true;
        onStateChange?.('expanded');
      });
      return;
    }

    startY.current = target;
    translateY.setValue(target);
  }, [collapsedOffset, onStateChange, translateY]);

  const animateTo = (state: 'expanded' | 'collapsed') => {
    currentState.current = state;
    onStateChange?.(state);
    Animated.spring(translateY, {
      toValue: state === 'collapsed' ? collapsedOffset : 0,
      useNativeDriver: true,
      tension: 180,
      friction: 24,
    }).start(() => {
      startY.current = state === 'collapsed' ? collapsedOffset : 0;
      if (state === 'collapsed') {
        onCollapsed?.();
      }
    });
  };

  const handleRelease = (_: unknown, gesture: PanResponderGestureState) => {
    const shouldCollapse =
      gesture.vy > 0.5 ||
      (gesture.vy >= 0 && gesture.dy > collapsedOffset / 2);

    if (shouldCollapse) {
      animateTo('collapsed');
    } else {
      animateTo('expanded');
    }
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) =>
          Math.abs(gesture.dy) > 6,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          isDragging.current = true;
          translateY.stopAnimation((value) => {
            startY.current = value;
          });
        },
        onPanResponderMove: (_evt, gesture) => {
          const next = clamp(startY.current + gesture.dy, 0, collapsedOffset);
          translateY.setValue(next);
        },
        onPanResponderRelease: (evt, gesture) => {
          isDragging.current = false;
          handleRelease(evt, gesture);
        },
        onPanResponderTerminate: (evt, gesture) => {
          isDragging.current = false;
          handleRelease(evt, gesture);
        },
      }),
    [collapsedOffset, translateY],
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: expandedHeight,
          transform: [{ translateY }],
        },
        style,
      ]}
    >
      {floatingAccessory ? (
        <View style={[styles.floatingAccessory, floatingAccessoryStyle]}>
          {floatingAccessory}
        </View>
      ) : null}
      {handle ? (
        <View style={handleContainerStyle} {...panResponder.panHandlers}>
          {handle}
        </View>
      ) : null}
      {children}
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
  },
  floatingAccessory: {
    position: 'absolute',
  },
});
