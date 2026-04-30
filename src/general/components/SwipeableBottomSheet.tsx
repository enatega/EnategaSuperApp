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
  handleGestureInset?: number;
  floatingAccessory?: ReactNode;
  floatingAccessoryStyle?: StyleProp<ViewStyle>;
  onCollapsed?: () => void;
  modal?: boolean;
  enablePanGesture?: boolean;
  onHeightChange?: (height: number) => void;
};

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getNearestSnapPoint(
  value: number,
  snapPoints: Array<{ state: BottomSheetState; height: number }>,
) {
  return snapPoints.reduce((nearestPoint, point) => (
    Math.abs(point.height - value) < Math.abs(nearestPoint.height - value)
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
  handleGestureInset = 24,
  floatingAccessory,
  floatingAccessoryStyle,
  onCollapsed,
  modal = false,
  enablePanGesture = true,
  onHeightChange,
}: Props) {
  const normalizedCollapsedHeight = useMemo(
    () => clamp(collapsedHeight, 0, expandedHeight),
    [collapsedHeight, expandedHeight],
  );
  const normalizedDefaultHeight = useMemo(() => {
    if (typeof defaultHeight !== 'number') {
      return undefined;
    }

    return clamp(defaultHeight, normalizedCollapsedHeight, expandedHeight);
  }, [defaultHeight, expandedHeight, normalizedCollapsedHeight]);
  const snapPoints = useMemo<Array<{ state: BottomSheetState; height: number }>>(() => {
    const points: Array<{ state: BottomSheetState; height: number }> = [
      { state: 'expanded', height: expandedHeight },
    ];

    if (
      typeof normalizedDefaultHeight === 'number'
      && normalizedDefaultHeight > normalizedCollapsedHeight
      && normalizedDefaultHeight < expandedHeight
    ) {
      points.push({ state: 'default', height: normalizedDefaultHeight });
    }

    points.push({ state: 'collapsed', height: normalizedCollapsedHeight });

    points.sort((a, b) => b.height - a.height);
    return points;
  }, [expandedHeight, normalizedCollapsedHeight, normalizedDefaultHeight]);
  const resolvedInitialState = useMemo<BottomSheetState>(() => {
    if (initialState === 'default' && typeof normalizedDefaultHeight !== 'number') {
      return 'expanded';
    }

    return initialState;
  }, [initialState, normalizedDefaultHeight]);
  const getHeightForState = useMemo(
    () => (state: BottomSheetState) => (
      snapPoints.find((point) => point.state === state)?.height ?? expandedHeight
    ),
    [snapPoints],
  );
  const initialHeight = getHeightForState(resolvedInitialState);
  const shouldAnimateOnMount = modal && initialHeight > normalizedCollapsedHeight;

  const animatedHeight = useRef(
    new Animated.Value(
      shouldAnimateOnMount
        ? normalizedCollapsedHeight
        : initialHeight,
    ),
  ).current;
  const startHeight = useRef(
    shouldAnimateOnMount
      ? normalizedCollapsedHeight
      : initialHeight,
  );
  const isDragging = useRef(false);
  const currentState = useRef<BottomSheetState>(resolvedInitialState);
  const hasPresented = useRef(!shouldAnimateOnMount);

  useEffect(() => {
    currentState.current = resolvedInitialState;
  }, [resolvedInitialState]);

  useEffect(() => {
    if (isDragging.current) return;

    const target = getHeightForState(currentState.current);

    if (!hasPresented.current) {
      animatedHeight.setValue(normalizedCollapsedHeight);
      Animated.timing(animatedHeight, {
        toValue: target,
        duration: 260,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: false,
      }).start(() => {
        startHeight.current = target;
        hasPresented.current = true;
        onStateChange?.(currentState.current);
      });
      return;
    }

    startHeight.current = target;
    animatedHeight.setValue(target);
  }, [
    animatedHeight,
    getHeightForState,
    normalizedCollapsedHeight,
    onStateChange,
  ]);

  useEffect(() => {
    if (!onHeightChange) {
      return;
    }

    onHeightChange?.(startHeight.current);
    const listenerId = animatedHeight.addListener(({ value }) => {
      onHeightChange?.(value);
    });

    return () => {
      animatedHeight.removeListener(listenerId);
    };
  }, [animatedHeight, onHeightChange]);

  const animateTo = (state: BottomSheetState) => {
    const targetHeight = getHeightForState(state);
    currentState.current = state;
    onStateChange?.(state);
    Animated.spring(animatedHeight, {
      toValue: targetHeight,
      useNativeDriver: false,
      tension: 180,
      friction: 24,
    }).start(() => {
      startHeight.current = targetHeight;
      if (state === 'collapsed') {
        onCollapsed?.();
      }
    });
  };

  const handleRelease = (_: unknown, gesture: PanResponderGestureState) => {
    const currentHeight = clamp(
      startHeight.current - gesture.dy,
      normalizedCollapsedHeight,
      expandedHeight,
    );

    if (gesture.vy > 0.5) {
      const nextPoint = snapPoints
        .slice()
        .reverse()
        .find((point) => point.height < currentHeight - 1);
      animateTo(nextPoint?.state ?? 'collapsed');
      return;
    }

    if (gesture.vy < -0.5) {
      const previousPoint = snapPoints.find((point) => point.height > currentHeight + 1);
      animateTo(previousPoint?.state ?? 'expanded');
      return;
    }

    animateTo(getNearestSnapPoint(currentHeight, snapPoints).state);
  };

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: (_evt, gesture) =>
          Math.abs(gesture.dy) > 6,
        onPanResponderTerminationRequest: () => false,
        onPanResponderGrant: () => {
          isDragging.current = true;
          animatedHeight.stopAnimation((value) => {
            startHeight.current = value;
          });
        },
        onPanResponderMove: (_evt, gesture) => {
          const next = clamp(
            startHeight.current - gesture.dy,
            normalizedCollapsedHeight,
            expandedHeight,
          );
          animatedHeight.setValue(next);
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
    [animatedHeight, expandedHeight, normalizedCollapsedHeight, snapPoints],
  );

  return (
    <Animated.View
      style={[
        styles.container,
        {
          height: animatedHeight,
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
        <View
          style={[
            styles.handleGestureArea,
            {
              paddingTop: handleGestureInset,
              paddingBottom: handleGestureInset,
              paddingHorizontal: handleGestureInset,
              marginTop: -handleGestureInset,
              marginBottom: -handleGestureInset,
              marginHorizontal: -handleGestureInset,
            },
          ]}
          {...(enablePanGesture ? panResponder.panHandlers : {})}
        >
          <View style={handleContainerStyle}>{handle}</View>
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
  handleGestureArea: {
    alignSelf: 'stretch',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 2,
  },
});
