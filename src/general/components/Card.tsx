import React from 'react';
import { StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import { useTheme } from '../theme/theme';

type Props = {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  variant?: 'surface' | 'soft' | 'outlined';
};

export default function Card({ children, style, variant = 'surface' }: Props) {
  const { colors } = useTheme();

  const variantStyle: ViewStyle = (() => {
    switch (variant) {
      case 'soft':
        return { backgroundColor: colors.cardBlue };
      case 'outlined':
        return { backgroundColor: colors.surface, borderColor: colors.border, borderWidth: 1 };
      default:
        return { backgroundColor: colors.surface };
    }
  })();

  return <View style={[styles.base, variantStyle, style]}>{children}</View>;
}

const styles = StyleSheet.create({
  base: {
    borderRadius: 16,
    padding: 14,
  },
});
