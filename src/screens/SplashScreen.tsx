import React, { useEffect, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Text from '../general/components/Text';
import { useTheme } from '../general/theme/theme';
import { useTranslation } from 'react-i18next';

type Props = {
  onFinish?: () => void;
};

export default function SplashScreen({ onFinish }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('general');
  const [progress, setProgress] = useState(1);
  const durationMs = 1200;
  const intervalMs = useMemo(() => Math.max(10, Math.floor(durationMs / 100)), [durationMs]);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((value) => (value >= 100 ? 100 : value + 1));
    }, intervalMs);

    const timer = setTimeout(() => {
      onFinish?.();
    }, durationMs);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [durationMs, intervalMs, onFinish]);

  return (
    <LinearGradient
      colors={[colors.splashGradientStart, colors.splashGradientEnd]}
      start={{ x: 0.5, y: 0 }}
      end={{ x: 0.5, y: 1 }}
      style={styles.container}
    >
      <View style={styles.centerBlock}>
        <Text
          weight="bold"
          color={colors.white}
          style={[styles.title, { fontSize: typography.size.splash, lineHeight: typography.lineHeight.splash }]}
        >
          {t('splash_title')}
        </Text>
      </View>
      <View style={styles.loader}>
        <View style={[styles.progressCircle, { borderColor: colors.white }]}>
          <Text variant="caption" color={colors.white}>
            {t('splash_progress', { value: progress })}
          </Text>
        </View>
        <Text variant="caption" color={colors.white} style={styles.loadingText}>
          {t('loading')}
        </Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerBlock: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    letterSpacing: 0,
    fontFamily: 'Figma Hand',
  },
  loader: {
    alignItems: 'center',
    gap: 8,
    paddingBottom: 48,
  },
  progressCircle: {
    width: 46,
    height: 46,
    borderRadius: 23,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    opacity: 0.9,
  },
});
