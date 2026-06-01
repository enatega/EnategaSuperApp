import React, { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Pressable,
  RefreshControl,
  StatusBar,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useDeliveriesCurrencyLabel } from "../../../../general/stores/useAppConfigStore";
import { useTheme } from "../../../../general/theme/theme";
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from "../../api/productInfoServiceTypes";
import CartStoreConflictModal from "../cart/CartStoreConflictModal";
import DeliveriesFloatingCartButton from "../navigation/DeliveriesFloatingCartButton";
import Footer from "./Footer";
import ImageHeader, {
  getProductInfoHeaderMaxHeight,
  getProductInfoHeaderMinHeight,
} from "./ImageHeader";
import ItemFlavour from "./ItemFlavour";
import ItemInfo from "./ItemInfo";
import ItemNutritions from "./ItemNutritions";
import ItemSizes from "./ItemSizes";
import ProductInfoCustomizationsLoadingSkeleton from "./ProductInfoCustomizationsLoadingSkeleton";
import useProductSelectionState from "./useProductSelectionState";
import useProductInfoCartFlow from "./useProductInfoCartFlow";

const ENABLE_PRODUCT_INFO_DEAL_DEBUG = true;

function toValidNumber(value: unknown): number | null {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  if (typeof value === "string") {
    const parsed = Number(value);
    return Number.isFinite(parsed) ? parsed : null;
  }

  return null;
}

type Props = {
  data: ProductInfoResponse;
  customizations?: ProductInfoCustomizationsResponse;
  initialBasePrice?: number;
  isCustomizationsLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
};

export default function MainContainer({
  data: productInfoData,
  customizations,
  initialBasePrice,
  isCustomizationsLoading = false,
  isRefreshing = false,
  onRefresh,
}: Props) {
  const { colors } = useTheme();
  const currencyLabel = useDeliveriesCurrencyLabel();
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const [quantity, setQuantity] = useState(1);
  const scrollY = useRef(new Animated.Value(0)).current;
  const variations = customizations?.variations ?? [];
  const addons = customizations?.addons ?? [];
  const maxHeaderHeight = getProductInfoHeaderMaxHeight(width);
  const minHeaderHeight = getProductInfoHeaderMinHeight(width);
  const headerCollapseDistance = maxHeaderHeight - minHeaderHeight;
  const clampedScrollY = useMemo(
    () => Animated.diffClamp(scrollY, 0, headerCollapseDistance),
    [headerCollapseDistance, scrollY],
  );

  const {
    addonSections,
    cartSelectionInputs,
    selectedAddonsTotal,
    selectedVariation,
    selectedVariationKey,
    selectedVariationPrice,
    selectedAddonOptionIdsByGroup,
    selectVariationOption,
    toggleAddonOption,
    variationHelperText,
    variationOptions,
  } = useProductSelectionState({ addons, variations });
  const resolvedProductBasePrice =
    typeof initialBasePrice === "number" && Number.isFinite(initialBasePrice)
      ? initialBasePrice
      : productInfoData.price;
  const isSelectedVariationReplacingBase = selectedVariation?.pricingMode === "replace_base";
  const { conflictResolution, handleAddToCart, isAddDisabled, isSubmitting } =
    useProductInfoCartFlow({
      customizations,
      hasCustomizationContext: !isCustomizationsLoading && customizations !== undefined,
      product: productInfoData,
      quantity,
      selectedOptions: cartSelectionInputs,
    });

  const hasNutritionSection = Boolean(
    productInfoData.ingredients?.trim() ||
      productInfoData.usage?.trim() ||
      productInfoData.nutrition?.length,
  );
  const hasSizes = variations.length > 0;
  const hasFlavours = addonSections.length > 0;
  const hasCustomizationSection = hasSizes || hasFlavours;
  const hasDetailSections =
    hasNutritionSection || hasCustomizationSection || isCustomizationsLoading;
  const detailDealPricing = useMemo(() => {
    const productBasePrice = resolvedProductBasePrice;
    const rawDeal = productInfoData.deal;
    const fallbackDealAmount = toValidNumber(productInfoData.dealAmount);
    const fallbackDealType = productInfoData.dealType?.toLowerCase() ?? null;

    let discountedPrice: number | null = null;
    let dealAmount = fallbackDealAmount;
    let dealType = fallbackDealType;
    let dealLabel: string | null = null;

    if (rawDeal && typeof rawDeal === "object") {
      const objectDeal = rawDeal as {
        deal_name?: string;
        discounted_price?: number;
        discountedPrice?: number;
        discount_value?: number;
        discountValue?: number;
        discount_type?: string;
        discountType?: string;
      };
      if (typeof objectDeal.deal_name === "string") {
        dealLabel = objectDeal.deal_name.trim() || null;
      }

      const objectDiscountedPrice =
        toValidNumber(objectDeal.discounted_price) ??
        toValidNumber(objectDeal.discountedPrice);
      if (objectDiscountedPrice !== null) {
        discountedPrice = objectDiscountedPrice;
      }

      if (dealAmount === null) {
        dealAmount =
          toValidNumber(objectDeal.discount_value) ??
          toValidNumber(objectDeal.discountValue);
      }

      if (!dealType) {
        const resolvedDealType =
          typeof objectDeal.discount_type === "string"
            ? objectDeal.discount_type
            : typeof objectDeal.discountType === "string"
              ? objectDeal.discountType
              : null;
        if (resolvedDealType) {
          dealType = resolvedDealType.toLowerCase();
        }
      }
    }

    const normalizedDealType = typeof dealType === "string" ? dealType.toLowerCase() : null;
    const hasNumericDiscount =
      typeof dealAmount === "number" && Number.isFinite(dealAmount) && dealAmount > 0;
    const derivedFixedDiscountFromBase =
      typeof discountedPrice === "number" &&
      Number.isFinite(discountedPrice) &&
      discountedPrice < productBasePrice
        ? Number((productBasePrice - discountedPrice).toFixed(2))
        : null;
    const resolvedOfferLabel = hasNumericDiscount
      ? normalizedDealType === "percentage"
        ? `${dealAmount} % OFF`
        : `${dealAmount} OFF`
      : dealLabel;

    if (
      discountedPrice === null &&
      hasNumericDiscount
    ) {
      if (normalizedDealType === "percentage") {
        discountedPrice = Math.max(
          0,
          Number((productBasePrice - (productBasePrice * dealAmount) / 100).toFixed(2)),
        );
      } else {
        discountedPrice = Math.max(0, Number((productBasePrice - dealAmount).toFixed(2)));
      }
    }

    if (
      typeof discountedPrice !== "number" ||
      !Number.isFinite(discountedPrice) ||
      discountedPrice >= productBasePrice
    ) {
      return {
        basePrice: productBasePrice,
        offerLabel: resolvedOfferLabel ?? null,
        showOriginal: false,
      };
    }

    return {
      basePrice: discountedPrice,
      dealAmount,
      dealType: normalizedDealType,
      derivedFixedDiscountFromBase,
      offerLabel: resolvedOfferLabel ?? null,
      showOriginal: true,
    };
  }, [
    productInfoData.deal,
    productInfoData.dealAmount,
    productInfoData.dealType,
    resolvedProductBasePrice,
  ]);

  React.useEffect(() => {
    if (!ENABLE_PRODUCT_INFO_DEAL_DEBUG) {
      return;
    }

    console.log("[Deliveries][ProductInfo][DealDebug]", {
      productId: productInfoData.productId,
      rawDeal: productInfoData.deal,
      dealType: productInfoData.dealType,
      dealAmount: productInfoData.dealAmount,
      price: productInfoData.price,
      initialBasePrice,
      resolvedBasePrice: detailDealPricing.basePrice,
      resolvedDealType: detailDealPricing.dealType,
      resolvedDealAmount: detailDealPricing.dealAmount,
      derivedFixedDiscountFromBase: detailDealPricing.derivedFixedDiscountFromBase,
      resolvedOfferLabel: detailDealPricing.offerLabel,
      showOriginal: detailDealPricing.showOriginal,
    });
  }, [
    detailDealPricing.basePrice,
    detailDealPricing.dealAmount,
    detailDealPricing.dealType,
    detailDealPricing.derivedFixedDiscountFromBase,
    detailDealPricing.offerLabel,
    detailDealPricing.showOriginal,
    productInfoData.deal,
    productInfoData.dealAmount,
    productInfoData.dealType,
    productInfoData.price,
    productInfoData.productId,
    initialBasePrice,
  ]);
  const effectiveBasePrice = useMemo(() => {
    if (variationOptions.length === 0) {
      return detailDealPricing.basePrice;
    }

    if (!isSelectedVariationReplacingBase) {
      return detailDealPricing.basePrice;
    }

    const selectedBase = selectedVariationPrice;
    if (!detailDealPricing.showOriginal) {
      return selectedBase;
    }

    if (detailDealPricing.dealType === "percentage" && typeof detailDealPricing.dealAmount === "number") {
      return Math.max(
        0,
        Number((selectedBase - (selectedBase * detailDealPricing.dealAmount) / 100).toFixed(2)),
      );
    }

    const fixedDiscount =
      typeof detailDealPricing.dealAmount === "number"
        ? detailDealPricing.dealAmount
        : detailDealPricing.derivedFixedDiscountFromBase ?? 0;

    return Math.max(0, Number((selectedBase - fixedDiscount).toFixed(2)));
  }, [
    detailDealPricing.basePrice,
    detailDealPricing.dealAmount,
    detailDealPricing.dealType,
    detailDealPricing.derivedFixedDiscountFromBase,
    detailDealPricing.showOriginal,
    isSelectedVariationReplacingBase,
    selectedVariationPrice,
    variationOptions.length,
  ]);
  const selectedVariationAddonPrice =
    variationOptions.length > 0 && !isSelectedVariationReplacingBase
      ? selectedVariationPrice
      : 0;
  const configuredUnitPrice =
    effectiveBasePrice + selectedVariationAddonPrice + selectedAddonsTotal;
  const originalUnitPrice =
    resolvedProductBasePrice + selectedVariationAddonPrice + selectedAddonsTotal;
  const shouldShowOriginalPrice = originalUnitPrice > configuredUnitPrice;

  const totalPrice = useMemo(
    () => configuredUnitPrice * quantity,
    [
      configuredUnitPrice,
      quantity,
    ],
  );

  const headerHeight = clampedScrollY.interpolate({
    inputRange: [0, headerCollapseDistance],
    outputRange: [maxHeaderHeight, minHeaderHeight],
    extrapolate: "clamp",
  });

  const imageTranslateY = clampedScrollY.interpolate({
    inputRange: [0, headerCollapseDistance],
    outputRange: [0, -18],
    extrapolate: "clamp",
  });

  const formatPrice = (value: number) => `${currencyLabel} ${value.toFixed(2)}`;

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <StatusBar
        translucent
        backgroundColor="transparent"
        barStyle="light-content"
      />
      <Animated.ScrollView
        bounces={false}
        contentContainerStyle={styles.contentContainer}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { y: scrollY } } }],
          { useNativeDriver: false },
        )}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void onRefresh?.();
            }}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View style={[styles.headerContainer, { height: headerHeight }]}>
          <ImageHeader
            containerStyle={styles.headerFill}
            imageStyle={{
              transform: [{ translateY: imageTranslateY }],
            }}
            imageUri={productInfoData.imageUrl}
            showCloseButton={false}
          />
        </Animated.View>
        <ItemInfo
          description={productInfoData.description}
          name={productInfoData.name}
          offerLabel={detailDealPricing.offerLabel}
          priceLabel={formatPrice(configuredUnitPrice)}
          originalPriceLabel={
            shouldShowOriginalPrice
              ? formatPrice(originalUnitPrice)
              : null
          }
        />

        {hasDetailSections ? (
          <View
            style={[styles.mainDivider, { backgroundColor: colors.border }]}
          />
        ) : null}

        {hasNutritionSection ? (
          <ItemNutritions
            ingredients={productInfoData.ingredients ?? undefined}
            nutrition={productInfoData.nutrition ?? []}
            usage={productInfoData.usage ?? undefined}
          />
        ) : null}

        {isCustomizationsLoading && !customizations ? (
          <ProductInfoCustomizationsLoadingSkeleton />
        ) : null}

        {hasSizes ? (
          <ItemSizes
            formatPrice={formatPrice}
            onSelect={selectVariationOption}
            helperText={variationHelperText}
            selectedVariationKey={selectedVariationKey}
            variations={variationOptions}
          />
        ) : null}

        {hasFlavours ? (
          <ItemFlavour
            formatPrice={formatPrice}
            onToggle={toggleAddonOption}
            sections={addonSections}
            selectedOptionIdsByGroup={selectedAddonOptionIdsByGroup}
          />
        ) : null}

        {hasDetailSections ? (
          <View
            style={[styles.bottomDivider, { backgroundColor: colors.border }]}
          />
        ) : null}
      </Animated.ScrollView>

      <View style={[styles.closeButtonContainer, { top: insets.top + 8 }]}>
        <Pressable
          accessibilityLabel="Go back"
          accessibilityRole="button"
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          onPress={() => navigation.goBack()}
          style={({ pressed }) => [{ opacity: pressed ? 0.7 : 1 }]}
        >
          <View
            style={[
              styles.closeButton,
              {
                backgroundColor: colors.backgroundTertiary,
                shadowColor: colors.shadowColor,
              },
            ]}
          >
            <Ionicons name="close" size={24} color={colors.text} />
          </View>
        </Pressable>
      </View>

      <Footer
        isDisabled={isAddDisabled}
        isSubmitting={isSubmitting}
        onAddToCart={() => {
          void handleAddToCart();
        }}
        onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
        onIncrement={() => setQuantity((current) => current + 1)}
        quantity={quantity}
        totalPriceLabel={formatPrice(totalPrice)}
      />

      <View pointerEvents="box-none" style={StyleSheet.absoluteFill}>
        <DeliveriesFloatingCartButton
          style={[
            styles.floatingCartButton,
            { bottom: insets.bottom + 92 },
          ]}
        />
      </View>

      <CartStoreConflictModal
        isSubmitting={conflictResolution.isResolving}
        onCancel={conflictResolution.cancelResolution}
        onConfirm={() => {
          void conflictResolution.confirmResolution();
        }}
        prompt={conflictResolution.prompt}
        visible={conflictResolution.isVisible}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDivider: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 4,
  },
  container: {
    flex: 1,
  },
  closeButton: {
    alignItems: "center",
    borderRadius: 20,
    height: 40,
    justifyContent: "center",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    width: 40,
  },
  closeButtonContainer: {
    left: 16,
    position: "absolute",
    zIndex: 3,
  },
  contentContainer: {
    paddingBottom: 20,
  },
  floatingCartButton: {
    position: "absolute",
    right: 16,
  },
  headerContainer: {
    overflow: "hidden",
  },
  headerFill: {
    height: "100%",
  },
  mainDivider: {
    height: 1,
    marginHorizontal: 16,
    marginBottom: 4,
    marginTop: 4,
  },
});
