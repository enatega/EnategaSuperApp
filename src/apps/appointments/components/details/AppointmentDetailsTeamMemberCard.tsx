import React from 'react';
import { StyleSheet, View } from 'react-native';
import Image from '../../../../general/components/Image';
import Text from '../../../../general/components/Text';
import Icon from '../../../../general/components/Icon';
import { useTheme } from '../../../../general/theme/theme';
import type { TeamMember } from './detailTypes';

type Props = {
  item: TeamMember;
};

export default function AppointmentDetailsTeamMemberCard({ item }: Props) {
  const { colors, typography } = useTheme();

  return (
    <View style={styles.card}>
      {item.imageUrl ? (
        <Image
          resizeMode="cover"
          source={{ uri: item.imageUrl }}
          style={styles.avatar}
        />
      ) : (
        <View style={[styles.avatar, { backgroundColor: item.accentColor }]}>
          <Text
            style={{
              color: colors.text,
              fontSize: typography.size.lg,
            }}
            weight="bold"
          >
            {item.name.charAt(0)}
          </Text>
        </View>
      )}

      {item.rating ? (
        <View style={[styles.ratingPill, { backgroundColor: colors.blue100 }]}>
          <Icon color={colors.primary} name="star" size={12} />
          <Text style={{ color: colors.text, fontSize: typography.size.xs }} weight="semiBold">
            {item.rating}
          </Text>
        </View>
      ) : null}

      <Text numberOfLines={1} style={{ color: colors.text, fontSize: typography.size.sm, fontWeight: 'bold' }}>
        {item.name}
      </Text>
      <Text
        numberOfLines={1}
        style={{ color: colors.mutedText, fontSize: typography.size.xs }}
      >
        {item.role}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  avatar: {
    alignItems: 'center',
    borderRadius: 28,
    height: 56,
    justifyContent: 'center',
    width: 56,
  },
  card: {
    alignItems: 'center',
    gap: 4,
    width: 72,
  },
  ratingPill: {
    alignItems: 'center',
    borderRadius: 999,
    flexDirection: 'row',
    gap: 4,
    marginTop: -20,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
});
