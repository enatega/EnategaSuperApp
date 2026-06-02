import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import { useTranslation } from "react-i18next";
import Image from "../../../../general/components/Image";
import Icon from "../../../../general/components/Icon";
import Text from "../../../../general/components/Text";
import { useDeliveriesCurrencyLabel } from "../../../../general/stores/useAppConfigStore";
import { useTheme } from "../../../../general/theme/theme";
import type { DeliveryDealItem } from "../../api/dealsServiceTypes";
import type { DeliveryStoreDetailsProduct } from "../../api/types";
import CartActionControl from "../cart/CartActionControl";
import CartCountBadge from "../cart/CartCountBadge";
import type { ProductCardControlState } from "./types";

type Props = {
  onPress: () => void;
  product: DeliveryStoreDetailsProduct | DeliveryDealItem;
  state: ProductCardControlState;
};

function formatPrice(price: number | null | undefined, currencyLabel: string) {
  return typeof price === "number"
    ? `${currencyLabel} ${price.toFixed(2)}`
    : null;
}

type RawDealObject = {
  deal_name?: string;
  discount_type?: string;
  discount_value?: number;
  discounted_price?: number;
};

function getProductDealMeta(product: DeliveryStoreDetailsProduct | DeliveryDealItem) {
  const rawDeal = (product as { deal?: unknown }).deal;
  const rawDealType = (product as { dealType?: string | null }).dealType ?? null;
  const rawDiscountValue = (product as { discountValue?: number | null }).discountValue ?? null;
  const rawOriginalPrice = (product as { originalPrice?: number | null }).originalPrice ?? null;

  let dealType = rawDealType;
  let discountValue = rawDiscountValue;
  let dealLabel: string | null = null;
  let discountedPrice: number | null = null;

  if (rawDeal && typeof rawDeal === "object" && !Array.isArray(rawDeal)) {
    const dealObject = rawDeal as RawDealObject;
    dealLabel = typeof dealObject.deal_name === "string" ? dealObject.deal_name : null;
    dealType = dealType ?? dealObject.discount_type ?? null;
    discountValue =
      typeof discountValue === "number"
        ? discountValue
        : typeof dealObject.discount_value === "number"
          ? dealObject.discount_value
          : null;
    discountedPrice =
      typeof dealObject.discounted_price === "number" && Number.isFinite(dealObject.discounted_price)
        ? dealObject.discounted_price
        : null;
  } else if (typeof rawDeal === "string") {
    const trimmedDeal = rawDeal.trim();
    if (trimmedDeal.length > 0 && trimmedDeal.toLowerCase() !== "no deal.") {
      dealLabel = trimmedDeal;
    }
  }

  const normalizedDealType = typeof dealType === "string" ? dealType.toLowerCase() : null;
  const hasNumericDiscount = typeof discountValue === "number" && Number.isFinite(discountValue) && discountValue > 0;

  const hasDeal = Boolean(dealLabel) || hasNumericDiscount;
  const resolvedOffer = hasNumericDiscount
    ? normalizedDealType === "percentage"
      ? `${discountValue} % OFF`
      : `${discountValue} OFF`
    : dealLabel;
  const originalPrice =
    typeof rawOriginalPrice === "number" && Number.isFinite(rawOriginalPrice)
      ? rawOriginalPrice
      : null;

  return {
    discountedPrice,
    hasDeal,
    originalPrice,
    resolvedOffer: resolvedOffer ?? null,
  };
}

export default function StoreMenuProductCard({
  onPress,
  product,
  state,
}: Props) {
  const { t } = useTranslation("deliveries");
  const { colors } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const { discountedPrice, hasDeal, originalPrice, resolvedOffer } = getProductDealMeta(product);
  const basePrice = typeof product.price === "number" ? product.price : null;
  const effectivePrice =
    typeof discountedPrice === "number" && Number.isFinite(discountedPrice)
      ? discountedPrice
      : basePrice;
  const priceLabel = formatPrice(effectivePrice, currencyLabel);
  const strikePrice =
    typeof discountedPrice === "number"
      ? basePrice
      : originalPrice;
  const productImageUri =
    product.imageUrl || "https://placehold.co/400x400.png";
  const imageBackgroundColor = hasDeal
    ? colors.storeMenuAccentOrange
    : colors.storeMenuAccentLime;

  return (
    <Pressable onPress={onPress} style={styles.container}>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: colors.border,
            shadowColor: colors.shadowColor,
          },
        ]}
      >
        <View
          style={[styles.imageArea, { backgroundColor: imageBackgroundColor }]}
        >
          <Image
            resizeMode="cover"
            source={{ uri: productImageUri }}
            style={styles.backgroundImage}
          />

          <View style={styles.header}>
            <View style={styles.badgeSlot}>
              {hasDeal && resolvedOffer ? (
                <View
                  style={[styles.badge, { backgroundColor: colors.secondary }]}
                >
                  <Icon
                    color={colors.blue800}
                    name="pricetag-outline"
                    size={11}
                    type="Ionicons"
                  />
                  <Text
                    style={[styles.badgeText, { color: colors.blue800 }]}
                    weight="medium"
                  >
                    {resolvedOffer}
                  </Text>
                </View>
              ) : null}
            </View>

            <CartActionControl
              accessibilityLabel={t("store_details_add_product", {
                item: product.name,
              })}
              count={state.controlCount}
              disabled={state.isDisabled}
              mode={state.controlMode}
              onAdd={state.handleAdd}
              onDecrement={state.handleDecrement}
              onIncrement={state.handleIncrement}
              size="medium"
              style={styles.action}
            />
          </View>

          {state.shouldShowCountBadge ? (
            <CartCountBadge
              count={state.totalQuantity}
              style={styles.countBadge}
            />
          ) : null}
        </View>

        <View style={styles.content}>
          {priceLabel ? (
            <View style={{ flexDirection: "row", gap: 6 }}>
              {typeof strikePrice === "number" ? (
                <Text
                  style={[
                    styles.price,
                    {
                      color: colors.mutedText,
                      textDecorationLine: "line-through",
                    },
                  ]}
                  weight="medium"
                >
                  {formatPrice(strikePrice, currencyLabel)}
                </Text>
              ) : null}
              <Text
                style={[styles.price, { color: colors.primary }]}
                weight="medium"
              >
                {priceLabel}
              </Text>
            </View>
          ) : null}
          <Text
            style={[styles.title, { color: colors.text }]}
            numberOfLines={1}
            weight="semiBold"
          >
            {product.name}
          </Text>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  action: {
    flexShrink: 0,
  },
  backgroundImage: {
    ...StyleSheet.absoluteFillObject,
  },
  badge: {
    alignItems: "center",
    borderRadius: 6,
    flexDirection: "row",
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 3,
    alignSelf: "flex-start",
  },
  badgeSlot: {
    flex: 1,
    paddingRight: 8,
  },
  badgeText: {
    fontSize: 12,
    lineHeight: 18,
  },
  card: {
    borderRadius: 12,
    borderWidth: 1,
    overflow: "hidden",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  container: {
    flexShrink: 0,
    marginVertical: 6,
    width: "48%",
  },
  content: {
    gap: 6,
    paddingHorizontal: 10,
    paddingVertical: 12,
  },
  countBadge: {
    bottom: 8,
    left: 10,
    position: "absolute",
  },
  header: {
    alignItems: "flex-start",
    flexDirection: "row",
    justifyContent: "space-between",
  },
  imageArea: {
    aspectRatio: 1.15,
    overflow: "hidden",
    paddingHorizontal: 10,
    paddingVertical: 8,
  },
  price: {
    fontSize: 12,
    lineHeight: 18,
  },
  title: {
    fontSize: 14,
    lineHeight: 22,
  },
});
