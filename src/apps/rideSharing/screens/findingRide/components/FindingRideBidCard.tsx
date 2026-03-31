import React, { memo, useEffect, useRef } from 'react';
import { ActivityIndicator, Animated, Pressable, StyleSheet, View } from 'react-native';
import Text from '../../../../../general/components/Text';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { FindingRideBid } from '../types/bids';

const BID_VALIDITY_MS = 15_000;

type Props = {
  bid: FindingRideBid;
  onPressDecline?: (bid: FindingRideBid) => void;
  onPressAccept?: (bid: FindingRideBid) => void;
  isAccepting?: boolean;
  isDeclining?: boolean;
  isInteractionLocked?: boolean;
};

function FindingRideBidCard({
  bid,
  onPressDecline,
  onPressAccept,
  isAccepting = false,
  isDeclining = false,
  isInteractionLocked = false,
}: Props) {
  const { colors } = useTheme();
  const isBusy = isAccepting || isDeclining || isInteractionLocked;
  const remainingTimeMs = bid.remainingTimeMs ?? BID_VALIDITY_MS;
  const isExpired = remainingTimeMs <= 0;
  const fallbackMetaText = isExpired ? 'Expired' : `${Math.ceil(remainingTimeMs / 1000)}s left`;
  const statusLabel = bid.status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (character) => character.toUpperCase());
  const progress = useRef(new Animated.Value(Math.max(Math.min(remainingTimeMs / BID_VALIDITY_MS, 1), 0))).current;

  useEffect(() => {
    const normalizedProgress = Math.max(Math.min(remainingTimeMs / BID_VALIDITY_MS, 1), 0);
    const animationDurationMs = Math.max(remainingTimeMs, 0);

    progress.stopAnimation();
    progress.setValue(normalizedProgress);

    if (animationDurationMs <= 0) {
      return undefined;
    }

    const animation = Animated.timing(progress, {
      toValue: 0,
      duration: animationDurationMs,
      useNativeDriver: false,
    });

    animation.start();

    return () => {
      animation.stop();
    };
  }, [bid.expiresAt, bid.id, progress]);

  const progressWidth = progress.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

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
          <View style={styles.leftBlock}>
            <Text style={[styles.driverName, { color: colors.text }]} numberOfLines={1}>
              Driver offer
            </Text>
            <Text style={[styles.vehicleText, { color: colors.mutedText }]} numberOfLines={1}>
              {`Bid #${bid.id.slice(0, 8)}`}
            </Text>
          </View>

          <View style={styles.rightBlock}>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.text }]}>
              {statusLabel}
            </Text>
            <Text weight="semiBold" style={[styles.metaTextStrong, { color: colors.mutedText }]}>
              {fallbackMetaText}
            </Text>
          </View>
        </View>

        <Text weight="extraBold" style={[styles.amount, { color: colors.findingRidePrimary }]}>
          {formatRideCurrency(bid.price)}
        </Text>

        <View style={styles.actions}>
          <Pressable
            onPress={() => onPressDecline?.(bid)}
            disabled={isBusy || isExpired}
            style={[
              styles.declineButton,
              { backgroundColor: colors.backgroundTertiary },
              (isBusy || isExpired) ? styles.buttonDisabled : null,
            ]}
          >
            {isDeclining ? (
              <ActivityIndicator size="small" color={colors.text} />
            ) : (
              <Text weight="medium" style={[styles.declineLabel, { color: colors.text }]}>
                Decline
              </Text>
            )}
          </Pressable>

          <Pressable
            onPress={() => onPressAccept?.(bid)}
            disabled={isBusy || isExpired}
            style={[
              styles.acceptButton,
              { backgroundColor: colors.findingRidePrimary },
              (isBusy || isExpired) ? styles.buttonDisabled : null,
            ]}
          >
            <View style={styles.progressOverlayWrap}>
              <Animated.View
                style={[
                  styles.progressOverlay,
                  {
                    width: progressWidth,
                    backgroundColor: 'rgba(0,0,0,0.18)',
                  },
                ]}
              />
            </View>
            <Text weight="medium" style={styles.acceptLabel}>
              {isAccepting ? 'Accepting...' : isExpired ? 'Expired' : 'Accept'}
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
  leftBlock: {
    flex: 1,
    gap: 2,
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
  buttonDisabled: {
    opacity: 0.6,
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
    overflow: 'hidden',
  },
  progressOverlayWrap: {
    ...StyleSheet.absoluteFillObject,
  },
  progressOverlay: {
    height: '100%',
  },
  acceptLabel: {
    fontSize: 16,
    lineHeight: 24,
    color: '#FFFFFF',
  },
});
