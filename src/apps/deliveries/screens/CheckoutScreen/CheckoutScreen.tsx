import React from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NavigationProp } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import { showToast } from '../../../../general/components/AppToast';
import { useTheme } from '../../../../general/theme/theme';
import AddressSelectionBottomSheet from '../../components/AddressSelectionBottomSheet';
import useSavedAddresses from '../../multiVendor/hooks/useSavedAddresses';
import type { CheckoutOrderType } from '../../api/orderServiceTypes';
import type { CartResponse } from '../../api/cartServiceTypes';
import CheckoutScreenContent from '../../components/checkout/CheckoutScreenContent';
import CartScreenErrorState from '../../components/cart/CartScreenErrorState';
import CartScreenSkeleton from '../../components/cart/CartScreenSkeleton';
import { useAddress } from '../../hooks';
import useSelectSavedAddress from '../../hooks/useSelectSavedAddress';
import { useCart } from '../../hooks/useCart';
import { useCheckoutPreview } from '../../hooks/useCheckoutPreview';
import { formatCartPrice } from '../../components/cart/cartUtils';
import { formatDeliveryAddressLabel } from '../../utils/address';
import { usePlaceOrder } from '../../hooks/usePlaceOrder';
import CheckoutMessageEditorScreen from '../../components/checkout/CheckoutMessageEditorScreen';
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
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [activeMessageTarget, setActiveMessageTarget] = React.useState<CheckoutMessageTarget | null>(null);
  const [isAddressSheetVisible, setIsAddressSheetVisible] = React.useState(false);
  const [isScheduleScreenVisible, setIsScheduleScreenVisible] = React.useState(false);
  const { selectedAddress } = useAddress();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress();
  const [orderType, setOrderType] = React.useState<CheckoutOrderType>('delivery');
  const [leaveAtDoor, setLeaveAtDoor] = React.useState(false);
  const [deliveryTimeMode, setDeliveryTimeMode] = React.useState<CheckoutDeliveryTimeMode>('standard');
  const [scheduledAt, setScheduledAt] = React.useState<string | null>(null);
  const [messages, setMessages] = React.useState<CheckoutMessages>({
    restaurant: '',
    courier: '',
  });
  const [selectedTip, setSelectedTip] = React.useState(0);
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
  const placeOrderMutation = usePlaceOrder({
    onError: () => {
      showToast.error(t('checkout_place_order_error'));
    },
    onSuccess: (response) => {
      showToast.success(t('checkout_place_order_success'));
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
              orderId: response.orderId,
            },
          },
        ],
      } as never);
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
    if (orderType !== 'pickup') {
      return;
    }

    setLeaveAtDoor(false);
    setSelectedTip(0);
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
    navigation.navigate('MultiVendor', {
      screen: 'AddressSearch',
      params: { origin: 'home-header' },
    });
  }, [navigation]);

  const handleUseCurrentLocation = React.useCallback(() => {
    setIsAddressSheetVisible(false);
    navigation.navigate('MultiVendor', {
      screen: 'AddressChooseOnMap',
      params: { origin: 'home-header' },
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
      paymentMethod: 'cod' as const,
      addressId: orderType === 'delivery' ? selectedAddress?.id : undefined,
      customerNote: buildCustomerNote({
        restaurant: messages.restaurant,
        courier: orderType === 'delivery' ? messages.courier : '',
      }),
      riderTip: orderType === 'delivery' && selectedTip > 0 ? selectedTip : undefined,
      scheduledAt: deliveryTimeMode === 'schedule' ? scheduledAt ?? undefined : undefined,
    };

    void placeOrderMutation.mutateAsync(payload).catch(() => {
      // Toast feedback is handled by the mutation callbacks.
    });
  }, [
    cart?.bucketId,
    cart?.storeId,
    orderType,
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
  const previewErrorMessage = previewError?.message?.trim() ?? '';
  const isCodUnavailable = previewErrorMessage.toLowerCase().includes('cash on delivery');

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
        cashSubtitle={isCodUnavailable ? t('checkout_payment_cash_unavailable') : undefined}
        courierMessage={messages.courier}
        deliveryTimeMode={deliveryTimeMode}
        hasAddressRequirement={orderType === 'delivery' && !selectedAddress?.id}
        isPickupEnabled={preview?.store.pickupAllowed ?? true}
        isPlacingOrder={placeOrderMutation.isPending}
        isPaymentBlocked={false}
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
        onTipChange={setSelectedTip}
        orderType={orderType}
        paymentErrorMessage={isCodUnavailable ? t('checkout_payment_cod_unavailable_error') : null}
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
