import React from 'react';
import { ScrollView, StyleSheet, Switch, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import ListStateView from '../filterablePaginatedList/ListStateView';
import { useTheme } from '../../../../general/theme/theme';
import type {
  CheckoutOrderType,
  CheckoutPreviewResponse,
} from '../../api/orderServiceTypes';
import CheckoutDeliveryTimeSection from './CheckoutDeliveryTimeSection';
import CheckoutHeader from './CheckoutHeader';
import CheckoutInfoRow from './CheckoutInfoRow';
import CheckoutModeTabs from './CheckoutModeTabs';
import CheckoutPaymentSection from './CheckoutPaymentSection';
import CheckoutSummaryFooter from './CheckoutSummaryFooter';
import CheckoutTipSection from './CheckoutTipSection';

type Props = {
  cashSubtitle?: string;
  deliveryTimeMode: 'standard' | 'schedule';
  hasAddressRequirement: boolean;
  isPickupEnabled: boolean;
  isPlacingOrder?: boolean;
  isPaymentBlocked?: boolean;
  isPreviewEnabled: boolean;
  isPreviewError: boolean;
  isPreviewPending: boolean;
  leaveAtDoor: boolean;
  onAddressPress: () => void;
  onBackPress: () => void;
  onDeliveryTimeModeChange: (mode: 'standard' | 'schedule') => void;
  onLeaveAtDoorChange: (value: boolean) => void;
  onOrderTypeChange: (mode: CheckoutOrderType) => void;
  onPlaceOrderPress: () => void;
  onPromoPress: () => void;
  onRetryPreview: () => void;
  onTipChange: (amount: number) => void;
  orderType: CheckoutOrderType;
  paymentErrorMessage?: string | null;
  preview: CheckoutPreviewResponse | null;
  selectedAddressLabel?: string | null;
  selectedTip: number;
  totalLabel: string;
};

export default function CheckoutScreenContent({
  cashSubtitle,
  deliveryTimeMode,
  hasAddressRequirement,
  isPickupEnabled,
  isPlacingOrder = false,
  isPaymentBlocked = false,
  isPreviewEnabled,
  isPreviewError,
  isPreviewPending,
  leaveAtDoor,
  onAddressPress,
  onBackPress,
  onDeliveryTimeModeChange,
  onLeaveAtDoorChange,
  onOrderTypeChange,
  onPlaceOrderPress,
  onPromoPress,
  onRetryPreview,
  onTipChange,
  orderType,
  paymentErrorMessage,
  preview,
  selectedAddressLabel,
  selectedTip,
  totalLabel,
}: Props) {
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const canPlaceOrder = Boolean(preview) && !hasAddressRequirement && !isPreviewPending && !isPaymentBlocked && !isPlacingOrder;
  const addressTitle = orderType === 'pickup'
    ? preview?.store.name ?? t('checkout_pickup_title')
    : selectedAddressLabel ?? preview?.fulfillment.delivery?.label ?? t('checkout_address_title');
  const addressSubtitle = orderType === 'pickup'
    ? preview?.fulfillment.pickup?.address ?? t('checkout_pickup_subtitle')
    : selectedAddressLabel
      ? preview?.fulfillment.delivery?.address ?? t('checkout_address_selected_subtitle')
      : t('checkout_address_subtitle');

  return (
    <View style={styles.container}>
      <CheckoutHeader onBackPress={onBackPress} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <CheckoutModeTabs
          activeMode={orderType}
          isDeliveryEnabled={true}
          isPickupEnabled={isPickupEnabled}
          onModeChange={onOrderTypeChange}
        />

        <CheckoutInfoRow
          title={addressTitle}
          subtitle={addressSubtitle}
          iconName="location-outline"
          onPress={orderType === 'delivery' ? onAddressPress : undefined}
        />

        <CheckoutInfoRow
          title={t('checkout_leave_at_door_title')}
          iconName="home-outline"
          rightAccessory={(
            <Switch
              onValueChange={onLeaveAtDoorChange}
              thumbColor={colors.white}
              trackColor={{ false: colors.border, true: colors.blue800 }}
              value={leaveAtDoor}
            />
          )}
        />

        <CheckoutInfoRow
          title={t('checkout_message_restaurant_title')}
          subtitle={t('checkout_message_restaurant_subtitle')}
          iconName="chatbox-ellipses-outline"
        />

        <CheckoutInfoRow
          title={t('checkout_message_courier_title')}
          subtitle={t('checkout_message_courier_subtitle')}
          iconName="chatbox-ellipses-outline"
        />

        <CheckoutDeliveryTimeSection
          isScheduleEnabled={preview?.schedule.scheduleAllowed ?? false}
          selectedMode={deliveryTimeMode}
          onSelectMode={onDeliveryTimeModeChange}
        />

        <CheckoutPaymentSection
          cashSubtitle={cashSubtitle}
          errorMessage={paymentErrorMessage}
          onPromoPress={onPromoPress}
        />

        <CheckoutTipSection
          selectedTip={selectedTip}
          onSelectTip={onTipChange}
        />

        {isPreviewEnabled && isPreviewPending ? (
          <ListStateView
            variant="loading"
            containerStyle={styles.stateBlock}
          />
        ) : null}

        {isPreviewEnabled && isPreviewError && !isPaymentBlocked ? (
          <ListStateView
            variant="error"
            title={t('checkout_preview_error_title')}
            description={t('checkout_preview_error_message')}
            actionLabel={t('generic_list_retry')}
            onActionPress={onRetryPreview}
            containerStyle={styles.stateBlock}
          />
        ) : null}
      </ScrollView>

      <CheckoutSummaryFooter
        isDisabled={!canPlaceOrder}
        isLoading={isPlacingOrder}
        onPlaceOrderPress={onPlaceOrderPress}
        orderType={orderType}
        pricing={preview?.pricing ?? null}
        totalLabel={totalLabel}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    gap: 4,
    paddingBottom: 24,
  },
  stateBlock: {
    minHeight: 180,
  },
});
