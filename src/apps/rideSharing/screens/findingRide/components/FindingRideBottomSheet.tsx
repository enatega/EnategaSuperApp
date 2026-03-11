import React, { memo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import AnimatedSweepBar from '../../../../../general/components/AnimatedSweepBar';
import Text from '../../../../../general/components/Text';
import Button from '../../../../../general/components/Button';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { RideOptionItem } from '../../../components/rideOptions/types';

type Props = {
  selectedRide: RideOptionItem;
  fare?: number;
  recommendedFare?: number;
  timeLeftSec: number;
  onIncreaseFare: () => void;
  onDecreaseFare: () => void;
  isDecreaseDisabled?: boolean;
  onCancelRide: () => void;
  onKeepSearching: () => void;
};

function FindingRideBottomSheet({
  fare,
  recommendedFare,
  timeLeftSec,
  onIncreaseFare,
  onDecreaseFare,
  isDecreaseDisabled = false,
  onCancelRide,
  onKeepSearching,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const trackWidth = Dimensions.get('window').width - 32;
  const expandedHeight = Math.min(screenHeight * 0.46, 360);
  const collapsedHeight = 182;
  const hasTimedOut = timeLeftSec <= 0;

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 16,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.handle, { backgroundColor: colors.findingRideHandle }]} />}
      handleContainerStyle={styles.handleContainer}
    >
      <ScrollView
        showsVerticalScrollIndicator={false}
        bounces={false}
        contentContainerStyle={styles.scrollContent}
      >
        <View style={styles.content}>
          <View style={styles.headerBlock}>
            <Text weight="extraBold" style={[styles.title, { color: colors.text }]}>
              {hasTimedOut
                ? t('ride_finding_timeout_title')
                : t('ride_finding_title')}
            </Text>

            <AnimatedSweepBar width={trackWidth} />
          </View>

          <View style={[styles.fareCard, { borderColor: colors.findingRideBorderSoft }]}>
            <Pressable
              onPress={onDecreaseFare}
              disabled={isDecreaseDisabled}
              style={[
                styles.adjustButton,
                { backgroundColor: colors.findingRideMutedSurface },
                isDecreaseDisabled ? styles.adjustButtonDisabled : null,
              ]}
            >
              <Text weight="medium" color={colors.findingRideMutedText} style={styles.adjustLabel}>
                -0.5
              </Text>
            </Pressable>

            <View style={styles.fareValueWrap}>
              <Text weight="extraBold" style={[styles.fareValue, { color: colors.findingRidePrimary }]}>
                {formatRideCurrency(fare)}
              </Text>
              {hasTimedOut ? (
                <Text color={colors.mutedText} style={styles.helperText}>
                  {t('ride_offer_fare_recommended', {
                    fare: formatRideCurrency(recommendedFare),
                  })}
                </Text>
              ) : null}
            </View>

            <Pressable
              onPress={onIncreaseFare}
              style={[styles.adjustButton, { backgroundColor: colors.findingRidePrimarySoft }]}
            >
              <Text weight="medium" color={colors.findingRidePrimary} style={styles.adjustLabel}>
                +0.5
              </Text>
            </Pressable>
          </View>

          <View style={styles.actions}>
            {hasTimedOut ? (
              <Button
                label={t('ride_finding_keep_searching')}
                onPress={onKeepSearching}
                style={[
                  styles.primaryButton,
                  {
                    backgroundColor: colors.findingRidePrimary,
                    borderColor: colors.findingRidePrimary,
                  },
                ]}
              />
            ) : null}

            <Button
              label={t('ride_finding_cancel')}
              onPress={onCancelRide}
              variant="secondary"
              style={[
                styles.secondaryButton,
                {
                  backgroundColor: colors.findingRideMutedSurface,
                  borderColor: colors.findingRideMutedSurface,
                },
              ]}
            />
          </View>
        </View>
      </ScrollView>
    </SwipeableBottomSheet>
  );
}

export default memo(FindingRideBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    shadowOpacity: 0.14,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: -3 },
    elevation: 8,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 12,
    paddingBottom: 12,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  scrollContent: {
    paddingBottom: 8,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 16,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    textAlign: 'center',
  },
  fareCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // borderTopWidth: 1,
    borderBottomWidth: 1,
    paddingBottom: 16,
    marginTop: 2,
    gap: 14,
  },
  adjustButton: {
    width: 58,
    height: 40,
    borderRadius: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  adjustButtonDisabled: {
    opacity: 0.55,
  },
  adjustLabel: {
    fontSize: 14,
    lineHeight: 18,
  },
  fareValueWrap: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  fareValue: {
    fontSize: 24,
    lineHeight: 30,
    letterSpacing: -0.3,
  },
  helperText: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
    textAlign: 'center',
  },
  actions: {
    gap: 10,
  },
  primaryButton: {
    borderRadius: 6,
  },
  secondaryButton: {
    borderRadius: 6,
  },
});
