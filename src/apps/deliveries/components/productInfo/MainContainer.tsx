import React, { useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "../../../../general/theme/theme";
import type {
  ProductInfoCustomizationsResponse,
  ProductInfoResponse,
} from "../../api/productInfoServiceTypes";
import Footer from "./Footer";
import ImageHeader from "./ImageHeader";
import ItemFlavour from "./ItemFlavour";
import ItemInfo from "./ItemInfo";
import ItemNutritions from "./ItemNutritions";
import ItemSizes from "./ItemSizes";
import ProductInfoCustomizationsLoadingSkeleton from "./ProductInfoCustomizationsLoadingSkeleton";
import useProductSelectionState from "./useProductSelectionState";

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
  const [quantity, setQuantity] = useState(1);
  const variations = customizations?.variations ?? [];
  const addons = customizations?.addons ?? [];

  const {
    addonItems,
    selectedAddonIds,
    selectedAddonsTotal,
    selectedVariationId,
    selectedVariationPrice,
    setSelectedVariationId,
    toggleAddon,
  } = useProductSelectionState({ addons, variations });

  const hasNutritionSection = Boolean(
    productInfoData.ingredients?.trim() ||
      productInfoData.usage?.trim() ||
      productInfoData.nutrition?.length,
  );
  const hasSizes = variations.length > 0;
  const hasFlavours = addonItems.length > 0;
  const hasCustomizationSection = hasSizes || hasFlavours;
  const hasDetailSections =
    hasNutritionSection || hasCustomizationSection || isCustomizationsLoading;

  const totalPrice = useMemo(
    () => (productInfoData.price + selectedVariationPrice + selectedAddonsTotal) * quantity,
    [
      productInfoData.price,
      quantity,
      selectedAddonsTotal,
      selectedVariationPrice,
    ],
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <ScrollView
        bounces={false}
        contentContainerStyle={styles.contentContainer}
        refreshControl={
          <RefreshControl
            onRefresh={() => {
              void onRefresh?.();
            }}
            refreshing={isRefreshing}
            tintColor={colors.primary}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <ImageHeader imageUri={productInfoData.imageUrl} />
        <ItemInfo
          description={productInfoData.description}
          name={productInfoData.name}
          priceLabel={formatPrice(productInfoData.price)}
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
            onSelect={setSelectedVariationId}
            selectedId={selectedVariationId || variations[0]?.groupId || ""}
            variations={variations}
          />
        ) : null}

        {hasFlavours ? (
          <ItemFlavour
            formatPrice={formatPrice}
            helperText={addons[0]?.helperText}
            items={addonItems}
            onToggle={toggleAddon}
            selectedIds={selectedAddonIds}
          />
        ) : null}

        {hasDetailSections ? (
          <View
            style={[styles.bottomDivider, { backgroundColor: colors.border }]}
          />
        ) : null}
      </ScrollView>

      <Footer
        onDecrement={() => setQuantity((current) => Math.max(1, current - 1))}
        onIncrement={() => setQuantity((current) => current + 1)}
        quantity={quantity}
        totalPriceLabel={formatPrice(totalPrice)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  bottomDivider: {
    height: 1,
    marginHorizontal: 16,
    marginTop: 20,
  },
  container: {
    flex: 1,
  },
  contentContainer: {
    paddingBottom: 24,
  },
  mainDivider: {
    height: 1,
    marginHorizontal: 16,
    marginVertical: 16,
  },
});
