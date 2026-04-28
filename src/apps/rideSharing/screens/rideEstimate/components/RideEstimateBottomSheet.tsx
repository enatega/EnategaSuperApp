import React, { memo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
import BottomSheetHandle from '../../../../../general/components/BottomSheetHandle';
import SwipeableBottomSheet from '../../../../../general/components/SwipeableBottomSheet';
import Text from '../../../../../general/components/Text';
import Icon from '../../../../../general/components/Icon';
import Button from '../../../../../general/components/Button';
import type { RideOptionItem } from '../../../components/rideOptions/types';
import RideEstimateStatusCard from '../../../components/rideEstimate/RideEstimateStatusCard';
import RideEstimateBottomSheetSkeleton from './RideEstimateBottomSheetSkeleton';
import RideEstimateSelectedOptionCard from './RideEstimateSelectedOptionCard';
import RideEstimateOptionRow from './RideEstimateOptionRow';

type RideEstimateFareOption = RideOptionItem & {
  fare?: number;
  recommendedFare?: number;
};

type Props = {
  options: RideEstimateFareOption[];
  selectedOptionId: RideOptionItem['id'];
  onSelectOption: (id: RideOptionItem['id']) => void;
  onConfirmRide: () => void;
  onBackPress: () => void;
  floatingStatusCard?: React.ReactNode;
  paymentMethodLabel: string;
  paymentMethodBadge?: React.ReactNode;
  onPaymentMethodPress: () => void;
  selectedOptionMetaLabel?: string;
  isCourierFlow?: boolean;
  courierCommentLabel?: string;
  onCourierDetailsPress?: () => void;
  confirmButtonLabel?: string;
  scheduleLabel: string;
  hasScheduledRide: boolean;
  onSchedulePress: () => void;
  onClearSchedule: () => void;
  onEditFarePress: () => void;
  onIncreaseFare: () => void;
  onDecreaseFare: () => void;
  isDecreaseFareDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  isConfirmDisabled?: boolean;
  isConfirmLoading?: boolean;
  onHeightChange?: (height: number) => void;
};

function RideEstimateBottomSheet({
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmRide,
  onBackPress,
  floatingStatusCard,
  paymentMethodLabel,
  paymentMethodBadge,
  onPaymentMethodPress,
  selectedOptionMetaLabel,
  isCourierFlow = false,
  courierCommentLabel,
  onCourierDetailsPress,
  confirmButtonLabel,
  scheduleLabel,
  hasScheduledRide,
  onSchedulePress,
  onClearSchedule,
  onEditFarePress,
  onIncreaseFare,
  onDecreaseFare,
  isDecreaseFareDisabled = false,
  isLoading = false,
  errorMessage = null,
  onRetry,
  isConfirmDisabled = false,
  isConfirmLoading = false,
  onHeightChange,
}: Props) {
  const { colors } = useTheme();
  const { t } = useTranslation('rideSharing');
  const insets = useSafeAreaInsets();
  const screenHeight = Dimensions.get('window').height;
  const expandedHeight = Math.min(screenHeight * 0.54, 450);
  const collapsedHeight = 128;
  const selectedOption = options.find((item) => item.id === selectedOptionId) ?? options[0];
  const remainingOptions = options.filter((item) => item.id !== selectedOption?.id);
  const showErrorState = Boolean(errorMessage);
  const hasFloatingStatusCard = Boolean(floatingStatusCard);

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      floatingAccessory={(
        <View style={styles.floatingAccessoryContent}>
          <Pressable
            onPress={onBackPress}
            style={[
              styles.backButton,
              {
                backgroundColor: colors.surface,
                borderColor: colors.border,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Icon type="Ionicons" name="arrow-back" size={22} color={colors.text} />
          </Pressable>
          {floatingStatusCard ? (
            <View style={styles.floatingStatusCardWrap}>{floatingStatusCard}</View>
          ) : null}
        </View>
      )}
      floatingAccessoryStyle={[
        styles.floatingAccessory,
        hasFloatingStatusCard ? styles.floatingAccessoryWithAlert : styles.floatingAccessoryDefault,
      ]}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<BottomSheetHandle color={colors.border} />}
      onHeightChange={onHeightChange}
    >
      <View style={styles.content}>
        {isLoading ? (
          <RideEstimateBottomSheetSkeleton />
        ) : showErrorState ? (
          <View style={styles.errorWrap}>
            <RideEstimateStatusCard
              title={t('ride_estimate_quote_error_title')}
              message={errorMessage ?? t('ride_estimate_quote_error_description')}
              actionLabel={t('ride_estimate_retry')}
              onActionPress={onRetry}
            />
          </View>
        ) : null}

        {!isLoading && !showErrorState ? (
          <>
            <ScrollView
              style={styles.listScroll}
              contentContainerStyle={styles.list}
              showsVerticalScrollIndicator={false}
            >
              {selectedOption ? (
                <RideEstimateSelectedOptionCard
                  item={selectedOption}
                  fare={selectedOption.fare}
                  recommendedFare={selectedOption.recommendedFare}
                  metaLabel={selectedOptionMetaLabel}
                  onEditPress={onEditFarePress}
                  onIncreaseFare={onIncreaseFare}
                  onDecreaseFare={onDecreaseFare}
                  isDecreaseDisabled={isDecreaseFareDisabled}
                />
              ) : null}

              {remainingOptions.map((item) => (
                <RideEstimateOptionRow
                  key={item.id}
                  item={item}
                  fare={item.fare}
                  onPress={onSelectOption}
                />
              ))}
            </ScrollView>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              {isCourierFlow ? (
                <Pressable style={styles.footerRow} onPress={onCourierDetailsPress}>
                  <View style={styles.footerLabelRow}>
                    <Icon type="MaterialCommunityIcons" name="message-text-outline" size={22} color={colors.text} />
                    <Text weight="medium">{courierCommentLabel ?? t('ride_courier_comment_label')}</Text>
                  </View>
                  <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
                </Pressable>
              ) : (
                <Pressable style={styles.footerRow} onPress={onSchedulePress}>
                  <View style={styles.footerLabelRow}>
                    <Icon type="MaterialCommunityIcons" name="calendar-clock-outline" size={22} color={colors.text} />
                    <Text weight="medium">{scheduleLabel}</Text>
                  </View>
                  {hasScheduledRide ? (
                    <Pressable
                      onPress={onClearSchedule}
                      hitSlop={8}
                      accessibilityRole="button"
                      accessibilityLabel={t('ride_schedule_remove')}
                      style={[styles.clearScheduleButton, { backgroundColor: colors.backgroundTertiary }]}
                    >
                      <Icon type="Feather" name="x" size={16} color={colors.mutedText} />
                    </Pressable>
                  ) : (
                    <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
                  )}
                </Pressable>
              )}

              <Pressable style={styles.footerRow} onPress={onPaymentMethodPress}>
                <View style={styles.footerLabelRow}>
                  {paymentMethodBadge ?? (
                    <Icon type="MaterialCommunityIcons" name="cash-multiple" size={22} color={colors.text} />
                  )}
                  <Text weight="medium">{paymentMethodLabel}</Text>
                </View>
                <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
              </Pressable>

              <Button
                label={confirmButtonLabel ?? (hasScheduledRide ? t('ride_schedule_confirm_button') : t('ride_find_button'))}
                onPress={onConfirmRide}
                disabled={isConfirmDisabled}
                isLoading={isConfirmLoading}
                style={styles.confirmButton}
              />
            </View>
          </>
        ) : null}
      </View>
    </SwipeableBottomSheet>
  );
}

export default memo(RideEstimateBottomSheet);

const styles = StyleSheet.create({
  sheet: {
    paddingTop: 16,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowOpacity: 0.16,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  content: {
    flex: 1,
  },
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  listScroll: {
    flex: 1,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  list: {
    paddingTop: 4,
    paddingBottom: 12,
  },
  errorWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  floatingAccessory: {
    left: 16,
    right: 16,
  },
  floatingAccessoryDefault: {
    top: -54,
  },
  floatingAccessoryWithAlert: {
    top: -185,
  },
  floatingAccessoryContent: {
    gap: 12,
    alignItems: 'flex-start',
  },
  floatingStatusCardWrap: {
    width: '100%',
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOpacity: 0.12,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  footer: {
    borderTopWidth: 1,
    paddingHorizontal: 16,
    paddingTop: 12,
    gap: 16,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  footerLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  clearScheduleButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    borderRadius: 6,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});
