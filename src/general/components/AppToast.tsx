import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '../theme/theme';

type AlertType = 'success' | 'error' | 'info';

type ToastPayload = {
  type: AlertType;
  text1: string;
  text2?: string;
  duration: number;
};

type ToastListener = (payload: ToastPayload) => void;

const DEFAULT_DURATION = 4000;
const TOAST_MIN_DURATION = 1200;
const TOAST_MAX_DURATION = 12000;
const TOAST_ENTER_DURATION = 220;
const TOAST_EXIT_DURATION = 180;
const IOS_TOP_GAP = 8;
const ANDROID_TOP_GAP = 12;
const ANDROID_NO_INSET_FALLBACK = 16;

const toastListeners = new Set<ToastListener>();

const emitToast = (payload: ToastPayload) => {
  toastListeners.forEach((listener) => listener(payload));
};

const subscribeToast = (listener: ToastListener) => {
  toastListeners.add(listener);

  return () => {
    toastListeners.delete(listener);
  };
};

const iconByType: Record<AlertType, keyof typeof Ionicons.glyphMap> = {
  success: 'checkmark-circle-outline',
  error: 'alert-circle-outline',
  info: 'information-circle-outline',
};

export const AppToast = () => {
  const { colors, typography } = useTheme();
  const insets = useSafeAreaInsets();

  const [toast, setToast] = useState<ToastPayload | null>(null);
  const dismissTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const activeAnimationRef = useRef<Animated.CompositeAnimation | null>(null);

  const opacity = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(-20)).current;
  const progress = useRef(new Animated.Value(0)).current;
  const progressWidth = useMemo(
    () =>
      progress.interpolate({
        inputRange: [0, 1],
        outputRange: ['0%', '100%'],
      }),
    [progress],
  );
  const topOffset = useMemo(() => {
    if (Platform.OS === 'ios') {
      return insets.top + IOS_TOP_GAP;
    }

    if (insets.top > 0) {
      return insets.top + ANDROID_TOP_GAP;
    }

    return ANDROID_NO_INSET_FALLBACK;
  }, [insets.top]);

  const clearDismissTimer = useCallback(() => {
    if (dismissTimerRef.current) {
      clearTimeout(dismissTimerRef.current);
      dismissTimerRef.current = null;
    }
  }, []);

  const hideToast = useCallback(() => {
    clearDismissTimer();
    activeAnimationRef.current?.stop();

    const hideAnimation = Animated.parallel([
      Animated.timing(opacity, {
        toValue: 0,
        duration: TOAST_EXIT_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
      Animated.timing(translateY, {
        toValue: -16,
        duration: TOAST_EXIT_DURATION,
        easing: Easing.out(Easing.quad),
        useNativeDriver: true,
      }),
    ]);

    activeAnimationRef.current = hideAnimation;
    hideAnimation.start(() => {
      setToast(null);
      progress.setValue(0);
      activeAnimationRef.current = null;
    });
  }, [clearDismissTimer, opacity, progress, translateY]);

  useEffect(() => {
    const unsubscribe = subscribeToast((payload) => {
      clearDismissTimer();
      activeAnimationRef.current?.stop();
      setToast(payload);

      opacity.setValue(0);
      translateY.setValue(-20);
      progress.setValue(0);

      const showAnimation = Animated.parallel([
        Animated.timing(opacity, {
          toValue: 1,
          duration: TOAST_ENTER_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(translateY, {
          toValue: 0,
          duration: TOAST_ENTER_DURATION,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(progress, {
          toValue: 1,
          duration: payload.duration,
          easing: Easing.linear,
          useNativeDriver: false,
        }),
      ]);

      activeAnimationRef.current = showAnimation;
      showAnimation.start(() => {
        activeAnimationRef.current = null;
      });

      dismissTimerRef.current = setTimeout(() => {
        hideToast();
      }, payload.duration);
    });

    return () => {
      clearDismissTimer();
      activeAnimationRef.current?.stop();
      unsubscribe();
    };
  }, [clearDismissTimer, hideToast, opacity, progress, translateY]);

  const palette = useMemo(() => {
    if (!toast) {
      return null;
    }

    if (toast.type === 'success') {
      return {
        background: colors.successSoft,
        border: colors.success,
        content: colors.successText,
        progressTrack: colors.green100,
      };
    }

    if (toast.type === 'error') {
      return {
        background: colors.dangerSoft,
        border: colors.danger,
        content: colors.dangerText,
        progressTrack: colors.red100,
      };
    }

    return {
      background: colors.blue50,
      border: colors.blue800,
      content: colors.blue800,
      progressTrack: colors.blue100,
    };
  }, [colors, toast]);

  if (!toast || !palette) {
    return null;
  }

  return (
    <View pointerEvents="box-none" style={styles.overlay}>
      <Animated.View
        style={[
          styles.container,
          {
            marginTop: topOffset,
            backgroundColor: palette.background,
            borderColor: `${palette.border}33`,
            opacity,
            transform: [{ translateY }],
          },
        ]}
      >
        <View style={styles.contentWrap}>
          <View style={styles.messageWrap}>
            <Ionicons
              color={palette.content}
              name={iconByType[toast.type]}
              size={24}
              style={styles.icon}
            />

            <View style={styles.textWrap}>
              <Text
                numberOfLines={2}
                style={[
                  styles.title,
                  {
                    color: palette.content,
                    fontSize: typography.size.md2,
                    lineHeight: typography.lineHeight.md2,
                    fontWeight: '700',
                  },
                ]}
              >
                {toast.text1}
              </Text>

              {!!toast.text2 && (
                <Text
                  numberOfLines={3}
                  style={[
                    styles.caption,
                    {
                      color: palette.content,
                      fontSize: typography.size.sm,
                      lineHeight: typography.lineHeight.sm2,
                      fontWeight: '500',
                    },
                  ]}
                >
                  {toast.text2}
                </Text>
              )}
            </View>
          </View>

          <Pressable
            accessibilityLabel="Close alert"
            hitSlop={8}
            onPress={hideToast}
            style={styles.closeButton}
          >
            <Ionicons color={colors.iconMuted} name="close" size={18} />
          </Pressable>
        </View>

        <View style={[styles.timerTrack, { backgroundColor: palette.progressTrack }]}> 
          <Animated.View
            style={[
              styles.timerProgress,
              {
                width: progressWidth,
                backgroundColor: palette.border,
              },
            ]}
          />
        </View>
      </Animated.View>
    </View>
  );
};

const show = (
  type: AlertType,
  text1: string,
  text2?: string,
  duration = DEFAULT_DURATION,
) => {
  const normalizedDuration = Math.min(
    TOAST_MAX_DURATION,
    Math.max(TOAST_MIN_DURATION, duration > 0 ? duration : DEFAULT_DURATION),
  );

  emitToast({
    type,
    text1,
    text2,
    duration: normalizedDuration,
  });
};

export const showToast = {
  success: (text1: string, text2?: string, duration?: number) => {
    show('success', text1, text2, duration);
  },
  error: (text1: string, text2?: string, duration?: number) => {
    show('error', text1, text2, duration);
  },
  info: (text1: string, text2?: string, duration?: number) => {
    show('info', text1, text2, duration);
  },
};

export default AppToast;

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 9999,
    elevation: 9999,
    alignItems: 'stretch',
  },
  container: {
    borderWidth: 1,
    borderRadius: 8,
    marginHorizontal: 16,
    overflow: 'hidden',
  },
  contentWrap: {
    alignItems: 'flex-start',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 14,
  },
  messageWrap: {
    alignItems: 'flex-start',
    flex: 1,
    flexDirection: 'row',
  },
  icon: {
    marginTop: 1,
    marginRight: 12,
  },
  textWrap: {
    flex: 1,
  },
  title: {
    marginBottom: 4,
    textAlign: 'left',
  },
  caption: {
    textAlign: 'left',
  },
  closeButton: {
    alignItems: 'center',
    height: 18,
    justifyContent: 'center',
    marginTop: 1,
    width: 18,
  },
  timerTrack: {
    height: 3,
    width: '100%',
  },
  timerProgress: {
    height: '100%',
  },
});
