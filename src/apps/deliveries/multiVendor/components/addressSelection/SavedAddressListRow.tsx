import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  address: string | null | undefined;
  iconName: keyof typeof Ionicons.glyphMap;
  isDisabled?: boolean;
  isSelected?: boolean;
  isSelecting?: boolean;
  onPress: () => void;
  typeLabel: string;
};

export default function SavedAddressListRow({
  address,
  iconName,
  isDisabled = false,
  isSelected = false,
  isSelecting = false,
  onPress,
  typeLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const resolvedAddress = address?.trim() || '—';
  const accentColor = isSelected ? colors.primary : colors.text;

  return (
    <Pressable
      accessibilityLabel={`${typeLabel}, ${resolvedAddress}`}
      accessibilityRole="button"
      accessibilityState={{ busy: isSelecting, disabled: isDisabled, selected: isSelected }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: pressed ? colors.gray100 : 'transparent',
          opacity: isDisabled ? 0.6 : 1,
        },
      ]}
    >
      <View style={styles.iconWrapper}>
        <Ionicons name={iconName} size={22} color={accentColor} />
      </View>

      <View style={styles.textBlock}>
        <Text
          weight="medium"
          style={[
            styles.title,
            {
              color: accentColor,
              fontSize: typography.size.sm2,
              lineHeight: typography.lineHeight.md,
            },
          ]}
        >
          {typeLabel}
        </Text>
        <Text
          weight="medium"
          numberOfLines={2}
          style={[
            styles.subtitle,
            {
              color: isSelected ? colors.primary : colors.mutedText,
              fontSize: typography.size.xs2,
              lineHeight: typography.lineHeight.sm,
            },
          ]}
        >
          {resolvedAddress}
        </Text>
      </View>

      {isSelecting ? (
        <ActivityIndicator color={colors.primary} size="small" />
      ) : isSelected ? (
        <Ionicons name="checkmark" size={24} color={colors.primary} />
      ) : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  iconWrapper: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 24,
  },
  row: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    minHeight: 56,
    paddingHorizontal: 12,
    paddingVertical: 10,
  },
  subtitle: {
    flexShrink: 1,
  },
  textBlock: {
    flex: 1,
    gap: 2,
  },
  title: {
    letterSpacing: 0,
  },
});
