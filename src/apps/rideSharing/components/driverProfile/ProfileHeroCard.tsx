import React from 'react';
import { Ionicons } from '@expo/vector-icons';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import { useTheme } from '../../../../general/theme/theme';
import ProfileAvatar from './ProfileAvatar';
import { formatJoinYear } from './helpers';
import type { DriverProfileData } from './types';

type Props = {
  data: DriverProfileData;
};

export default function ProfileHeroCard({ data }: Props) {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const joinedLabel = formatJoinYear(data.joiningTime);

  return (
    <View style={styles.container}>
      <View style={styles.avatarWrap}>
        <ProfileAvatar uri={data.profile.profilePic} name={data.profile.name} size={96} />
      </View>

      <View style={styles.nameRow}>
        <Text
          weight="extraBold"
          style={{
            color: colors.text,
            fontSize: typography.size.h5,
            lineHeight: typography.lineHeight.h5,
          }}
        >
          {data.profile.name}
        </Text>
        <Ionicons name="checkmark-circle" size={20} color={colors.blue500} />
      </View>

      <View style={[styles.statsCard, { backgroundColor: colors.surfaceSoft, borderColor: colors.border }]}>
        <View style={styles.statColumn}>
          <Text weight="semiBold" style={[styles.statValue, { color: colors.text }]}>
            {data.totalRides}
          </Text>
          <Text weight="medium" style={[styles.statLabel, { color: colors.mutedText }]}>
            {t('driver_profile_label_rides')}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statColumn}>
          <Text weight="semiBold" style={[styles.statValue, { color: colors.text }]}>
            {joinedLabel}
          </Text>
          <Text weight="medium" style={[styles.statLabel, { color: colors.mutedText }]}>
            {t('driver_profile_label_joined_us')}
          </Text>
        </View>

        <View style={[styles.divider, { backgroundColor: colors.border }]} />

        <View style={styles.statColumn}>
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={16} color={colors.warning} />
            <Text weight="semiBold" style={[styles.statValue, { color: colors.text }]}>
              {data.averageRating}
            </Text>
          </View>
          <Text weight="medium" style={[styles.statLabel, { color: colors.mutedText }]}>
            {t('driver_profile_label_rating')}
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  avatarWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },
  divider: {
    height: 61,
    width: 1,
  },
  nameRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 8,
  },
  ratingRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  statColumn: {
    alignItems: 'center',
    flex: 1,
    justifyContent: 'center',
    minHeight: 86,
    paddingVertical: 12,
  },
  statLabel: {
    fontSize: 12,
    lineHeight: 18,
  },
  statValue: {
    fontSize: 18,
    lineHeight: 28,
  },
  statsCard: {
    alignItems: 'center',
    borderRadius: 12,
    borderWidth: 1,
    flexDirection: 'row',
    paddingHorizontal: 16,
    width: '100%',
  },
});
