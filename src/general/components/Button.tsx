import React, { ReactNode } from 'react';
import { ActivityIndicator, ColorValue, Pressable, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';
import Text from './Text';
import { useTheme } from '../theme/theme';

type Props = {
  label: string;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  icon?: ReactNode
  disabled?: boolean
  isLoading?: boolean;
};

function parseColorToRgb(color?: ColorValue | null) {
  if (!color || typeof color !== 'string' || color === 'transparent') {
    return null;
  }

  const normalizedColor = color.trim();

  if (normalizedColor.startsWith('#')) {
    const hex = normalizedColor.slice(1);

    if (hex.length === 3) {
      return {
        r: Number.parseInt(`${hex[0]}${hex[0]}`, 16),
        g: Number.parseInt(`${hex[1]}${hex[1]}`, 16),
        b: Number.parseInt(`${hex[2]}${hex[2]}`, 16),
      };
    }

    if (hex.length === 6) {
      return {
        r: Number.parseInt(hex.slice(0, 2), 16),
        g: Number.parseInt(hex.slice(2, 4), 16),
        b: Number.parseInt(hex.slice(4, 6), 16),
      };
    }
  }

  const rgbMatch = normalizedColor.match(/rgba?\(([^)]+)\)/i);

  if (!rgbMatch) {
    return null;
  }

  const [r, g, b] = rgbMatch[1]
    .split(',')
    .slice(0, 3)
    .map((value) => Number.parseFloat(value.trim()));

  if ([r, g, b].some((value) => Number.isNaN(value))) {
    return null;
  }

  return { r, g, b };
}

function isLightColor(color?: ColorValue | null) {
  const rgb = parseColorToRgb(color);

  if (!rgb) {
    return false;
  }

  const toLinear = (channel: number) => {
    const normalized = channel / 255;
    return normalized <= 0.03928
      ? normalized / 12.92
      : ((normalized + 0.055) / 1.055) ** 2.4;
  };

  const luminance = (0.2126 * toLinear(rgb.r)) + (0.7152 * toLinear(rgb.g)) + (0.0722 * toLinear(rgb.b));
  return luminance > 0.45;
}

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
  const isDanger = variant === 'danger';
  const isDisabled = disabled || isLoading;
  const flattenedStyle = StyleSheet.flatten(style) ?? {};
  const baseBackgroundColor = disabled ? colors.backgroundTertiary : isGhost
    ? 'transparent'
    : isDanger
      ? colors.danger
      : isSecondary
        ? colors.surface
        : colors.primary;
  const resolvedBackgroundColor = flattenedStyle.backgroundColor ?? baseBackgroundColor;
  const contentColor = isGhost
    ? colors.primary
    : isDisabled && isLightColor(resolvedBackgroundColor)
      ? colors.mutedText
      : isSecondary || isLightColor(resolvedBackgroundColor)
        ? colors.text
        : colors.white;

  return (
    <Pressable
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled, busy: isLoading }}
      style={({ pressed }) => [
        styles.base,
        {
          backgroundColor: baseBackgroundColor,
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
            color={contentColor}
          />
        ) : null}
        {icon && icon}
        <Text
          variant="body"
          weight="semiBold"
          color={contentColor}
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
