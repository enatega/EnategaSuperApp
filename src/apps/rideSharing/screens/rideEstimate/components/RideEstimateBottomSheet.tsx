import React, { memo } from 'react';
import { Dimensions, Pressable, ScrollView, StyleSheet, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../../../../../general/theme/theme';
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
  paymentMethodLabel: string;
  paymentMethodBadge?: React.ReactNode;
  onPaymentMethodPress: () => void;
  onEditFarePress: () => void;
  onIncreaseFare: () => void;
  onDecreaseFare: () => void;
  isDecreaseFareDisabled?: boolean;
  isLoading?: boolean;
  errorMessage?: string | null;
  onRetry?: () => void;
  isConfirmDisabled?: boolean;
};

function RideEstimateBottomSheet({
  options,
  selectedOptionId,
  onSelectOption,
  onConfirmRide,
  onBackPress,
  paymentMethodLabel,
  paymentMethodBadge,
  onPaymentMethodPress,
  onEditFarePress,
  onIncreaseFare,
  onDecreaseFare,
  isDecreaseFareDisabled = false,
  isLoading = false,
  errorMessage = null,
  onRetry,
  isConfirmDisabled = false,
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

  return (
    <SwipeableBottomSheet
      expandedHeight={expandedHeight}
      collapsedHeight={collapsedHeight + insets.bottom}
      floatingAccessory={(
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
      )}
      floatingAccessoryStyle={styles.backButtonFloating}
      style={[
        styles.sheet,
        {
          backgroundColor: colors.surface,
          paddingBottom: insets.bottom + 20,
          shadowColor: colors.shadowColor,
        },
      ]}
      handle={<View style={[styles.sheetHandle, { backgroundColor: colors.border }]} />}
      handleContainerStyle={styles.handleContainer}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
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
        ) : selectedOption ? (
          <RideEstimateSelectedOptionCard
            item={selectedOption}
            fare={selectedOption.fare}
            recommendedFare={selectedOption.recommendedFare}
            onEditPress={onEditFarePress}
            onIncreaseFare={onIncreaseFare}
            onDecreaseFare={onDecreaseFare}
            isDecreaseDisabled={isDecreaseFareDisabled}
          />
        ) : null}

        {!isLoading && !showErrorState ? (
          <>
            <View style={styles.list}>
              {remainingOptions.map((item) => (
                <RideEstimateOptionRow
                  key={item.id}
                  item={item}
                  fare={item.fare}
                  onPress={onSelectOption}
                />
              ))}
            </View>

            <View style={[styles.footer, { borderTopColor: colors.border }]}>
              <Pressable style={styles.footerRow}>
                <View style={styles.footerLabelRow}>
                  <Icon type="MaterialCommunityIcons" name="calendar-clock-outline" size={22} color={colors.text} />
                  <Text weight="medium">{t('ride_schedule_label')}</Text>
                </View>
                <Icon type="Feather" name="chevron-right" size={20} color={colors.text} />
              </Pressable>

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
                label={t('ride_find_button')}
                onPress={onConfirmRide}
                disabled={isConfirmDisabled}
                style={styles.confirmButton}
              />
            </View>
          </>
        ) : null}
      </ScrollView>
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
  handleContainer: {
    alignItems: 'center',
    paddingBottom: 12,
  },
  sheetHandle: {
    width: 40,
    height: 4,
    borderRadius: 999,
  },
  list: {
    paddingTop: 4,
  },
  errorWrap: {
    paddingHorizontal: 16,
    paddingBottom: 8,
  },
  backButtonFloating: {
    left: 16,
    top: -54,
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
  confirmButton: {
    borderRadius: 6,
    backgroundColor: '#1691BF',
    borderColor: '#1691BF',
  },
});
