import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../general/theme/theme';
import Text from '../../../../general/components/Text';
import ProfileAvatar from './ProfileAvatar';
import { formatJoinYear } from './helpers';
import type { DriverProfileData } from './types';

type Props = {
  data: DriverProfileData;
};

function StatCard({ value, label }: { value: string | number; label: string }) {
  const { colors } = useTheme();
  return (
    <View style={styles.statCard}>
      <Text
        variant="subtitle"
        weight="bold"
        style={{ fontVariant: ['tabular-nums'] as any }}
      >
        {value}
      </Text>
      <Text variant="caption" color={colors.mutedText}>
        {label}
      </Text>
    </View>
  );
}

export default function ProfileHeroCard({ data }: Props) {
  const { colors } = useTheme();
  const joinedLabel = formatJoinYear(data.joiningTime);

  return (
    <View style={[styles.heroCard, { backgroundColor: colors.surface }]}>
      {/* Avatar */}
      <View style={styles.avatarWrapper}>
        <ProfileAvatar uri={data.profile.profilePic} name={data.profile.name} size={90} />
      </View>

      {/* Name */}
      <Text variant="subtitle" weight="bold" style={styles.driverName}>
        {data.profile.name}
      </Text>

      {/* Vehicle pill */}
      <View style={[styles.vehiclePill, { backgroundColor: colors.cardSoft }]}>
        <Text variant="caption" weight="medium" color={colors.primary}>
          🚗  {data.vehicle.vehicleName}
        </Text>
        <View style={[styles.vehicleDivider, { backgroundColor: colors.border }]} />
        <Text variant="caption" weight="medium" color={colors.mutedText}>
          {data.vehicle.vehicleNo}  ·  {data.vehicle.vehicleColor}
        </Text>
      </View>

      {/* Stats row */}
      <View style={styles.statsRow}>
        <StatCard value={data.totalRides} label="Rides" />
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        <StatCard value={joinedLabel} label="Joined" />
        <View style={[styles.statDivider, { backgroundColor: colors.border }]} />
        {/* Rating stat — custom inline since it has a star icon */}
        <View style={styles.statCard}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
            <Text style={{ fontSize: 16, color: '#F59E0B' }}>★</Text>
            <Text
              variant="subtitle"
              weight="bold"
              style={{ fontVariant: ['tabular-nums'] as any }}
            >
              {data.averageRating}
            </Text>
          </View>
          <Text variant="caption" color={colors.mutedText}>
            Rating
          </Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  heroCard: {
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 20,
    gap: 12,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
  } as any,
  avatarWrapper: {
    borderRadius: 50,
    padding: 3,
    borderWidth: 3,
    borderColor: '#F59E0B',
  },
  driverName: {
    marginTop: 4,
  },
  vehiclePill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    gap: 10,
  },
  vehicleDivider: {
    width: 1,
    height: 14,
  },
  statsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    width: '100%',
    paddingHorizontal: 8,
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    gap: 2,
  },
  statDivider: {
    width: 1,
    height: 36,
    marginHorizontal: 12,
  },
});
