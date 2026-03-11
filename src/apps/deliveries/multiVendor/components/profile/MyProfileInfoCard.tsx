import React from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';

type InfoRowProps = {
  label: string;
  value: string | null | undefined;
  isEditable?: boolean;
  editLabel?: string;
  onEdit?: () => void;
};

function InfoRow({ label, value, isEditable, editLabel, onEdit }: InfoRowProps) {
  const { colors } = useTheme();

  return (
    <View style={styles.infoRow}>
      <View style={styles.infoRowHeader}>
        <Text weight="bold" style={styles.infoLabel}>
          {label}
        </Text>
        {isEditable && editLabel && (
          <Pressable onPress={onEdit} accessibilityRole="button">
            <Text weight="medium" color={colors.text} style={styles.editText}>
              {editLabel}
            </Text>
          </Pressable>
        )}
      </View>
      <Text weight="medium" color={colors.mutedText} style={styles.infoValue}>
        {value || '—'}
      </Text>
    </View>
  );
}

type Props = {
  imageUri: string | null | undefined;
  displayName: string;
  fullName: string | null | undefined;
  phone: string | null | undefined;
  email: string | null | undefined;
  editLabel: string;
  nameLabel: string;
  phoneLabel: string;
  emailLabel: string;
  onEditAvatar?: () => void;
  onEditName?: () => void;
};

export default function MyProfileInfoCard({
  imageUri,
  displayName,
  fullName,
  phone,
  email,
  editLabel,
  nameLabel,
  phoneLabel,
  emailLabel,
  onEditAvatar,
  onEditName,
}: Props) {
  const { colors } = useTheme();

  return (
    <View style={[styles.card, { borderColor: colors.border }]}>
      {/* Top-right edit link */}
      <View style={styles.editRow}>
        <Pressable onPress={onEditName} accessibilityRole="button">
          <Text weight="medium" color={colors.text} style={styles.editText}>
            {editLabel}
          </Text>
        </Pressable>
      </View>

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
        <InfoRow
          label={nameLabel}
          value={fullName}
          isEditable
          editLabel={editLabel}
          onEdit={onEditName}
        />
        <InfoRow label={phoneLabel} value={phone} />
        <InfoRow label={emailLabel} value={email} />
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
  editRow: {
    alignItems: 'flex-end',
  },
  editText: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  infoRow: {
    gap: 4,
    height: 44,
    justifyContent: 'center',
  },
  infoRowHeader: {
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoSection: {
    gap: 12,
  },
  infoValue: {
    fontSize: 12,
    lineHeight: 18,
  },
  name: {
    fontSize: 18,
    lineHeight: 28,
  },
});
