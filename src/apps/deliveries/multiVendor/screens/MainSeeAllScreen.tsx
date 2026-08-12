import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../general/theme/theme";
import useDebouncedValue from "../../../../general/hooks/useDebouncedValue";
import DeliveriesSeeAllHeader from "../../screens/SeeAllScreen/components/DeliveriesSeeAllHeader";
import DeliveriesSeeAllFilterSheet from "../../screens/SeeAllScreen/components/DeliveriesSeeAllFilterSheet";
import MultiVendorDealsSection from "../components/HomeTab/MultiVendorDealsSection";
import OrderAgain from "../components/HomeTab/OrderAgain";
import SelectedFilterChips from "../../components/filters/SelectedFilterChips";
import {
  MainSeeAllCategoriesSection,
  MainSeeAllShopTypeTabs,
} from "../components/MainSeeAll";
import useGenericListFilters from "../../hooks/filterablePaginatedList/useGenericListFilters";
import {
  useFilterValues,
  useShopTypeCategories,
  useShopTypes,
} from "../../hooks";
import type { MultiVendorStackParamList } from "../navigation/types";
import NearbyStoreList from "../components/HomeTab/NearbyStoreList";

type MainSeeAllRouteProp = RouteProp<
  MultiVendorStackParamList,
  "MainSeeAllScreen"
>;

export default function MainSeeAllScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const { t: tGeneral } = useTranslation("general");
  const route = useRoute<MainSeeAllRouteProp>();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 450);
  const initialCategoryId = route.params?.initialCategoryId;
  const initialShopTypeId = route.params?.initialShopTypeId;

  const { data: shopTypes = [] } = useShopTypes();
  const { data: filterValues } = useFilterValues();
  const filterState = useGenericListFilters({
    filterData: filterValues?.filters,
  });
  const [selectedShopTypeId, setSelectedShopTypeId] = useState<string>("");
  const [selectedCategoryId, setSelectedCategoryId] = useState<string | null>(
    null,
  );
  const [hasAppliedInitialCategory, setHasAppliedInitialCategory] = useState(
    !initialCategoryId,
  );

  useEffect(() => {
    if (!selectedShopTypeId && initialShopTypeId && shopTypes.some((item) => item.id === initialShopTypeId)) {
      setSelectedShopTypeId(initialShopTypeId);
      return;
    }

    if (!selectedShopTypeId && shopTypes.length > 0) {
      setSelectedShopTypeId(shopTypes[0].id);
    }
  }, [initialShopTypeId, selectedShopTypeId, shopTypes]);

  const {
    data: categories = [],
    isPending: isCategoriesPending,
    isError: hasCategoriesError,
    fetchNextPage: fetchNextCategoriesPage,
    hasNextPage: hasNextCategoriesPage,
    isFetchingNextPage: isFetchingNextCategoriesPage,
  } =
    useShopTypeCategories(selectedShopTypeId, {
      mode: "paginated",
      enabled: Boolean(selectedShopTypeId),
    });

  useEffect(() => {
    if (categories.length === 0) {
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

    const hasInitialCategory = !hasAppliedInitialCategory && initialCategoryId
      ? categories.some((category) => category.id === initialCategoryId)
      : false;
    const hasSelectedCategory = selectedCategoryId
      ? categories.some((category) => category.id === selectedCategoryId)
      : false;

    if (hasInitialCategory && initialCategoryId) {
      if (selectedCategoryId !== initialCategoryId) {
        setSelectedCategoryId(initialCategoryId);
      }
      setHasAppliedInitialCategory(true);
      return;
    }

    if (
      !hasAppliedInitialCategory &&
      initialCategoryId &&
      hasNextCategoriesPage &&
      !isFetchingNextCategoriesPage
    ) {
      void fetchNextCategoriesPage();
      return;
    }

    if (!hasSelectedCategory) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [
    categories,
    fetchNextCategoriesPage,
    hasAppliedInitialCategory,
    hasNextCategoriesPage,
    initialCategoryId,
    isFetchingNextCategoriesPage,
    selectedCategoryId,
  ]);

  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategoryId((prev) => (prev === categoryId ? null : categoryId));
  };

  const handleShopTypeSelect = (shopTypeId: string) => {
    setSelectedShopTypeId(shopTypeId);
    setSelectedCategoryId(null);
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <DeliveriesSeeAllHeader
        searchPlaceholder={t("generic_list_search_placeholder")}
        searchValue={searchValue}
        isSearchEditable={true}
        onSearchChangeText={setSearchValue}
        onOpenFilters={filterState.openFilters}
        onMapPress={() => {}}
        isSearchVisible={true}
        isFilterVisible={true}
        isMapVisible={false}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <SelectedFilterChips
          chips={filterState.chips}
          clearAllLabel={tGeneral("clear_all")}
          onRemoveChip={filterState.removeChip}
          onClearAll={filterState.clearAllFilters}
        />
      </View>

      <MainSeeAllShopTypeTabs
        items={shopTypes}
        selectedShopTypeId={selectedShopTypeId || null}
        onSelectShopType={handleShopTypeSelect}
      />

      <ScrollView
        contentContainerStyle={styles.contentContainer}
        showsVerticalScrollIndicator={false}
      >
        <MainSeeAllCategoriesSection
          categories={categories}
          isPending={isCategoriesPending}
          isError={hasCategoriesError}
          selectedCategoryId={selectedCategoryId}
          onSelectCategory={handleCategorySelect}
          onEndReached={() => {
            if (hasNextCategoriesPage && !isFetchingNextCategoriesPage) {
              void fetchNextCategoriesPage();
            }
          }}
          sectionTitle={t("multi_vendor_main_shop_types_title")}
        />

        <NearbyStoreList
          search={debouncedSearch}
          selectedCategoryId={selectedCategoryId}
          selectedShopTypeId={selectedShopTypeId}
          filters={filterState.appliedFilters}
        />

        <OrderAgain
          search={debouncedSearch}
          selectedCategoryId={selectedCategoryId}
          selectedShopTypeId={selectedShopTypeId}
          filters={filterState.appliedFilters}
        />

        <MultiVendorDealsSection
          search={debouncedSearch}
          selectedCategoryId={selectedCategoryId}
          selectedShopTypeId={selectedShopTypeId}
          filters={filterState.appliedFilters}
        />
      </ScrollView>

      <DeliveriesSeeAllFilterSheet
        isCategoryVisible={false}
        visible={filterState.isFilterSheetVisible}
        draftFilters={filterState.draftFilters}
        isApplyDisabled={
          !filterState.hasDraftFilters && !filterState.hasAppliedFilters
        }
        onClose={filterState.closeFilters}
        onApply={filterState.applyFilters}
        onClear={filterState.clearDraftFilters}
        onToggleCategory={filterState.toggleCategory}
        onSelectPrice={filterState.selectPrice}
        onSelectAddress={filterState.selectAddress}
        onSelectStock={filterState.selectStock}
        onSelectSort={filterState.selectSort}
        filters={filterValues?.filters}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 12,
    paddingBottom: 28,
    paddingVertical: 16,
  },
  screen: {
    flex: 1,
  },
});
