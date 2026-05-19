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
import { useUseCouponMutation } from '../../hooks/useUseCouponMutation';
import { claimedCouponsKeys } from '../../hooks/useClaimedCouponsQuery';
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
import CheckoutPaymentMethodBottomSheet from '../../components/checkout/CheckoutPaymentMethodBottomSheet';
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
import { useCheckoutCouponStore } from '../../stores/useCheckoutCouponStore';
import {
  useWalletSavedCardsQuery,
  useWalletSetDefaultCardMutation,
} from '../../../../general/api/walletSavedCardsService';

const DELIVERY_ROOT_ROUTES = ['SingleVendor', 'MultiVendor', 'Chain'] as const;
const ENABLE_CHECKOUT_PAYMENT_DEBUG = true;

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
  couponCode?: string,
  scheduledAt?: string,
  riderTip?: number,
) {
  if (!cart?.bucketId || !cart.storeId) {
    return null;
  }

  if (orderType === 'delivery' && !selectedAddressId) {
    return null;
  }

  console.log("Preview Input:", {
    storeId: cart.storeId,
    bucketId: cart.bucketId,
    orderType,
    addressId: orderType === 'delivery' ? selectedAddressId : undefined,
    couponCode: couponCode ?? undefined,
  });
  return {
    storeId: cart.storeId,
    bucketId: cart.bucketId,
    orderType,
    addressId: orderType === 'delivery' ? selectedAddressId : undefined,
    couponCode: couponCode ?? undefined,
    scheduledAt,
    riderTip: riderTip && riderTip > 0 ? riderTip : undefined,
  };
}

function applyPercentageCouponFallback(params: {
  subtotal: number;
  backendDiscount: number;
  discountType?: string;
  discountValue?: number;
  maxDiscountCap?: number;
  minOrderValue?: number;
}) {
  const {
    subtotal,
    backendDiscount,
    discountType,
    discountValue,
    maxDiscountCap,
    minOrderValue,
  } = params;

  // Keep current behavior for FIXED/FLAT and for already-applied backend discount.
  if (discountType !== 'PERCENTAGE' || backendDiscount > 0) {
    return backendDiscount;
  }

  if (typeof discountValue !== 'number' || discountValue <= 0) {
    return backendDiscount;
  }

  if (typeof minOrderValue === 'number' && subtotal < minOrderValue) {
    return backendDiscount;
  }

  const percentageAmount = (subtotal * discountValue) / 100;
  const cappedAmount = typeof maxDiscountCap === 'number' && maxDiscountCap > 0
    ? Math.min(percentageAmount, maxDiscountCap)
    : percentageAmount;

  return Number.isFinite(cappedAmount) && cappedAmount > 0 ? cappedAmount : backendDiscount;
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
  const selectedCoupon = useCheckoutCouponStore((state) => state.selectedCoupon);
  const clearCheckoutCoupon = useCheckoutCouponStore((state) => state.clearCoupon);
  const useCouponMutation = useUseCouponMutation();
  const savedCardsQuery = useWalletSavedCardsQuery('deliveries');
  const setDefaultCardMutation = useWalletSetDefaultCardMutation('deliveries');
  const [selectedStripeCardId, setSelectedStripeCardId] = React.useState<string | null>(null);
  const {
    data: cart,
    isPending: isCartPending,
    error: cartError,
    refetch: refetchCart,
  } = useCart();
  const previewScheduledAt = deliveryTimeMode === 'schedule' ? scheduledAt ?? undefined : undefined;
  const previewInput = React.useMemo(
    () => getPreviewInput(
      cart,
      orderType,
      selectedAddress?.id,
      selectedCoupon?.code,
      previewScheduledAt,
      selectedTip,
    ),
    [cart, orderType, selectedAddress?.id, selectedCoupon?.code, previewScheduledAt, selectedTip],
  );
  const {
    data: preview,
    error: previewError,
    isPending: isPreviewPending,
    isError: isPreviewError,
    refetch: refetchPreview,
  } = useCheckoutPreview(previewInput);

  React.useEffect(() => {
    if (!previewInput) {
      return;
    }

    console.log('[CheckoutPreview][Request]', {
      ...previewInput,
      selectedCouponCode: selectedCoupon?.code ?? null,
      selectedTip,
    });
  }, [previewInput, selectedCoupon?.code, selectedTip]);

  React.useEffect(() => {
    if (!preview) {
      return;
    }

    console.log('[CheckoutPreview][Response]', {
      pricing: preview.pricing,
      storeId: preview.store?.id,
      storeName: preview.store?.name,
      orderType: preview.fulfillment?.orderType,
      itemCount: preview.bucket?.itemCount,
      selectedCouponCode: selectedCoupon?.code ?? null,
    });
  }, [preview, selectedCoupon?.code]);

  React.useEffect(() => {
    if (!ENABLE_CHECKOUT_PAYMENT_DEBUG) {
      return;
    }

    console.log('[Checkout][Payment][State]', {
      paymentMethod,
      selectedStripeCardId,
      defaultSavedCardId: savedCardsQuery.data?.cards.find((card) => card.isDefault)?.id ?? null,
      savedCardsCount: savedCardsQuery.data?.cards.length ?? 0,
    });
  }, [paymentMethod, savedCardsQuery.data?.cards, selectedStripeCardId]);

  const navigateToOrderTracking = React.useCallback((orderId: string) => {
    const rootRouteName = getCheckoutRootRoute(navigation);

    navigation.reset({
      index: 1,
      routes: [
        {
          name: rootRouteName,
        },
        {
          name: 'OrderTrackingScreen',
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
      clearCheckoutCoupon();
      navigateToOrderTracking(response.orderId);
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
    if (preview?.store?.stripeAllowed === false && leaveAtDoor) {
      setLeaveAtDoor(false);
    }
  }, [leaveAtDoor, preview?.store?.stripeAllowed]);

  React.useEffect(() => {
    if (orderType !== 'delivery' || !leaveAtDoor || !preview?.store) {
      return;
    }

    if (paymentMethod === 'stripe') {
      return;
    }

    if (!preview.store.stripeAllowed) {
      return;
    }

    setPaymentMethod('stripe');
    showToast.info(
      t('checkout_payment_card_title'),
      t('checkout_leave_at_door_switched_to_card'),
    );
  }, [leaveAtDoor, orderType, paymentMethod, preview?.store, t]);

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

    if (orderType === 'delivery' && leaveAtDoor && paymentMethod !== 'stripe') {
      if (preview?.store?.stripeAllowed) {
        showToast.error(t('checkout_leave_at_door_card_required'));
        setIsPaymentMethodScreenVisible(true);
        return;
      }

      showToast.error(t('checkout_payment_card_unavailable_error'));
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
      couponCode: selectedCoupon?.code,
      riderTip: orderType === 'delivery' && selectedTip > 0 ? selectedTip : undefined,
      scheduledAt: deliveryTimeMode === 'schedule' ? scheduledAt ?? undefined : undefined,
      successUrl: paymentMethod === 'stripe' ? CHECKOUT_STRIPE_SUCCESS_URL : undefined,
      cancelUrl: paymentMethod === 'stripe' ? CHECKOUT_STRIPE_CANCEL_URL : undefined,
    };

    if (ENABLE_CHECKOUT_PAYMENT_DEBUG) {
      console.log('[Checkout][Payment][PlaceOrderPayload]', {
        payload,
        paymentMethod,
        selectedStripeCardId,
        defaultSavedCardId: savedCardsQuery.data?.cards.find((card) => card.isDefault)?.id ?? null,
      });
    }

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
    selectedCoupon?.code,
    messages,
    deliveryTimeMode,
    leaveAtDoor,
    preview?.store?.stripeAllowed,
    scheduledAt,
    selectedTip,
    savedCardsQuery.data?.cards,
    selectedStripeCardId,
    t,
  ]);

  const handlePromoPress = React.useCallback(() => {
    navigation.navigate('Coupons');
  }, [navigation]);

  const handlePromoRemove = React.useCallback(async () => {
    if (!selectedCoupon?.id) {
      clearCheckoutCoupon();
      return;
    }

    try {
      await useCouponMutation.mutateAsync({
        id: selectedCoupon.id,
        isActive: false,
      });
      clearCheckoutCoupon();
      void queryClient.invalidateQueries({ queryKey: claimedCouponsKeys.all });
      showToast.success(t('checkout_promo_removed'));
      void refetchPreview();
    } catch (error) {
      const message =
        error instanceof Error ? error.message : t('coupon_deactivate_error_fallback');
      showToast.error(t('coupon_deactivate_error_title'), message);
    }
  }, [
    clearCheckoutCoupon,
    refetchPreview,
    selectedCoupon?.id,
    t,
    useCouponMutation,
  ]);

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
        navigateToOrderTracking(orderId);
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
  }, [deliveryTimeMode, navigateToOrderTracking, navigation, queryClient, t]);

  const handlePaymentMethodPress = React.useCallback(() => {
    setIsPaymentMethodScreenVisible(true);
  }, []);

  const handlePaymentMethodConfirm = React.useCallback((nextPaymentMethod: CheckoutPaymentMethod) => {
    setPaymentMethod(nextPaymentMethod);
    setIsPaymentMethodScreenVisible(false);
  }, []);
  const handleSelectStripeCard = React.useCallback(async (cardId: string) => {
    setSelectedStripeCardId(cardId);
    if (ENABLE_CHECKOUT_PAYMENT_DEBUG) {
      console.log('[Checkout][Payment][SelectCard]', {
        nextCardId: cardId,
      });
    }
    try {
      await setDefaultCardMutation.mutateAsync(cardId);
      if (ENABLE_CHECKOUT_PAYMENT_DEBUG) {
        console.log('[Checkout][Payment][SelectCard][Success]', {
          nextCardId: cardId,
        });
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : t('wallet_add_card_error');
      showToast.error(t('wallet_add_card_error'), message);
      if (ENABLE_CHECKOUT_PAYMENT_DEBUG) {
        console.log('[Checkout][Payment][SelectCard][Error]', {
          nextCardId: cardId,
          message,
        });
      }
    }
  }, [setDefaultCardMutation, t]);

  const handleDeliveryTimeModeChange = React.useCallback((mode: CheckoutDeliveryTimeMode) => {
    if (mode === 'schedule') {
      setIsScheduleScreenVisible(true);
      return;
    }

    setDeliveryTimeMode('standard');
  }, []);

  const handleLeaveAtDoorChange = React.useCallback((nextValue: boolean) => {
    if (!nextValue) {
      setLeaveAtDoor(false);
      return;
    }

    if (!preview?.store?.stripeAllowed) {
      showToast.error(t('checkout_payment_card_unavailable_error'));
      return;
    }

    setLeaveAtDoor(true);
  }, [preview?.store?.stripeAllowed, t]);

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
    console.log('[Checkout][Tip][OpenCustomTip]', {
      selectedTip,
    });
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
    console.log('[Checkout][Tip][SaveCustomTip][Attempt]', {
      customTipValue,
      parsedTip,
    });

    if (!Number.isFinite(parsedTip) || parsedTip <= 0) {
      console.log('[Checkout][Tip][SaveCustomTip][Rejected]', {
        customTipValue,
        parsedTip,
      });
      return;
    }

    setSelectedTip(parsedTip);
    setIsCustomTipScreenVisible(false);
  }, [customTipValue]);

  React.useEffect(() => {
    console.log('[Checkout][Tip][SelectedTipChanged]', {
      selectedTip,
      orderType,
    });
  }, [orderType, selectedTip]);

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

  const adjustedPricing = React.useMemo(() => {
    if (!preview?.pricing) {
      return null;
    }

    const nextDiscount = applyPercentageCouponFallback({
      subtotal: preview.pricing.subtotal,
      backendDiscount: preview.pricing.discount,
      discountType: selectedCoupon?.discountType,
      discountValue: selectedCoupon?.discountValue,
      maxDiscountCap: selectedCoupon?.maxDiscountCap,
      minOrderValue: selectedCoupon?.minOrderValue,
    });

    if (nextDiscount === preview.pricing.discount) {
      return preview.pricing;
    }

    const nextTotalAmount = Math.max(
      0,
      preview.pricing.subtotal
      - nextDiscount
      + preview.pricing.tax
      + preview.pricing.packingCharges
      + preview.pricing.deliveryFee
      + preview.pricing.riderTip,
    );

    return {
      ...preview.pricing,
      discount: nextDiscount,
      totalAmount: nextTotalAmount,
    };
  }, [
    preview?.pricing,
    selectedCoupon?.discountType,
    selectedCoupon?.discountValue,
    selectedCoupon?.maxDiscountCap,
    selectedCoupon?.minOrderValue,
  ]);
  const adjustedPreview = React.useMemo(
    () => (preview && adjustedPricing ? { ...preview, pricing: adjustedPricing } : preview),
    [adjustedPricing, preview],
  );
  const previewTotal = adjustedPreview?.pricing.totalAmount ?? cart.finalPrice;
  const selectedAddressLabel = formatDeliveryAddressLabel(selectedAddress);
  const paymentIconName = paymentMethod === 'stripe' ? 'card-outline' : 'cash-outline';
  const paymentTitle = getCheckoutPaymentMethodTitle(paymentMethod, t);
  const defaultSavedCard = React.useMemo(
    () => savedCardsQuery.data?.cards.find((card) => card.isDefault) ?? null,
    [savedCardsQuery.data?.cards],
  );
  const selectedSavedCard = React.useMemo(() => {
    if (!savedCardsQuery.data?.cards?.length) {
      return null;
    }

    if (selectedStripeCardId) {
      const selectedCard = savedCardsQuery.data.cards.find((card) => card.id === selectedStripeCardId);
      if (selectedCard) {
        return selectedCard;
      }
    }

    return defaultSavedCard;
  }, [defaultSavedCard, savedCardsQuery.data?.cards, selectedStripeCardId]);
  const paymentSubtitle = paymentMethod === 'stripe'
    ? selectedSavedCard
      ? t('checkout_payment_card_saved_subtitle', {
        brand: selectedSavedCard.brand.toUpperCase(),
        last4: selectedSavedCard.last4,
      })
      : getCheckoutPaymentMethodSubtitle(paymentMethod, t)
    : getCheckoutPaymentMethodSubtitle(paymentMethod, t);
  const isPromoApplied = Boolean(selectedCoupon?.code);
  const promoTitle = selectedCoupon?.title ?? t('checkout_promo_title');
  const promoCode = selectedCoupon?.code ?? null;
  const promoSubtitle = selectedCoupon
    ? t('checkout_promo_tap_to_change')
    : t('checkout_promo_subtitle');
  const isPaymentAvailable = isCheckoutPaymentMethodAvailable(
    paymentMethod,
    preview?.store,
  );
  const isLeaveAtDoorCardRequired =
    orderType === 'delivery' && leaveAtDoor && paymentMethod !== 'stripe';
  const leaveAtDoorPaymentErrorMessage = isLeaveAtDoorCardRequired
    ? (preview?.store?.stripeAllowed
      ? t('checkout_leave_at_door_card_required')
      : t('checkout_payment_card_unavailable_error'))
    : null;
  const paymentErrorMessage = !isPaymentAvailable
    ? paymentMethod === 'stripe'
      ? t('checkout_payment_card_unavailable_error')
      : t('checkout_payment_cod_unavailable_error')
    : leaveAtDoorPaymentErrorMessage;

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
        isPickupEnabled={adjustedPreview?.store.pickupAllowed ?? true}
        isPromoApplied={isPromoApplied}
        isPlacingOrder={placeOrderMutation.isPending}
        isPaymentBlocked={!isPaymentAvailable || isLeaveAtDoorCardRequired}
        isPreviewEnabled={Boolean(previewInput)}
        isPreviewError={isPreviewError}
        isPreviewPending={isPreviewPending}
        canShowLeaveAtDoor={preview?.store?.stripeAllowed ?? false}
        leaveAtDoor={leaveAtDoor}
        onAddressPress={handleAddressPress}
        onBackPress={handleBackPress}
        onCourierMessagePress={() => {
          handleMessagePress('courier');
        }}
        onDeliveryTimeModeChange={handleDeliveryTimeModeChange}
        onLeaveAtDoorChange={handleLeaveAtDoorChange}
        onOrderTypeChange={setOrderType}
        onPlaceOrderPress={handlePlaceOrderPress}
        onPaymentPress={handlePaymentMethodPress}
        onPromoPress={handlePromoPress}
        onPromoRemove={handlePromoRemove}
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
        onTipChange={(amount) => {
          console.log('[Checkout][Tip][QuickSelect]', {
            amount,
            previousTip: selectedTip,
          });
          setSelectedTip(amount);
        }}
        orderType={orderType}
        paymentErrorMessage={paymentErrorMessage}
        paymentIconName={paymentIconName}
        paymentSubtitle={paymentSubtitle}
        paymentTitle={paymentTitle}
        promoCode={promoCode}
        promoTitle={promoTitle}
        promoSubtitle={promoSubtitle}
        preview={adjustedPreview ?? null}
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

      <CheckoutPaymentMethodBottomSheet
        isCardEnabled={preview?.store.stripeAllowed ?? false}
        isCashEnabled={preview?.store.codAllowed ?? true}
        isSavingCardSelection={setDefaultCardMutation.isPending}
        isVisible={isPaymentMethodScreenVisible}
        onClose={() => {
          setIsPaymentMethodScreenVisible(false);
        }}
        onConfirm={handlePaymentMethodConfirm}
        onManageCards={() => {
          setIsPaymentMethodScreenVisible(false);
          navigation.navigate('Wallet');
        }}
        onSelectCard={(cardId) => {
          void handleSelectStripeCard(cardId);
        }}
        savedCards={savedCardsQuery.data?.cards ?? []}
        selectedCardId={selectedSavedCard?.id ?? null}
        selectedMethod={paymentMethod}
      />
    </View>
  );
}
