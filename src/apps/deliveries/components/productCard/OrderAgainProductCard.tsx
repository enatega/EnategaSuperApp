import React from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Image from '../../../../general/components/Image';
import Icon from '../../../../general/components/Icon';
import Text from '../../../../general/components/Text';
import { useDeliveriesCurrencyLabel } from '../../../../general/stores/useAppConfigStore';
import { useTheme } from '../../../../general/theme/theme';
import type { DeliveryOrderAgainItem } from '../../api/types';
import CartActionControl from '../cart/CartActionControl';
import CartCountBadge from '../cart/CartCountBadge';
import type { ProductCardControlState } from './types';

type Props = {
  onPress: () => void;
  product: DeliveryOrderAgainItem;
  state: ProductCardControlState;
};

const ENABLE_ORDER_AGAIN_DEAL_DEBUG = true;

type RawDealObject = {
  deal_name?: string;
  discount_type?: string;
  discount_value?: number;
  discounted_price?: number;
};

function getOrderAgainDealMeta(product: DeliveryOrderAgainItem, offLabel: string) {
  const rawDeal = product.deal;
  const rawDealType = product.dealType ?? null;
  const rawDealAmount = product.dealAmount ?? null;
  const rawDiscountedPrice = product.discountedPrice ?? null;

  let dealType = rawDealType;
  let discountValue = rawDealAmount;
  let dealLabel: string | null = null;
  let discountedPrice: number | null =
    typeof rawDiscountedPrice === 'number' && Number.isFinite(rawDiscountedPrice)
      ? rawDiscountedPrice
      : null;

  if (rawDeal && typeof rawDeal === 'object' && !Array.isArray(rawDeal)) {
    const objectDeal = rawDeal as RawDealObject;
    dealLabel = typeof objectDeal.deal_name === 'string' ? objectDeal.deal_name : null;
    dealType = dealType ?? objectDeal.discount_type ?? null;
    discountValue =
      typeof discountValue === 'number'
        ? discountValue
        : typeof objectDeal.discount_value === 'number'
          ? objectDeal.discount_value
          : null;
    if (
      discountedPrice === null &&
      typeof objectDeal.discounted_price === 'number' &&
      Number.isFinite(objectDeal.discounted_price)
    ) {
      discountedPrice = objectDeal.discounted_price;
    }
  } else if (typeof rawDeal === 'string') {
    const trimmedDeal = rawDeal.trim();
    if (trimmedDeal.length > 0 && trimmedDeal.toLowerCase() !== 'no deal.') {
      dealLabel = trimmedDeal;
    }
  }

  const normalizedDealType = typeof dealType === 'string' ? dealType.toLowerCase() : null;
  const hasNumericDiscount =
    typeof discountValue === 'number' && Number.isFinite(discountValue) && discountValue > 0;
  const basePrice = typeof product.price === 'number' ? product.price : null;

  if (
    discountedPrice === null &&
    hasNumericDiscount &&
    typeof basePrice === 'number' &&
    Number.isFinite(basePrice)
  ) {
    discountedPrice =
      normalizedDealType === 'percentage'
        ? Number((basePrice - (basePrice * discountValue) / 100).toFixed(2))
        : Number((basePrice - discountValue).toFixed(2));
  }

  const safeDiscountedPrice =
    typeof discountedPrice === 'number' &&
    Number.isFinite(discountedPrice) &&
    typeof basePrice === 'number' &&
    discountedPrice >= 0 &&
    discountedPrice < basePrice
      ? discountedPrice
      : null;

  const offerText = hasNumericDiscount
    ? normalizedDealType === 'percentage'
      ? `${discountValue} % ${offLabel}`
      : `${discountValue} ${offLabel}`
    : dealLabel;

  return {
    basePrice,
    discountedPrice: safeDiscountedPrice,
    hasDeal: Boolean(offerText),
    offerText: offerText ?? null,
  };
}

export default function OrderAgainProductCard({ onPress, product, state }: Props) {
  const { t } = useTranslation('deliveries');
  const { colors, typography } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const { basePrice, discountedPrice, hasDeal, offerText } = getOrderAgainDealMeta(
    product,
    t('off'),
  );
  const imageUri =
    product.productImage?.trim() ||
    product.storeImage?.trim() ||
    product.storeLogo?.trim() ||
    'https://placehold.co/400x400.png';
  const formattedPrice =
    typeof (discountedPrice ?? basePrice) === 'number'
      ? `${currencyLabel} ${(discountedPrice ?? basePrice)!.toFixed(2)}`
      : t('multi_vendor_order_again_price_unavailable');
  const strikePrice =
    typeof discountedPrice === 'number' && typeof basePrice === 'number'
      ? `${currencyLabel} ${basePrice.toFixed(2)}`
      : null;

  React.useEffect(() => {
    if (!ENABLE_ORDER_AGAIN_DEAL_DEBUG) {
      return;
    }

    console.log('[Deliveries][OrderAgain][DealDebug]', {
      productId: product.productId,
      productName: product.productName,
      rawDeal: product.deal,
      dealType: product.dealType,
      dealAmount: product.dealAmount,
      price: product.price,
      resolvedOffer: offerText,
      resolvedDiscountedPrice: discountedPrice,
    });
  }, [
    discountedPrice,
    offerText,
    product.deal,
    product.dealAmount,
    product.dealType,
    product.price,
    product.productId,
    product.productName,
  ]);

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      style={[
        styles.card,
        {
          backgroundColor: colors.surface,
          borderColor: colors.border,
          shadowColor: colors.shadowColor,
        },
      ]}
    >
      <View style={styles.imageWrapper}>
        <Image source={{ uri: imageUri }} style={styles.image} resizeMode="cover" />

        {hasDeal && offerText ? (
          <View style={[styles.badge, { backgroundColor: colors.blue800 }]}>
            <Icon type="Feather" name="tag" size={12} color={colors.white} />
            <Text
              color={colors.white}
              weight="medium"
              style={{
                fontSize: typography.size.xs2,
                lineHeight: typography.lineHeight.sm,
              }}
            >
              {offerText}
            </Text>
          </View>
        ) : null}

        <View style={styles.action}>
          <CartActionControl
            accessibilityLabel={t('multi_vendor_order_again_add_item')}
            count={state.controlCount}
            disabled={state.isDisabled}
            mode={state.controlMode}
            onAdd={state.handleAdd}
            onDecrement={state.handleDecrement}
            onIncrement={state.handleIncrement}
            size="small"
          />
        </View>

        {state.shouldShowCountBadge ? (
          <CartCountBadge count={state.totalQuantity} style={styles.countBadge} />
        ) : null}
      </View>

      <View style={styles.content}>
        <View style={styles.priceRow}>
          {strikePrice ? (
            <Text
              weight="medium"
              color={colors.mutedText}
              style={[
                styles.strikePrice,
                {
                  fontSize: typography.size.xxs,
                  lineHeight: typography.lineHeight.xxs,
                },
              ]}
            >
              {strikePrice}
            </Text>
          ) : null}
          <Text
            weight="medium"
            color={colors.primary}
            style={{
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            }}
          >
            {formattedPrice}
          </Text>
        </View>

        <Text
          weight="semiBold"
          numberOfLines={1}
          style={{
            fontSize: typography.size.xs2,
            lineHeight: typography.lineHeight.sm,
          }}
        >
          {product.productName}
        </Text>

        {product.storeName ? (
          <Text
            color={colors.mutedText}
            numberOfLines={1}
            style={{
              fontSize: typography.size.xxs,
              lineHeight: typography.lineHeight.xxs,
            }}
          >
            {product.storeName}
          </Text>
        ) : null}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    position: 'absolute',
    right: 6,
    top: 6,
  },
  badge: {
    alignItems: 'center',
    borderRadius: 4,
    flexDirection: 'row',
    gap: 4,
    left: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    position: 'absolute',
    top: 6,
  },
  card: {
    borderRadius: 8,
    borderWidth: 1,
    overflow: 'hidden',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    width: 120,
  },
  content: {
    gap: 2,
    paddingHorizontal: 6,
    paddingVertical: 6,
  },
  priceRow: {
    alignItems: 'center',
    flexDirection: 'row',
    gap: 6,
  },
  strikePrice: {
    textDecorationLine: 'line-through',
  },
  countBadge: {
    left: 6,
    position: 'absolute',
    top: 42,
  },
  image: {
    height: '100%',
    width: '100%',
  },
  imageWrapper: {
    height: 76,
    overflow: 'hidden',
    position: 'relative',
  },
});
