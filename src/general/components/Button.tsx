import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';
import Svg from './Svg';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'ghost';
  icon?: ReactNode
  disabled?: boolean
  isLoading?: boolean;
};

export default function Button({
  label,
  onPress,
  style,
  variant = 'primary',
  icon,
  isLoading = false,
  disabled = false,
}: Props) {
  const { colors } = useTheme();
  const isGhost = variant === 'ghost';
  const isSecondary = variant === 'secondary';
  const isDisabled = disabled || isLoading;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: disabled ? colors.backgroundTertiary : isGhost
            ? 'transparent'
            : isSecondary
              ? colors.surface
              : colors.primary,
          borderColor: isGhost ? 'transparent' : colors.border,
          opacity: isDisabled ? 0.6 : pressed ? 0.85 : 1,
        },
        style,
      ]}
    >
      <View style={styles.content}>
        {isLoading ? (
          <ActivityIndicator
            size="small"
            color={isGhost || isSecondary ? colors.primary : '#FFFFFF'}
          />
        ) : null}
        {icon && icon}
        <Text
          variant="body"
          weight="semiBold"
          color={isGhost ? colors.primary : isSecondary ? colors.text : '#FFFFFF'}
        >
          {label}
        </Text>
      </View>
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
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
});
