import React, { memo } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  showChevron?: boolean;
  onPress?: () => void;
};

function ReviewDetailRow({
  icon,
  onPress,
  showChevron = true,
  subtitle,
  title,
}: Props) {
  const { colors, typography } = useTheme();

  const rowContent = (
    <>
      <Ionicons name={icon} size={20} color={colors.text} />
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
      {showChevron ? <Ionicons name="chevron-forward" size={20} color={colors.text} /> : null}
    </>
  );

  if (!onPress) {
    return <View style={styles.row}>{rowContent}</View>;
  }

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          opacity: pressed ? 0.8 : 1,
        },
      ]}
    >
      {rowContent}
    </Pressable>
  );
}

export default memo(ReviewDetailRow);

const styles = StyleSheet.create({
  content: {
    flex: 1,
    gap: 2,
  },
  row: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
});
