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

type BottomSheetState = 'expanded' | 'default' | 'collapsed';

type Props = {
  children: ReactNode;
  expandedHeight: number;
  defaultHeight?: number;
  collapsedHeight: number;
  initialState?: BottomSheetState;
  style?: StyleProp<ViewStyle>;
  onStateChange?: (state: BottomSheetState) => void;
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

function getNearestSnapPoint(
  offset: number,
  snapPoints: Array<{ state: BottomSheetState; offset: number }>,
) {
  return snapPoints.reduce((nearestPoint, point) => (
    Math.abs(point.offset - offset) < Math.abs(nearestPoint.offset - offset)
      ? point
      : nearestPoint
  ));
}

export default function SwipeableBottomSheet({
  children,
  expandedHeight,
  defaultHeight,
  collapsedHeight,
  initialState = defaultHeight ? 'default' : 'expanded',
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
  const defaultOffset = useMemo(() => {
    if (typeof defaultHeight !== 'number') {
      return undefined;
    }

    const normalizedDefaultHeight = clamp(defaultHeight, collapsedHeight, expandedHeight);
    return Math.max(expandedHeight - normalizedDefaultHeight, 0);
  }, [collapsedHeight, defaultHeight, expandedHeight]);
  const snapPoints = useMemo<Array<{ state: BottomSheetState; offset: number }>>(() => {
    const points: Array<{ state: BottomSheetState; offset: number }> = [
      { state: 'expanded', offset: 0 },
    ];

    if (typeof defaultOffset === 'number' && defaultOffset > 0 && defaultOffset < collapsedOffset) {
      points.push({ state: 'default', offset: defaultOffset });
    }

    points.push({ state: 'collapsed', offset: collapsedOffset });
    return points;
  }, [collapsedOffset, defaultOffset]);
  const resolvedInitialState = useMemo<BottomSheetState>(() => {
    if (initialState === 'default' && typeof defaultOffset !== 'number') {
      return 'expanded';
    }

    return initialState;
  }, [defaultOffset, initialState]);
  const getOffsetForState = useMemo(
    () => (state: BottomSheetState) => snapPoints.find((point) => point.state === state)?.offset ?? 0,
    [snapPoints],
  );
  const initialOffset = getOffsetForState(resolvedInitialState);
  const shouldAnimateOnMount = modal && initialOffset < collapsedOffset;

  const translateY = useRef(
    new Animated.Value(
      shouldAnimateOnMount
        ? collapsedOffset
        : initialOffset,
    ),
  ).current;
  const startY = useRef(
    shouldAnimateOnMount
      ? collapsedOffset
      : initialOffset,
  );
  const isDragging = useRef(false);
  const currentState = useRef<BottomSheetState>(resolvedInitialState);
  const hasPresented = useRef(!shouldAnimateOnMount);

  useEffect(() => {
    currentState.current = resolvedInitialState;
  }, [resolvedInitialState]);

  useEffect(() => {
    if (isDragging.current) return;

    const target = getOffsetForState(currentState.current);

    if (!hasPresented.current) {
      translateY.setValue(collapsedOffset);
      Animated.timing(translateY, {
        toValue: target,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start(() => {
        startY.current = target;
        hasPresented.current = true;
        onStateChange?.(currentState.current);
      });
      return;
    }

    startY.current = target;
    translateY.setValue(target);
  }, [collapsedOffset, getOffsetForState, onStateChange, translateY]);

  const animateTo = (state: BottomSheetState) => {
    const targetOffset = getOffsetForState(state);
    currentState.current = state;
    onStateChange?.(state);
    Animated.spring(translateY, {
      toValue: targetOffset,
      useNativeDriver: true,
      tension: 180,
      friction: 24,
    }).start(() => {
      startY.current = targetOffset;
      if (state === 'collapsed') {
        onCollapsed?.();
      }
    });
  };

  const handleRelease = (_: unknown, gesture: PanResponderGestureState) => {
    const currentOffset = clamp(startY.current + gesture.dy, 0, collapsedOffset);

    if (gesture.vy > 0.5) {
      const nextPoint = snapPoints.find((point) => point.offset > currentOffset + 1);
      animateTo(nextPoint?.state ?? 'collapsed');
      return;
    }

    if (gesture.vy < -0.5) {
      const previousPoints = snapPoints.filter((point) => point.offset < currentOffset - 1);
      const previousPoint = previousPoints[previousPoints.length - 1];
      animateTo(previousPoint?.state ?? 'expanded');
      return;
    }

    animateTo(getNearestSnapPoint(currentOffset, snapPoints).state);
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
    [collapsedOffset, snapPoints, translateY],
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
