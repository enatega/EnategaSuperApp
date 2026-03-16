import React from 'react';
import { Image, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type Props = {
  name: string | null | undefined;
  imageUri: string | null | undefined;
  subtitle: string;
};

export default function ProfileHeader({
  name,
  imageUri,
  subtitle,
}: Props) {
  const { colors } = useTheme();
  const displayName = name || '—';

  return (
    <View style={styles.container}>
      <View style={styles.info}>
        <Text
          weight="bold"
          style={styles.name}
          numberOfLines={1}
        >
          {displayName}
        </Text>
        <Text
          weight="medium"
          color={colors.mutedText}
          style={styles.subtitle}
        >
          {subtitle}
        </Text>
      </View>
      <View style={[styles.avatarWrapper, { backgroundColor: colors.border }]}>
        {imageUri ? (
          <Image
            source={{ uri: imageUri }}
            style={styles.avatar}
            accessibilityLabel={`${displayName} avatar`}
          />
        ) : (
          <View style={[styles.avatar, { backgroundColor: colors.backgroundTertiary }]} />
        )}
      </View>
    </View>
  );
}

const AVATAR_SIZE = 56;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  avatarWrapper: {
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    overflow: 'hidden',
    width: AVATAR_SIZE,
  },
  container: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  info: {
    flex: 1,
    marginRight: 16,
  },
  name: {
    fontSize: 20,
    lineHeight: 32,
  },
  subtitle: {
    fontSize: 14,
    lineHeight: 22,
  },
});
