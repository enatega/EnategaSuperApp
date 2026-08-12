import React, { useCallback, useEffect, useState } from "react";
import { FlatList, StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import Text from "../../../../../general/components/Text";
import { useTheme } from "../../../../../general/theme/theme";
import CategorySeeAllGridEmptyState from "../../../components/categorySeeAll/CategorySeeAllGridEmptyState";
import CategorySeeAllGridErrorState from "../../../components/categorySeeAll/CategorySeeAllGridErrorState";
import CategorySeeAllGridSkeleton from "../../../components/categorySeeAll/CategorySeeAllGridSkeleton";
import type { DeliveryShopTypeCategory } from "../../../api/categoriesServicesTypes";
import { usePaginatedShopTypes, useShopTypeCategories } from "../../../hooks";
import type { MultiVendorStackParamList } from "../../navigation/types";
import ShopTypeCategoryCard from "./ShopTypeCategoryCard";
import ShopTypeSelectorRail from "./ShopTypeSelectorRail";

type NavigationProp = NativeStackNavigationProp<MultiVendorStackParamList>;

export default function ShopTypesSeeAllContainer() {
  const navigation = useNavigation<NavigationProp>();
  const { colors, typography } = useTheme();
  const { t } = useTranslation("deliveries");
  const [selectedShopTypeId, setSelectedShopTypeId] = useState("");
  const shopTypesQuery = usePaginatedShopTypes({ mode: "paginated" });
  const shopTypes = shopTypesQuery.data ?? [];
  const categoriesQuery = useShopTypeCategories(selectedShopTypeId, {
    mode: "paginated",
    enabled: Boolean(selectedShopTypeId),
  });
  const categories = categoriesQuery.data ?? [];

  useEffect(() => {
    if (!selectedShopTypeId && shopTypes.length > 0) {
      setSelectedShopTypeId(shopTypes[0].id);
    }
  }, [selectedShopTypeId, shopTypes]);

  const handleCategoryPress = useCallback(
    (category: DeliveryShopTypeCategory) => {
      navigation.navigate("MainSeeAllScreen", {
        initialShopTypeId: selectedShopTypeId,
        initialCategoryId: category.id,
      });
    },
    [navigation, selectedShopTypeId],
  );

  if (shopTypesQuery.isPending) return <CategorySeeAllGridSkeleton />;

  if (shopTypesQuery.isError) {
    return (
      <CategorySeeAllGridErrorState
        isRetrying={shopTypesQuery.isRefetching}
        onRetry={() => void shopTypesQuery.refetch()}
      />
    );
  }

  return (
    <FlatList<DeliveryShopTypeCategory>
      data={categories}
      numColumns={2}
      keyExtractor={(category) => category.id}
      columnWrapperStyle={styles.categoryRow}
      contentContainerStyle={styles.content}
      ListHeaderComponent={
        <View style={styles.header}>
          <Text color={colors.mutedText} style={styles.subtitle}>
            {t("multi_vendor_shop_types_subtitle")}
          </Text>
          <ShopTypeSelectorRail
            items={shopTypes}
            selectedShopTypeId={selectedShopTypeId}
            onSelect={setSelectedShopTypeId}
            onEndReached={() => {
              if (
                shopTypesQuery.hasNextPage &&
                !shopTypesQuery.isFetchingNextPage
              ) {
                void shopTypesQuery.fetchNextPage();
              }
            }}
          />
          <Text
            weight="extraBold"
            style={{
              fontSize: typography.size.lg,
              lineHeight: typography.lineHeight.lg,
            }}
          >
            {t("multi_vendor_categories_title")}
          </Text>
        </View>
      }
      ListEmptyComponent={
        categoriesQuery.isPending ? (
          <CategorySeeAllGridSkeleton />
        ) : categoriesQuery.isError ? (
          <CategorySeeAllGridErrorState
            isRetrying={categoriesQuery.isRefetching}
            onRetry={() => void categoriesQuery.refetch()}
          />
        ) : (
          <CategorySeeAllGridEmptyState />
        )
      }
      onEndReached={() => {
        if (
          categoriesQuery.hasNextPage &&
          !categoriesQuery.isFetchingNextPage
        ) {
          void categoriesQuery.fetchNextPage();
        }
      }}
      onEndReachedThreshold={0.4}
      renderItem={({ item }) => (
        <ShopTypeCategoryCard item={item} onPress={handleCategoryPress} />
      )}
      showsVerticalScrollIndicator={false}
    />
  );
}

const styles = StyleSheet.create({
  categoryRow: {
    justifyContent: "space-between",
  },
  content: {
    flexGrow: 1,
    gap: 12,
    paddingBottom: 28,
    paddingHorizontal: 16,
  },
  header: {
    gap: 20,
    marginBottom: 6,
  },
  subtitle: {
    textAlign: "center",
  },
});
