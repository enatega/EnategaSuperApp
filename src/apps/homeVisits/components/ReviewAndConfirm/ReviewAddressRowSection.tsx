import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  title: string;
  subtitle: string;
  onPress?: () => void;
};

function ReviewAddressRowSection({ onPress, subtitle, title }: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.section,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      <Ionicons name="location-outline" size={20} color={colors.text} />
      <View style={styles.content}>
        <Text
          weight="medium"
          style={{
            color: colors.text,
            fontSize: typography.size.md,
            lineHeight: typography.lineHeight.md,
          }}
        >
          {title}
        </Text>
        <Text
          weight="medium"
          style={{
            color: colors.iconMuted,
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {subtitle}
        </Text>
      </View>
      <Ionicons name="chevron-forward" size={20} color={colors.text} />
    </Pressable>
  );
}

export default memo(ReviewAddressRowSection);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 2,
  },
  section: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
});
