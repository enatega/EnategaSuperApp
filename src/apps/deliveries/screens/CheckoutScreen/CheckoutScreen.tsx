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

function getPreviewInput(
  cart: CartResponse | undefined,
  orderType: CheckoutOrderType,
  selectedAddressId?: string,
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
    riderTip: riderTip && riderTip > 0 ? riderTip : undefined,
  };
}

export default function CheckoutScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp<Record<string, object | undefined>>>();
  const [isAddressSheetVisible, setIsAddressSheetVisible] = React.useState(false);
  const { selectedAddress } = useAddress();
  const {
    addresses,
    isLoading: isAddressesLoading,
    refetch: refetchAddresses,
  } = useSavedAddresses();
  const { selectSavedAddress, selectingAddressId } = useSelectSavedAddress();
  const [orderType, setOrderType] = React.useState<CheckoutOrderType>('delivery');
  const [leaveAtDoor, setLeaveAtDoor] = React.useState(false);
  const [deliveryTimeMode, setDeliveryTimeMode] = React.useState<'standard' | 'schedule'>('standard');
  const [selectedTip, setSelectedTip] = React.useState(0);
  const {
    data: cart,
    isPending: isCartPending,
    error: cartError,
    refetch: refetchCart,
  } = useCart();
  const previewInput = React.useMemo(
    () => getPreviewInput(cart, orderType, selectedAddress?.id, selectedTip),
    [cart, orderType, selectedAddress?.id, selectedTip],
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
    onSuccess: () => {
      showToast.success(t('checkout_place_order_success'));
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
      riderTip: selectedTip > 0 ? selectedTip : undefined,
    };

    void placeOrderMutation.mutateAsync(payload).then((response) => {
      navigation.reset({
        index: 0,
        routes: [
          {
            name: 'MultiVendor',
            params: {
              screen: 'OrderTrackingScreen',
              params: {
                orderId: response.orderId,
              },
            },
          },
        ],
      });
    }).catch(() => {
      // Toast feedback is handled by the mutation callbacks.
    });
  }, [
    cart?.bucketId,
    cart?.storeId,
    navigation,
    orderType,
    placeOrderMutation,
    selectedAddress?.id,
    selectedTip,
    t,
  ]);

  const handlePromoPress = React.useCallback(() => {
    showToast.info(t('checkout_promo_pending'));
  }, [t]);

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

  return (
    <View style={{ backgroundColor: colors.background, flex: 1 }}>
      <CheckoutScreenContent
        cashSubtitle={isCodUnavailable ? t('checkout_payment_cash_unavailable') : undefined}
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
        onDeliveryTimeModeChange={setDeliveryTimeMode}
        onLeaveAtDoorChange={setLeaveAtDoor}
        onOrderTypeChange={setOrderType}
        onPlaceOrderPress={handlePlaceOrderPress}
        onPromoPress={handlePromoPress}
        onRetryPreview={() => {
          void refetchPreview();
        }}
        onTipChange={setSelectedTip}
        orderType={orderType}
        paymentErrorMessage={isCodUnavailable ? t('checkout_payment_cod_unavailable_error') : null}
        preview={preview ?? null}
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
