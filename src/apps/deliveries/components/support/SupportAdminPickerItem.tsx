import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';

type Props = {
  image?: string;
  name: string;
  onPress: () => void;
  subtitle: string;
};

export default function SupportAdminPickerItem({
  image,
  name,
  onPress,
  subtitle,
}: Props) {
  const { colors, typography } = useTheme();
  const initials = name
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? '')
    .join('') || 'SA';

  return (
    <Pressable
      accessibilityLabel={name}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.row,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          opacity: pressed ? 0.88 : 1,
        },
      ]}
    >
      {image ? (
        <Image source={{ uri: image }} style={styles.avatar} />
      ) : (
        <View style={[styles.avatarFallback, { backgroundColor: colors.cardBlue }]}>
          <Text weight="semiBold" color={colors.primary}>
            {initials}
          </Text>
        </View>
      )}

      <View style={styles.content}>
        <Text
          color={colors.text}
          weight="semiBold"
          style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
        >
          {name}
        </Text>
        <Text
          color={colors.mutedText}
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.sm2 }}
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 24,
    height: 48,
    width: 48,
  },
  avatarFallback: {
    alignItems: 'center',
    borderRadius: 24,
    height: 48,
    justifyContent: 'center',
    width: 48,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  row: {
    alignItems: 'center',
    borderRadius: 16,
    borderWidth: 1,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
  },
});
