import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import AddressSelectionBottomSheet from '../../../../general/components/address/AddressSelectionBottomSheet';
import useSavedAddresses from '../../../../general/hooks/useSavedAddresses';
import type {
  CheckoutOrderType,
  CheckoutPaymentMethod,
} from '../../api/orderServiceTypes';
import type { CartResponse } from '../../api/cartServiceTypes';
import CheckoutScreenContent from '../../components/checkout/CheckoutScreenContent';
import CartScreenErrorState from '../../components/cart/CartScreenErrorState';
import CartScreenSkeleton from '../../components/cart/CartScreenSkeleton';
import useAddress from '../../../../general/hooks/useAddress';
import useSelectSavedAddress from '../../../../general/hooks/useSelectSavedAddress';
import { useCart } from '../../hooks/useCart';
import { useCheckoutPreview } from '../../hooks/useCheckoutPreview';
import { formatCartPrice } from '../../components/cart/cartUtils';
import { formatDeliveryAddressLabel } from '../../../../general/utils/address';
import { usePlaceOrder } from '../../hooks/usePlaceOrder';
import CheckoutMessageEditorScreen from '../../components/checkout/CheckoutMessageEditorScreen';
import CheckoutCustomTipScreen from '../../components/checkout/CheckoutCustomTipScreen';
import {
  buildCustomerNote,
  clampCheckoutMessageLength,
  type CheckoutMessages,
  type CheckoutMessageTarget,
} from '../../components/checkout/checkoutMessageUtils';
import CheckoutScheduleScreen from '../../components/checkout/CheckoutScheduleScreen';
import {
  isCheckoutScheduledAtInFuture,
  type CheckoutDeliveryTimeMode,
} from '../../components/checkout/checkoutScheduleUtils';
import CheckoutPaymentMethodScreen from '../../components/checkout/CheckoutPaymentMethodScreen';
import {
  getCheckoutPaymentMethodSubtitle,
  getCheckoutPaymentMethodTitle,
  getPreferredCheckoutPaymentMethod,
  isCheckoutPaymentMethodAvailable,
} from '../../components/checkout/checkoutPaymentUtils';
import StripePaymentWebView from '../../../../general/components/StripePaymentWebView';
import {
  CHECKOUT_STRIPE_CANCEL_URL,
  CHECKOUT_STRIPE_CANCEL_MATCHER,
  CHECKOUT_STRIPE_SUCCESS_URL,
  CHECKOUT_STRIPE_SUCCESS_MATCHER,
  getLatestStripeCheckoutOrderId,
} from '../../components/checkout/checkoutStripeOrderUtils';
import { deliveryKeys } from '../../api/queryKeys';

const DELIVERY_ROOT_ROUTES = ['SingleVendor', 'MultiVendor', 'Chain'] as const;

function getCheckoutRootRoute(
  navigation: NavigationProp<Record<string, object | undefined>>,
): (typeof DELIVERY_ROOT_ROUTES)[number] {
  const routes = navigation.getState().routes;

  for (let index = routes.length - 1; index >= 0; index -= 1) {
    const routeName = routes[index]?.name;

    if (DELIVERY_ROOT_ROUTES.includes(routeName as (typeof DELIVERY_ROOT_ROUTES)[number])) {
      return routeName as (typeof DELIVERY_ROOT_ROUTES)[number];
    }
  }

  return 'MultiVendor';
}

function getPreviewInput(
  cart: CartResponse | undefined,
  orderType: CheckoutOrderType,
  selectedAddressId?: string,
  scheduledAt?: string,
  riderTip?: number,
) {
  if (!cart?.bucketId || !cart.storeId) {
    return null;
  }

  if (orderType === 'delivery' && !selectedAddressId) {
    return null;
  }

  return {
    storeId: cart.storeId,
    bucketId: cart.bucketId,
    orderType,
    addressId: orderType === 'delivery' ? selectedAddressId : undefined,
    scheduledAt,
    riderTip: riderTip && riderTip > 0 ? riderTip : undefined,
  };
}

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const queryClient = useQueryClient();
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [activeMessageTarget, setActiveMessageTarget] = React.useState<CheckoutMessageTarget | null>(null);
  const [isAddressSheetVisible, setIsAddressSheetVisible] = React.useState(false);
  const [isPaymentMethodScreenVisible, setIsPaymentMethodScreenVisible] = React.useState(false);
  const [isScheduleScreenVisible, setIsScheduleScreenVisible] = React.useState(false);
  const [isCustomTipScreenVisible, setIsCustomTipScreenVisible] = React.useState(false);
  const [stripeCheckout, setStripeCheckout] = React.useState<{
    checkoutUrl: string;
  } | null>(null);
  const { selectedAddress } = useAddress();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses("deliveries");
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress("deliveries");
  const [orderType, setOrderType] = React.useState<CheckoutOrderType>('delivery');
  const [leaveAtDoor, setLeaveAtDoor] = React.useState(false);
  const [deliveryTimeMode, setDeliveryTimeMode] = React.useState<CheckoutDeliveryTimeMode>('standard');
  const [scheduledAt, setScheduledAt] = React.useState<string | null>(null);
  const [paymentMethod, setPaymentMethod] = React.useState<CheckoutPaymentMethod>('cod');
  const [messages, setMessages] = React.useState<CheckoutMessages>({
    restaurant: '',
    courier: '',
  });
  const [selectedTip, setSelectedTip] = React.useState(0);
  const [customTipValue, setCustomTipValue] = React.useState('');
  const {
    data: cart,
    isPending: isCartPending,
    error: cartError,
    refetch: refetchCart,
  } = useCart();
  const previewScheduledAt = deliveryTimeMode === 'schedule' ? scheduledAt ?? undefined : undefined;
  const previewInput = React.useMemo(
    () => getPreviewInput(cart, orderType, selectedAddress?.id, previewScheduledAt, selectedTip),
    [cart, orderType, selectedAddress?.id, previewScheduledAt, selectedTip],
  );
  const {
    data: preview,
    error: previewError,
    isPending: isPreviewPending,
    isError: isPreviewError,
    refetch: refetchPreview,
  } = useCheckoutPreview(previewInput);

  const navigateToOrderDetails = React.useCallback((orderId: string) => {
    const rootRouteName = getCheckoutRootRoute(navigation);

    navigation.reset({
      index: 1,
      routes: [
        {
          name: rootRouteName,
        },
        {
          name: 'OrderDetailsScreen',
          params: {
            orderId,
          },
        },
      ],
    } as never);
  }, [navigation]);

  const placeOrderMutation = usePlaceOrder({
    onError: () => {
      showToast.error(t('checkout_place_order_error'));
    },
    onSuccess: (response) => {
      if (response.mode === 'stripe') {
        if (!response.checkoutUrl) {
          showToast.error(t('checkout_payment_card_redirect_error'));
          return;
        }

        setStripeCheckout({
          checkoutUrl: response.checkoutUrl,
        });
        return;
      }

      showToast.success(t('checkout_place_order_success'));
      navigateToOrderDetails(response.orderId);
    },
  });

  React.useEffect(() => {
    if (!preview?.store) {
      return;
    }

    if (orderType === 'pickup' && !preview.store.pickupAllowed) {
      setOrderType('delivery');
    }
  }, [orderType, preview?.store]);

  React.useEffect(() => {
    if (!preview?.store) {
      return;
    }

    if (isCheckoutPaymentMethodAvailable(paymentMethod, preview.store)) {
      return;
    }

    setPaymentMethod(getPreferredCheckoutPaymentMethod(preview.store));
  }, [paymentMethod, preview?.store]);

  React.useEffect(() => {
    if (orderType !== 'pickup') {
      return;
    }

    setLeaveAtDoor(false);
    setSelectedTip(0);
    setCustomTipValue('');
    setIsCustomTipScreenVisible(false);
    setMessages((currentMessages) => {
      if (!currentMessages.courier) {
        return currentMessages;
      }

      return {
        ...currentMessages,
        courier: '',
      };
    });
  }, [orderType]);

  React.useEffect(() => {
    if (preview?.schedule.scheduleAllowed === false && deliveryTimeMode === 'schedule') {
      setDeliveryTimeMode('standard');
      setScheduledAt(null);
    }
  }, [deliveryTimeMode, preview?.schedule.scheduleAllowed]);

  React.useEffect(() => {
    if (
      deliveryTimeMode !== 'schedule' ||
      !scheduledAt ||
      !previewError?.message?.toLowerCase().includes('scheduledat must be in the future')
    ) {
      return;
    }

    setDeliveryTimeMode('standard');
    setScheduledAt(null);
    showToast.info(t('checkout_schedule_slot_expired'));
  }, [deliveryTimeMode, previewError?.message, scheduledAt, t]);

  const handleBackPress = React.useCallback(() => {
    navigation.goBack();
  }, [navigation]);

  const handleAddressPress = React.useCallback(() => {
    setIsAddressSheetVisible(true);
  }, []);

  const handleCloseAddressSheet = React.useCallback(() => {
    setIsAddressSheetVisible(false);
  }, []);

  const handleSelectAddress = React.useCallback(
    async (address: (typeof addresses)[number]) => {
      try {
        const isSelected = await selectSavedAddress(address.id);

        if (!isSelected) {
          return;
        }

        void refetchAddresses();
        setIsAddressSheetVisible(false);
      } catch {
        showToast.error(t('address_select_error'));
      }
    },
    [addresses, refetchAddresses, selectSavedAddress, t],
  );

  const handleAddAddressPress = React.useCallback(() => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressSearch', {
      appPrefix: 'deliveries',
      origin: 'checkout',
    });
  }, [navigation]);

  const handleUseCurrentLocation = React.useCallback(() => {
    setIsAddressSheetVisible(false);
    navigation.navigate('AddressChooseOnMap', {
      appPrefix: 'deliveries',
      origin: 'checkout',
    });
  }, [navigation]);

  const handlePlaceOrderPress = React.useCallback(() => {
    if (!cart?.bucketId || !cart.storeId) {
      return;
    }

    if (orderType === 'delivery' && !selectedAddress?.id) {
      showToast.error(t('checkout_address_required'));
      return;
    }

    const payload = {
      storeId: cart.storeId,
      bucketId: cart.bucketId,
      orderType,
      paymentMethod,
      addressId: orderType === 'delivery' ? selectedAddress?.id : undefined,
      customerNote: buildCustomerNote({
        restaurant: messages.restaurant,
        courier: orderType === 'delivery' ? messages.courier : '',
      }),
      riderTip: orderType === 'delivery' && selectedTip > 0 ? selectedTip : undefined,
      scheduledAt: deliveryTimeMode === 'schedule' ? scheduledAt ?? undefined : undefined,
      successUrl: paymentMethod === 'stripe' ? CHECKOUT_STRIPE_SUCCESS_URL : undefined,
      cancelUrl: paymentMethod === 'stripe' ? CHECKOUT_STRIPE_CANCEL_URL : undefined,
    };

    void placeOrderMutation.mutateAsync(payload).catch(() => {
      // Toast feedback is handled by the mutation callbacks.
    });
  }, [
    cart?.bucketId,
    cart?.storeId,
    orderType,
    paymentMethod,
    placeOrderMutation,
    selectedAddress?.id,
    messages,
    deliveryTimeMode,
    scheduledAt,
    selectedTip,
    t,
  ]);

  const handlePromoPress = React.useCallback(() => {
    showToast.info(t('checkout_promo_pending'));
  }, [t]);

  const handleStripeCheckoutBackPress = React.useCallback(() => {
    setStripeCheckout(null);
  }, []);

  const handleStripeCheckoutCancel = React.useCallback(() => {
    setStripeCheckout(null);
    showToast.info(t('checkout_payment_cancelled'));
  }, [t]);

  const handleStripeCheckoutSuccess = React.useCallback(async () => {
    try {
      const orderId = await getLatestStripeCheckoutOrderId(
        deliveryTimeMode === 'schedule',
      );

      if (orderId) {
        showToast.success(t('checkout_place_order_success'));
        navigateToOrderDetails(orderId);
        void Promise.all([
          queryClient.invalidateQueries({ queryKey: deliveryKeys.cart() }),
          queryClient.invalidateQueries({ queryKey: deliveryKeys.cartCount() }),
          queryClient.invalidateQueries({ queryKey: deliveryKeys.orders() }),
        ]);
        return;
      }
    } catch {
      // Fall back to the delivery root if the latest order cannot be resolved.
    }

    setStripeCheckout(null);
    navigation.reset({
      index: 0,
      routes: [
        {
          name: getCheckoutRootRoute(navigation),
        },
      ],
    } as never);
  }, [deliveryTimeMode, navigateToOrderDetails, navigation, queryClient, t]);

  const handlePaymentMethodPress = React.useCallback(() => {
    setIsPaymentMethodScreenVisible(true);
  }, []);

  const handlePaymentMethodConfirm = React.useCallback((nextPaymentMethod: CheckoutPaymentMethod) => {
    setPaymentMethod(nextPaymentMethod);
    setIsPaymentMethodScreenVisible(false);
  }, []);

  const handleDeliveryTimeModeChange = React.useCallback((mode: CheckoutDeliveryTimeMode) => {
    if (mode === 'schedule') {
      setIsScheduleScreenVisible(true);
      return;
    }

    setDeliveryTimeMode('standard');
  }, []);

  const handleScheduleConfirm = React.useCallback((nextScheduledAt: string) => {
    if (!isCheckoutScheduledAtInFuture(nextScheduledAt)) {
      showToast.info(t('checkout_schedule_slot_expired'));
      return;
    }

    setScheduledAt(nextScheduledAt);
    setDeliveryTimeMode('schedule');
    setIsScheduleScreenVisible(false);
  }, [t]);

  const handleMessagePress = React.useCallback((target: CheckoutMessageTarget) => {
    setActiveMessageTarget(target);
  }, []);

  const handleCustomTipPress = React.useCallback(() => {
    setCustomTipValue(selectedTip > 0 ? selectedTip.toFixed(2) : '');
    setIsCustomTipScreenVisible(true);
  }, [selectedTip]);

  const handleCustomTipValueChange = React.useCallback((value: string) => {
    const normalizedValue = value.replace(',', '.');
    const numericValue = normalizedValue.replace(/[^0-9.]/g, '');
    const [integerPart = '', ...decimalParts] = numericValue.split('.');

    if (decimalParts.length === 0) {
      setCustomTipValue(integerPart);
      return;
    }

    const mergedDecimalPart = decimalParts.join('').slice(0, 2);
    setCustomTipValue(`${integerPart}.${mergedDecimalPart}`);
  }, []);

  const handleCustomTipSave = React.useCallback(() => {
    const parsedTip = Number.parseFloat(customTipValue);

    if (!Number.isFinite(parsedTip) || parsedTip <= 0) {
      return;
    }

    setSelectedTip(parsedTip);
    setIsCustomTipScreenVisible(false);
  }, [customTipValue]);

  const handleCloseCustomTipScreen = React.useCallback(() => {
    setIsCustomTipScreenVisible(false);
  }, []);

  const handleCloseMessageScreen = React.useCallback(() => {
    setActiveMessageTarget(null);
  }, []);

  const handleMessageChange = React.useCallback(
    (target: CheckoutMessageTarget, value: string) => {
      setMessages((currentMessages) => ({
        ...currentMessages,
        [target]: clampCheckoutMessageLength(value),
      }));
    },
    [],
  );

  if (isCartPending && !cart) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <CartScreenSkeleton />
      </View>
    );
  }

  if (!cart || cartError || cart.isEmpty) {
    return (
      <View style={{ backgroundColor: colors.background, flex: 1 }}>
        <CartScreenErrorState
          onRetry={() => {
            void refetchCart();
          }}
        />
      </View>
    );
  }

  const previewTotal = preview?.pricing.totalAmount ?? cart.finalPrice;
  const selectedAddressLabel = formatDeliveryAddressLabel(selectedAddress);
  const paymentIconName = paymentMethod === 'stripe' ? 'card-outline' : 'cash-outline';
  const paymentTitle = getCheckoutPaymentMethodTitle(paymentMethod, t);
  const paymentSubtitle = getCheckoutPaymentMethodSubtitle(paymentMethod, t);
  const isPaymentAvailable = isCheckoutPaymentMethodAvailable(
    paymentMethod,
    preview?.store,
  );
  const paymentErrorMessage = !isPaymentAvailable
    ? paymentMethod === 'stripe'
      ? t('checkout_payment_card_unavailable_error')
      : t('checkout_payment_cod_unavailable_error')
    : null;

  if (stripeCheckout) {
    return (
      <StripePaymentWebView
        cancelUrlMatcher={CHECKOUT_STRIPE_CANCEL_MATCHER}
        checkoutUrl={stripeCheckout.checkoutUrl}
        onBackPress={handleStripeCheckoutBackPress}
        onPaymentCancel={handleStripeCheckoutCancel}
        onPaymentFailure={() => {
          showToast.error(t('checkout_payment_failed'));
        }}
        onPaymentSuccess={handleStripeCheckoutSuccess}
        successUrlMatcher={CHECKOUT_STRIPE_SUCCESS_MATCHER}
        title={t('checkout_payment_webview_title')}
      />
    );
  }

  if (isPaymentMethodScreenVisible) {
    return (
      <CheckoutPaymentMethodScreen
        isCardEnabled={preview?.store.stripeAllowed ?? false}
        isCashEnabled={preview?.store.codAllowed ?? true}
        onBackPress={() => {
          setIsPaymentMethodScreenVisible(false);
        }}
        onConfirm={handlePaymentMethodConfirm}
        selectedMethod={paymentMethod}
      />
    );
  }

  if (isScheduleScreenVisible) {
    return (
      <CheckoutScheduleScreen
        onBackPress={() => {
          setIsScheduleScreenVisible(false);
        }}
        onConfirm={handleScheduleConfirm}
        selectedScheduledAt={scheduledAt}
        storeId={cart.storeId}
      />
    );
  }

  if (isCustomTipScreenVisible) {
    return (
      <CheckoutCustomTipScreen
        onBackPress={handleCloseCustomTipScreen}
        onChangeTipValue={handleCustomTipValueChange}
        onSavePress={handleCustomTipSave}
        tipValue={customTipValue}
      />
    );
  }

  if (activeMessageTarget) {
    const isRestaurantMessage = activeMessageTarget === 'restaurant';

    return (
      <CheckoutMessageEditorScreen
        ctaLabel={t('checkout_message_done')}
        description={isRestaurantMessage
          ? t('checkout_message_restaurant_editor_description')
          : t('checkout_message_courier_editor_description')}
        onBackPress={handleCloseMessageScreen}
        onChangeText={(value) => {
          handleMessageChange(activeMessageTarget, value);
        }}
        onSavePress={handleCloseMessageScreen}
        placeholder={isRestaurantMessage
          ? t('checkout_message_restaurant_placeholder')
          : t('checkout_message_courier_placeholder')}
        title={isRestaurantMessage
          ? t('checkout_message_restaurant_editor_title')
          : t('checkout_message_courier_editor_title')}
        value={messages[activeMessageTarget]}
      />
    );
  }

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <CheckoutScreenContent
        courierMessage={messages.courier}
        deliveryTimeMode={deliveryTimeMode}
        hasAddressRequirement={orderType === 'delivery' && !selectedAddress?.id}
        isPickupEnabled={preview?.store.pickupAllowed ?? true}
        isPlacingOrder={placeOrderMutation.isPending}
        isPaymentBlocked={!isPaymentAvailable}
        isPreviewEnabled={Boolean(previewInput)}
        isPreviewError={isPreviewError}
        isPreviewPending={isPreviewPending}
        leaveAtDoor={leaveAtDoor}
        onAddressPress={handleAddressPress}
        onBackPress={handleBackPress}
        onCourierMessagePress={() => {
          handleMessagePress('courier');
        }}
        onDeliveryTimeModeChange={handleDeliveryTimeModeChange}
        onLeaveAtDoorChange={setLeaveAtDoor}
        onOrderTypeChange={setOrderType}
        onPlaceOrderPress={handlePlaceOrderPress}
        onPaymentPress={handlePaymentMethodPress}
        onPromoPress={handlePromoPress}
        onRestaurantMessagePress={() => {
          handleMessagePress('restaurant');
        }}
        onSchedulePress={() => {
          setIsScheduleScreenVisible(true);
        }}
        onRetryPreview={() => {
          void refetchPreview();
        }}
        onCustomTipPress={handleCustomTipPress}
        onTipChange={setSelectedTip}
        orderType={orderType}
        paymentErrorMessage={paymentErrorMessage}
        paymentIconName={paymentIconName}
        paymentSubtitle={paymentSubtitle}
        paymentTitle={paymentTitle}
        preview={preview ?? null}
        restaurantMessage={messages.restaurant}
        scheduledAt={scheduledAt}
        selectedAddressLabel={selectedAddressLabel}
        selectedTip={selectedTip}
        totalLabel={formatCartPrice(previewTotal)}
      />

      <AddressSelectionBottomSheet
        addresses={addresses}
        isLoading={isAddressesLoading}
        isVisible={isAddressSheetVisible}
        onAddAddress={handleAddAddressPress}
        onClose={handleCloseAddressSheet}
        onSelectAddress={handleSelectAddress}
        onUseCurrentLocation={handleUseCurrentLocation}
        selectingAddressId={selectingAddressId}
        selectedAddressId={selectedAddress?.id}
      />
    </View>
  );
}
