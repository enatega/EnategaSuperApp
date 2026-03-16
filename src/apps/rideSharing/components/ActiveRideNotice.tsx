import React, { memo } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Icon from '../../../general/components/Icon';
import Text from '../../../general/components/Text';
import { useTheme } from '../../../general/theme/theme';
import { useActiveRideStore } from '../stores/useActiveRideStore';

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return null;
  }

  return value as Record<string, unknown>;
}

function readString(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim().length > 0 ? value.trim() : undefined;
}

function isSearchingStatus(status: string) {
  const normalizedStatus = status.trim().toUpperCase();
  return normalizedStatus === 'REQUESTED' || normalizedStatus === 'PENDING';
}

function ActiveRideNotice() {
  const { colors, typography } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const activeRide = useActiveRideStore((state) => state.activeRide);
  const rootRecord = asRecord(activeRide);
  const rideRecord = rootRecord ? asRecord(rootRecord.rideReq) ?? rootRecord : null;
  const pickup = rideRecord ? asRecord(rideRecord.pickup) : null;
  const dropoff = rideRecord ? asRecord(rideRecord.dropoff) : null;
  const pickupLabel = pickup
    ? readString(pickup.location) ?? readString(pickup.address)
    : undefined;
  const resolvedPickupLabel = pickupLabel
    ?? (rideRecord ? readString(rideRecord.pickup_location) ?? readString(rideRecord.pickup_address) : undefined);
  const dropoffLabel = dropoff
    ? readString(dropoff.location) ?? readString(dropoff.address)
    : undefined;
  const resolvedDropoffLabel = dropoffLabel
    ?? (rideRecord
      ? readString(rideRecord.dropoff_location)
        ?? readString(rideRecord.destination_address)
        ?? readString(rideRecord.dropoff_address)
      : undefined);
  const status = rideRecord
    ? readString(rideRecord.ride_status) ?? readString(rideRecord.status) ?? 'REQUESTED'
    : undefined;

  if (!resolvedPickupLabel || !resolvedDropoffLabel || !status) {
    return null;
  }

  const searching = isSearchingStatus(status);

  return (
    <View style={styles.container}>
      <View
        style={[
          styles.bar,
          {
            backgroundColor: searching ? 'rgba(232, 246, 255, 0.82)' : 'rgba(234, 251, 241, 0.82)',
            borderBottomColor: searching ? 'rgba(185, 227, 247, 0.9)' : 'rgba(191, 231, 206, 0.9)',
            paddingTop: insets.top + 6,
          },
        ]}
      >
        <View
          style={[
            styles.iconWrap,
            { backgroundColor: searching ? 'rgba(22,145,191,0.14)' : 'rgba(22,163,74,0.14)' },
          ]}
        >
          <Icon
            type="MaterialCommunityIcons"
            name={searching ? 'car-search' : 'car-connected'}
            size={18}
            color={searching ? '#1677A4' : '#15803D'}
          />
        </View>

        <View style={styles.content}>
          <Text weight="semiBold" style={[styles.title, { color: colors.text, fontSize: typography.size.sm2 }]}>
            {searching ? t('ride_active_notice_searching_title') : t('ride_active_notice_live_title')}
          </Text>
          <Text color={colors.mutedText} style={[styles.subtitle, { fontSize: typography.size.xs2 }]}>
            {`${resolvedPickupLabel} -> ${resolvedDropoffLabel}`}
          </Text>
        </View>
      </View>
    </View>
  );
}

export default memo(ActiveRideNotice);

const styles = StyleSheet.create({
  container: {
    overflow: 'hidden',
  },
  bar: {
    width: '100%',
    paddingHorizontal: 16,
    paddingBottom: 10,
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
  },
  iconWrap: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  content: {
    flex: 1,
  },
  title: {
    lineHeight: 18,
    marginBottom: 2,
  },
  subtitle: {
    lineHeight: 16,
  },
});
