import React, { memo } from 'react';
import { Dimensions, Pressable, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import AnimatedSweepBar from '../../../../../general/components/AnimatedSweepBar';
import Text from '../../../../../general/components/Text';
import Button from '../../../../../general/components/Button';
import { useTheme } from '../../../../../general/theme/theme';
import { formatRideCurrency } from '../../../utils/rideFormatting';
import type { RideOptionItem } from '../../../components/rideOptions/types';

export const FINDING_RIDE_BOTTOM_SHEET_COLLAPSED_HEIGHT = 120;

type Props = {
  selectedRide: RideOptionItem & {
    fare?: number;
    recommendedFare?: number;
  };
  findingTitle?: string;
  cancelLabel?: string;
  fare?: number;
  recommendedFare?: number;
  timeLeftSec: number;
  onIncreaseFare: () => void;
  onDecreaseFare: () => void;
  isIncreaseDisabled?: boolean;
  isDecreaseDisabled?: boolean;
  onCancelRide: () => void;
  onKeepSearching: () => void;
  isKeepSearchingLoading?: boolean;
  isCancelLoading?: boolean;
  floatingAccessory?: React.ReactNode;
};

function FindingRideBottomSheet({
  findingTitle,
  cancelLabel,
  fare,
  recommendedFare,
  timeLeftSec,
  onIncreaseFare,
  onDecreaseFare,
  isIncreaseDisabled = false,
  isDecreaseDisabled = false,
  onCancelRide,
  onKeepSearching,
  isKeepSearchingLoading = false,
  isCancelLoading = false,
  floatingAccessory,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenWidth = Dimensions.get('window').width;
  const trackWidth = screenWidth - 32;
  const collapsedHeight = FINDING_RIDE_BOTTOM_SHEET_COLLAPSED_HEIGHT;
  const expandedHeight = 332;
  const expandedSheetHeight = expandedHeight + insets.bottom;
  const collapsedSheetHeight = collapsedHeight + insets.bottom;
  const hasTimedOut = timeLeftSec <= 0;
  const effectiveFare = fare ?? recommendedFare ?? 0;

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedSheetHeight}
      collapsedHeight={collapsedSheetHeight}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 10,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.handle, { backgroundColor: colors.findingRideHandle }]} />}
      handleContainerStyle={styles.handleContainer}
      floatingAccessory={floatingAccessory}
      floatingAccessoryStyle={[
        styles.floatingAccessory,
        { bottom: expandedSheetHeight + 12 },
      ]}
    >
      <View style={styles.content}>
        <View style={styles.headerBlock}>
          <Text weight="extraBold" style={[styles.title, { color: colors.text }]}>
            {hasTimedOut ? t('ride_finding_timeout_title') : (findingTitle ?? t('ride_finding_driver_title'))}
          </Text>

          <AnimatedSweepBar width={trackWidth} />
        </View>

        <View style={[styles.fareRow, { borderBottomColor: colors.findingRideBorderSoft }]}>
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
              {formatRideCurrency(effectiveFare)}
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
            disabled={isIncreaseDisabled}
            style={[
              styles.adjustButton,
              { backgroundColor: colors.findingRidePrimarySoft },
              isIncreaseDisabled ? styles.adjustButtonDisabled : null,
            ]}
          >
            <Text weight="medium" color={colors.findingRidePrimary} style={styles.adjustLabel}>
              +0.5
            </Text>
          </Pressable>
        </View>

        {hasTimedOut ? (
          <Button
            label={t('ride_finding_keep_searching')}
            onPress={onKeepSearching}
            isLoading={isKeepSearchingLoading}
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
          label={cancelLabel ?? t('ride_finding_cancel')}
          onPress={onCancelRide}
          isLoading={isCancelLoading}
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
  floatingAccessory: {
    left: 16,
    right: 16,
    zIndex: 25,
    elevation: 6,
  },
  handleContainer: {
    alignItems: 'center',
    paddingTop: 10,
    paddingBottom: 8,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  content: {
    paddingHorizontal: 16,
    gap: 16,
    paddingBottom: 16,
  },
  headerBlock: {
    alignItems: 'center',
    gap: 14,
  },
  title: {
    fontSize: 17,
    lineHeight: 22,
    letterSpacing: -0.2,
    textAlign: 'center',
    marginTop: 4,
  },
  fareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    paddingTop: 2,
    paddingBottom: 16,
    gap: 12,
  },
  adjustButton: {
    width: 62,
    height: 44,
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
    fontSize: 21,
    lineHeight: 28,
    letterSpacing: -0.3,
  },
  helperText: {
    fontSize: 11,
    lineHeight: 15,
    marginTop: 4,
    textAlign: 'center',
  },
  primaryButton: {
    borderRadius: 6,
    minHeight: 44,
  },
  secondaryButton: {
    borderRadius: 6,
    minHeight: 44,
  },
});
