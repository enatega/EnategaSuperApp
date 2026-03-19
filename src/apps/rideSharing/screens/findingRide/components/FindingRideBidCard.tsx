import React, { memo } from 'react';
import { Image, Pressable, StyleSheet, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { FindingRideBid } from '../types/bids';

function formatExpiry(expiresAt: string | undefined) {
  if (!expiresAt) {
    return undefined;
  }

  const expiresAtMs = Date.parse(expiresAt);
  if (Number.isNaN(expiresAtMs)) {
    return undefined;
  }

  const remainingSeconds = Math.max(Math.ceil((expiresAtMs - Date.now()) / 1000), 0);
  return `${remainingSeconds}s left`;
}

type Props = {
  bid: FindingRideBid;
  onPressDecline?: (bid: FindingRideBid) => void;
  onPressAccept?: (bid: FindingRideBid) => void;
};

function FindingRideBidCard({ bid, onPressDecline, onPressAccept }: Props) {
  const { colors } = useTheme();
  const fallbackMetaText = bid.status ?? formatExpiry(bid.expiresAt) ?? 'New bid';

  return (
    <View
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.findingRideBorderSoft,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.rowTop}>
          <View style={styles.profileBlock}>
            {bid.driverAvatarUri ? (
              <Image source={{ uri: bid.driverAvatarUri }} style={styles.avatar} />
            ) : (
              <View style={[styles.avatarFallback, { backgroundColor: colors.findingRideMutedSurface }]}>
                <Text weight="semiBold" style={[styles.avatarInitials, { color: colors.findingRideMutedText }]}>
                  {bid.driverName.slice(0, 1)}
                </Text>
              </View>
            )}

            <View style={styles.leftBlock}>
              <View style={styles.metaRow}>
                <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
                  {bid.driverName}
                </Text>
                {typeof bid.rating === 'number' ? (
                  <View style={styles.metaInline}>
                    <Ionicons name="star" size={16} color="#FBC02D" />
                    <Text style={[styles.metaText, { color: colors.text }]}>
                      {bid.rating.toFixed(2)}
                    </Text>
                  </View>
                ) : null}
                {typeof bid.driverRides === 'number' ? (
                  <Text style={[styles.metaText, { color: colors.mutedText }]}>
                    ({bid.driverRides.toLocaleString()} rides)
                  </Text>
                ) : null}
              </View>
              {bid.vehicleLabel ? (
                <Text style={[styles.vehicleText, { color: colors.text }]} numberOfLines={1}>
                  {bid.vehicleLabel}
                </Text>
              ) : (
                <Text style={[styles.vehicleText, { color: colors.mutedText }]} numberOfLines={1}>
                  {fallbackMetaText}
                </Text>
              )}
            </View>
          </View>

          <View style={styles.rightBlock}>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
              {typeof bid.etaMin === 'number' ? `${bid.etaMin} min` : fallbackMetaText}
            </Text>
            {typeof bid.distanceKm === 'number' ? (
              <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
                {`${bid.distanceKm.toFixed(1)} km`}
              </Text>
            ) : null}
          </View>
        </View>

        <Text weight="extraBold" style={[styles.amount, { color: colors.findingRidePrimary }]}>
          {formatRideCurrency(bid.amount)}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onPressDecline?.(bid)}
            style={[styles.declineButton, { backgroundColor: colors.backgroundTertiary }]}
          >
            <Text weight="medium" style={[styles.declineLabel, { color: colors.text }]}>
              Decline
            </Text>
          </Pressable>

          <Pressable
            onPress={() => onPressAccept?.(bid)}
            style={[styles.acceptButton, { backgroundColor: colors.findingRidePrimary }]}
          >
            <Text weight="medium" style={styles.acceptLabel}>
              Accept
            </Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

export default memo(FindingRideBidCard);

const styles = StyleSheet.create({
  card: {
    borderWidth: 1,
    borderRadius: 24,
    shadowOpacity: 0.1,
    shadowRadius: 3,
    shadowOffset: { width: 0, height: 1 },
    elevation: 4,
  },
  content: {
    paddingHorizontal: 13,
    paddingVertical: 10,
    gap: 14,
  },
  rowTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 10,
  },
  profileBlock: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  avatarFallback: {
    width: 42,
    height: 42,
    borderRadius: 21,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitials: {
    fontSize: 15,
    lineHeight: 20,
  },
  leftBlock: {
    flex: 1,
    gap: 0,
  },
  rightBlock: {
    alignItems: 'flex-end',
    justifyContent: 'flex-start',
    gap: 2,
  },
  driverName: {
    fontSize: 14,
    lineHeight: 22,
  },
  vehicleText: {
    fontSize: 14,
    lineHeight: 22,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flexWrap: 'nowrap',
  },
  metaInline: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: {
    fontSize: 14,
    lineHeight: 22,
  },
  metaTextStrong: {
    fontSize: 14,
    lineHeight: 22,
  },
  amount: {
    fontSize: 40,
    lineHeight: 38,
    letterSpacing: -0.5,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 10,
    width: '100%',
  },
  declineButton: {
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  declineLabel: {
    fontSize: 14,
    lineHeight: 22,
  },
  acceptButton: {
    height: 44,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
    width: 163.5,
  },
  acceptLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
