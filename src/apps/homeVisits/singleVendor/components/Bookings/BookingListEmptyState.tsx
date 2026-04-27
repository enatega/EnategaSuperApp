import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { placeholderImages } from '../../../../../general/assets/images';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle: string;
  ctaLabel: string;
  onCtaPress?: () => void;
};

export default function BookingListEmptyState({
  title,
  subtitle,
  ctaLabel,
  onCtaPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <Image
        source={placeholderImages.comingSoon}
        style={styles.illustration}
        resizeMode="contain"
      />
      <Text
        numberOfLines={2}
        style={styles.title}
        weight="bold"
      >
        {title}
      </Text>
      <Text
        numberOfLines={3}
        style={{
          ...styles.subtitle,
          color: colors.text,
          fontSize: typography.size.md2,
          lineHeight: typography.lineHeight.md,
        }}
      >
        {subtitle}
      </Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={ctaLabel}
        onPress={onCtaPress}
        style={({ pressed }) => [
          styles.ctaButton,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: pressed ? 0.85 : 1,
          },
        ]}
      >
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.sm2,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {ctaLabel}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: 'center',
    marginTop: 12,
    paddingHorizontal: 24,
    paddingVertical: 32,
    rowGap: 8,
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 1,
  },
  ctaButton: {
    alignItems: 'center',
    borderRadius: 6,
    borderWidth: 1,
    height: 44,
    justifyContent: 'center',
    marginTop: 8,
    width: '100%',
  },
  illustration: {
    height: 72,
    width: 72,
  },
  subtitle: {
    textAlign: 'center',
  },
  title: {
    textAlign: 'center',
  },
});
