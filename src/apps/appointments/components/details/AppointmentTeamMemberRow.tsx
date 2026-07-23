import React from 'react';
import { ActivityIndicator, Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Icon from '../../../../general/components/Icon';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import type { TeamMember } from './detailTypes';

type Props = {
  item: TeamMember;
  onSelect: () => void;
  isDisabled?: boolean;
  isLoading?: boolean;
  buttonLabel?: string;
};

export default function AppointmentTeamMemberRow({
  item,
  onSelect,
  isDisabled = false,
  isLoading = false,
  buttonLabel,
}: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('appointments');
  const label = buttonLabel ?? t('team_select');

  return (
    <View style={[styles.row, { borderBottomColor: colors.border }]}>
      <View style={styles.left}>
        <View style={styles.avatarColumn}>
          {item.imageUrl ? (
            <Image resizeMode="cover" source={{ uri: item.imageUrl }} style={styles.avatar} />
          ) : (
            <View style={[styles.avatar, { backgroundColor: item.accentColor }]}>
              <Text style={{ color: colors.text, fontSize: typography.size.lg }} weight="bold">
                {item.name.charAt(0)}
              </Text>
            </View>
          )}

          {item.rating ? (
            <View style={[styles.ratingPill, { backgroundColor: colors.surface }]}>
              <Icon color={colors.warning} name="star" size={14} />
              <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }} weight="semiBold">
                {item.rating}
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.content}>
          <Text style={{ color: colors.text, fontSize: typography.size.md }} weight="bold">
            {item.name}
          </Text>
          <Text style={{ color: colors.mutedText, fontSize: typography.size.sm }}>
            {item.role}
          </Text>
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        disabled={isDisabled || isLoading}
        onPress={onSelect}
        style={[
          styles.button,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            opacity: isDisabled ? 0.6 : 1,
          },
        ]}
      >
        {isLoading ? (
          <ActivityIndicator color={colors.primary} size="small" />
        ) : (
          <Text style={{ color: colors.text, fontSize: typography.size.sm2 }} weight="semiBold">
            {label}
          </Text>
        )}
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    borderRadius: 28,
    height: 56,
    width: 56,
  },
  avatarColumn: {
    alignItems: 'center',
    gap: 6,
    width: 64,
  },
  button: {
    alignItems: 'center',
    borderRadius: 10,
    borderWidth: 1,
    justifyContent: 'center',
    minHeight: 36,
    minWidth: 68,
    paddingHorizontal: 12,
  },
  content: {
    flex: 1,
    gap: 2,
  },
  left: {
    alignItems: 'center',
    flex: 1,
    flexDirection: 'row',
    gap: 12,
  },
  ratingPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: -20,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderWidth: 1,
    borderColor: "#E4E4E7",
  },
  row: {
    alignItems: 'center',
    borderBottomWidth: 1,
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'space-between',
    paddingVertical: 18,
  },
});
