import React from "react";
import { StyleSheet, View } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { useTheme } from "../../../../general/theme/theme";
import DealsSeeAllContainer from "../../components/DealsSeeAll/DealsSeeAllContainer";
import DeliveriesSeeAllHeader from "../SeeAllScreen/components/DeliveriesSeeAllHeader";
import DeliveriesSeeAllFilterSheet from "../SeeAllScreen/components/DeliveriesSeeAllFilterSheet";
import type {
  DeliveryDealsTabType,
  DeliveryDealItem,
} from "../../api/dealsServiceTypes";
import type {
  DealsSeeAllSource,
  DeliveriesStackParamList,
} from "../../navigation/types";
import useDealsSeeAllScreenConfig from "./useDealsSeeAllScreenConfig";
import useDealsSeeAllScreenState from "./useDealsSeeAllScreenState";

function getDealsSectionTitle(
  source: DealsSeeAllSource,
  selectedTab: DeliveryDealsTabType,
  t: (key: string) => string,
) {
  if (source === "single-vendor" || source === "chain-vendor") {
    return t("multi_vendor_deals_title");
  }

  switch (selectedTab) {
    case "limited":
      return t("deals_see_all_section_title_limited");
    case "weekly":
      return t("deals_see_all_section_title_weekly");
    case "all":
    default:
      return t("deals_see_all_section_title");
  }
}

export default function DealsSeeAll() {
  const { colors } = useTheme();
  const { t } = useTranslation("deliveries");
  const navigation =
    useNavigation<NativeStackNavigationProp<DeliveriesStackParamList>>();
  const route = useRoute<RouteProp<DeliveriesStackParamList, "DealsSeeAll">>();
  const source = route.params?.source ?? "multi-vendor";
  const {
    filterValues,
    searchText,
    setSearchText,
    selectedTab,
    setSelectedTab,
    debouncedSearch,
    appliedFilters,
    draftFilters,
    isFilterSheetVisible,
    openFilters,
    closeFilters,
    applyFilters,
    clearDraftFilters,
    toggleCategory,
    selectPrice,
    selectAddress,
    selectStock,
    selectSort,
    hasAppliedFilters,
    hasDraftFilters,
    isMultiVendorSource,
  } = useDealsSeeAllScreenState(source);
  const {
    data,
    isPending,
    isError,
    isRefetching,
    isFetchingNextPage,
    hasNextPage,
    refetch,
    fetchNextPage,
    isTabsVisible,
  } = useDealsSeeAllScreenConfig({
    source,
    filters: appliedFilters,
    search: debouncedSearch,
    selectedTab,
  });

  const handleDealPress = (deal: DeliveryDealItem) => {
    navigation.navigate("ProductInfo", {
      productId: deal.id,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <DeliveriesSeeAllHeader
        searchPlaceholder={t("generic_list_search_placeholder")}
        searchValue={searchText}
        isSearchEditable={true}
        onSearchChangeText={setSearchText}
        onOpenFilters={openFilters}
        onMapPress={() => {}}
        isSearchVisible={true}
        isFilterVisible={isMultiVendorSource}
        isMapVisible={false}
      />
      <DealsSeeAllContainer
        data={data}
        fetchNextPage={fetchNextPage}
        hasNextPage={hasNextPage}
        isError={isError}
        isFetchingNextPage={isFetchingNextPage}
        onDealPress={handleDealPress}
        onTabChange={setSelectedTab}
        isPending={isPending}
        isRefetching={isRefetching}
        isTabsVisible={isTabsVisible}
        refetch={refetch}
        selectedTab={selectedTab}
        title={getDealsSectionTitle(source, selectedTab, t)}
      />
      {isMultiVendorSource ? (
        <DeliveriesSeeAllFilterSheet
          visible={isFilterSheetVisible}
          draftFilters={draftFilters}
          isApplyDisabled={!hasDraftFilters && !hasAppliedFilters}
          onClose={closeFilters}
          onApply={applyFilters}
          onClear={clearDraftFilters}
          onToggleCategory={toggleCategory}
          onSelectPrice={selectPrice}
          onSelectAddress={selectAddress}
          onSelectStock={selectStock}
          onSelectSort={selectSort}
          filters={filterValues?.filters}
        />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
