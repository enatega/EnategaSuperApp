import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import MyProfileInfoRow from './MyProfileInfoRow';

type Props = {
  imageUri: string | null | undefined;
  displayName: string;
  fullName: string | null | undefined;
  dateOfBirth: string | null | undefined;
  phone: string | null | undefined;
  email: string | null | undefined;
  editLabel: string;
  nameLabel: string;
  dateOfBirthLabel: string;
  phoneLabel: string;
  emailLabel: string;
  onEditAvatar?: () => void;
  onEditName?: () => void;
};

export default function MyProfileInfoCard({
  imageUri,
  displayName,
  fullName,
  dateOfBirth,
  phone,
  email,
  editLabel,
  nameLabel,
  dateOfBirthLabel,
  phoneLabel,
  emailLabel,
  onEditAvatar,
  onEditName,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      {/* Avatar + name */}
      <View style={styles.avatarSection}>
        <View style={styles.avatarContainer}>
          <View style={[styles.avatarWrapper, { backgroundColor: colors.backgroundTertiary }]}>
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
          <Pressable
            onPress={onEditAvatar}
            accessibilityRole="button"
            accessibilityLabel={editLabel}
            style={[styles.editAvatarButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Ionicons name="pencil" size={12} color={colors.text} />
          </Pressable>
        </View>
        <Text weight="bold" style={styles.name} numberOfLines={1}>
          {displayName}
        </Text>
      </View>

      {/* Divider */}
      <View style={styles.dividerWrapper}>
        <View style={[styles.divider, { backgroundColor: colors.border }]} />
      </View>

      {/* Info rows */}
      <View style={styles.infoSection}>
        <MyProfileInfoRow
          label={nameLabel}
          value={fullName}
          isEditable
          editLabel={editLabel}
          onEdit={onEditName}
        />
        <MyProfileInfoRow label={dateOfBirthLabel} value={dateOfBirth} />
        <MyProfileInfoRow label={phoneLabel} value={phone} />
        <MyProfileInfoRow label={emailLabel} value={email} />
      </View>
    </View>
  );
}

const AVATAR_SIZE = 64;

const styles = StyleSheet.create({
  avatar: {
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  avatarContainer: {
    height: AVATAR_SIZE,
    width: AVATAR_SIZE,
  },
  avatarSection: {
    alignItems: 'center',
    gap: 3,
    paddingVertical: 24,
  },
  avatarWrapper: {
    borderRadius: AVATAR_SIZE / 2,
    height: AVATAR_SIZE,
    overflow: 'hidden',
    width: AVATAR_SIZE,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    gap: 24,
    marginHorizontal: 16,
    padding: 16,
  },
  divider: {
    height: 1,
  },
  dividerWrapper: {
    paddingVertical: 4,
  },
  editAvatarButton: {
    alignItems: 'center',
    borderRadius: 12,
    bottom: 0,
    height: 24,
    justifyContent: 'center',
    position: 'absolute',
    right: -4,
    width: 24,
  },
  infoSection: {
    gap: 12,
  },
  name: {
    fontSize: 18,
    lineHeight: 28,
  },
});
