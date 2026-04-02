import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  count: number;
  style?: StyleProp<ViewStyle>;
};

export default function CartCountBadge({ count, style }: Props) {
  const { colors } = useTheme();

  if (count <= 0) {
    return null;
  }

  return (
    <View style={[styles.badge, { backgroundColor: colors.primary }, style]}>
      <Text color={colors.white} style={styles.label} weight="semiBold">
        {count}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    alignItems: 'center',
    borderRadius: 999,
    justifyContent: 'center',
    minWidth: 22,
    paddingHorizontal: 6,
    paddingVertical: 2,
  },
  label: {
    fontSize: 11,
    fontVariant: ['tabular-nums'],
    lineHeight: 14,
  },
});
