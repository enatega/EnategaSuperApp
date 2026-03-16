import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  typeLabel: string;
  address: string | null | undefined;
  iconName: keyof typeof Ionicons.glyphMap;
  onMenuPress?: () => void;
};

export default function MyProfileAddressCard({
  typeLabel,
  address,
  iconName,
  onMenuPress,
}: Props) {
  const { colors } = useTheme();

  return (
    <View
      style={[
        styles.card,
        { borderColor: colors.border, backgroundColor: colors.surface },
      ]}
    >
      <View style={styles.content}>
        <View style={[styles.iconCircle, { backgroundColor: colors.backgroundTertiary }]}>
          <Ionicons name={iconName} size={20} color={colors.text} />
        </View>
        <View style={styles.textSection}>
          <Text weight="bold" style={styles.typeLabel}>
            {typeLabel}
          </Text>
          <Text
            weight="medium"
            color={colors.mutedText}
            style={styles.address}
            numberOfLines={2}
          >
            {address || '—'}
          </Text>
        </View>
        {onMenuPress ? (
          <Pressable
            onPress={onMenuPress}
            accessibilityRole="button"
            accessibilityLabel={`${typeLabel} options`}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
            style={({ pressed }) => [
              styles.menuButton,
              { opacity: pressed ? 0.5 : 1 },
            ]}
          >
            <Ionicons name="ellipsis-vertical" size={18} color={colors.mutedText} />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  address: {
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 12,
  },
  content: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 12,
  },
  iconCircle: {
    alignItems: 'center',
    borderRadius: 20,
    height: 40,
    justifyContent: 'center',
    width: 40,
  },
  menuButton: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 4,
  },
  textSection: {
    flex: 1,
    gap: 4,
  },
  typeLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
});
