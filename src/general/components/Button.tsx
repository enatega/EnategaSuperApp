import React from 'react';
import { Pressable, StyleProp, StyleSheet, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'ghost';
};

export default function Button({ label, onPress, style, variant = 'primary' }: Props) {
  const { colors } = useTheme();
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: isGhost
            ? 'transparent'
            : isSecondary
              ? colors.surface
              : colors.primary,
          borderColor: isGhost ? 'transparent' : colors.border,
          opacity: pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <Text
        variant="body"
        weight="semiBold"
        color={isGhost ? colors.primary : isSecondary ? colors.text : '#FFFFFF'}
      >
        {label}
      </Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
