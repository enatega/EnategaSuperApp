import React, { useMemo, useRef, useState } from "react";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import {
  Animated,
  Pressable,
  RefreshControl,
  StyleSheet,
  View,
  useWindowDimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useTheme } from "../../../../general/theme/theme";
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from "../../api/productInfoServiceTypes";
import CartStoreConflictModal from "../cart/CartStoreConflictModal";
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

const formatPrice = (value: number) => `$ ${value.toFixed(2)}`;

type Props = {
  data: ProductInfoResponse;
  customizations?: ProductInfoCustomizationsResponse;
  isCustomizationsLoading?: boolean;
  isRefreshing?: boolean;
  onRefresh?: () => void | Promise<void>;
};

export default function MainContainer({
  data: productInfoData,
  customizations,
  isCustomizationsLoading = false,
  isRefreshing = false,
  onRefresh,
}: Props) {
  const { colors } = useTheme();
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
  const effectiveBasePrice = variationOptions.length > 0
    ? selectedVariationPrice
    : productInfoData.price;
  const configuredUnitPrice = effectiveBasePrice + selectedAddonsTotal;

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

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
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
          priceLabel={formatPrice(configuredUnitPrice)}
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
