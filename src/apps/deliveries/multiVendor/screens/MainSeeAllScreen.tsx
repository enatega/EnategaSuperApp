import React, { useEffect, useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
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

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "MainSeeAllScreen"
>;

type MainSeeAllRouteProp = RouteProp<
  MultiVendorStackParamList,
  "MainSeeAllScreen"
>;

export default function MainSeeAllScreen() {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const { t: tGeneral } = useTranslation("general");
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<MainSeeAllRouteProp>();
  const [searchValue, setSearchValue] = useState("");
  const debouncedSearch = useDebouncedValue(searchValue.trim(), 450);
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
  } =
    useShopTypeCategories(selectedShopTypeId, {
      mode: "preview",
      enabled: Boolean(selectedShopTypeId),
    });

  useEffect(() => {
    if (categories.length === 0) {
      if (selectedCategoryId !== null) {
        setSelectedCategoryId(null);
      }
      return;
    }

    const hasSelectedCategory = selectedCategoryId
      ? categories.some((category) => category.id === selectedCategoryId)
      : false;

    if (!hasSelectedCategory) {
      setSelectedCategoryId(categories[0].id);
    }
  }, [categories, selectedCategoryId]);

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
          onSeeAllPress={() => {
            if (!selectedShopTypeId) {
              return;
            }
            navigation.navigate("CategoriesSeeAll", {
              shopTypeId: selectedShopTypeId,
              title: t("multi_vendor_categories_title"),
            });
          }}
          sectionTitle={t("multi_vendor_main_shop_types_title")}
          actionLabel={t("multi_vendor_see_all")}
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
