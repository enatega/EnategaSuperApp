import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Text from '../Text';
import Image from '../Image';
import { useTheme } from '../../theme/theme';

type Props = {
  image?: string | null;
  name: string;
  subtitle: string;
  onPress: () => void;
};

const FALLBACK_AVATAR = 'https://placehold.co/96x96/png';

export default function SupportAdminPickerItem({
  image,
  name,
  subtitle,
  onPress,
}: Props) {
  const { colors, typography } = useTheme();

  return (
    <Pressable
      accessibilityLabel={name}
      accessibilityRole="button"
      onPress={onPress}
      style={({ pressed }) => [
        styles.container,
        { backgroundColor: colors.background, opacity: pressed ? 0.75 : 1 },
      ]}
    >
      <Image
        source={{ uri: image ?? FALLBACK_AVATAR }}
        style={styles.avatar}
      />
      <View style={styles.content}>
        <Text
          color={colors.text}
          style={{ fontSize: typography.size.md2, lineHeight: typography.lineHeight.md2 }}
          weight="semiBold"
        >
          {name}
        </Text>
        <Text
          color={colors.mutedText}
          style={{ fontSize: typography.size.sm2, lineHeight: typography.lineHeight.md }}
          weight="medium"
        >
          {subtitle}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 9999,
    height: 52,
    width: 52,
  },
  container: {
    alignItems: 'center',
    borderRadius: 10,
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  content: {
    flex: 1,
    gap: 2,
  },
});
