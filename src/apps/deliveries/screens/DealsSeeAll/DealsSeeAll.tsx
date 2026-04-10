import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useNavigation } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import useDebouncedValue from "../../../../general/hooks/useDebouncedValue";
import { useTheme } from "../../../../general/theme/theme";
import DealsSeeAllContainer from "../../components/DealsSeeAll/DealsSeeAllContainer";
import SeeAllHeader from "../SeeAllScreen/components/SeeAllHeader";
import SeeAllFilterSheet from "../SeeAllScreen/components/SeeAllFilterSheet";
import { useFilterValues } from "../../hooks";
import useGenericListFilters from "../../hooks/filterablePaginatedList/useGenericListFilters";
import type { DeliveryDealsTabType, DeliveryDealItem } from "../../api/dealsServiceTypes";
import type { DeliveriesStackParamList } from "../../navigation/types";

function getDealsSectionTitle(
  selectedTab: DeliveryDealsTabType,
  t: (key: string) => string,
) {
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
  const { data: filterValues } = useFilterValues();
  const [searchText, setSearchText] = useState("");
  const [selectedTab, setSelectedTab] = useState<DeliveryDealsTabType>("all");
  const debouncedSearch = useDebouncedValue(searchText.trim(), 450);
  const {
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
  } = useGenericListFilters({
    filterData: filterValues?.filters,
  });

  const handleDealPress = (deal: DeliveryDealItem) => {
    navigation.navigate("ProductInfo", {
      productId: deal.id,
    });
  };

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}>
      <SeeAllHeader
        searchPlaceholder={t("generic_list_search_placeholder")}
        searchValue={searchText}
        isSearchEditable={true}
        onSearchChangeText={setSearchText}
        onOpenFilters={openFilters}
        onMapPress={() => {}}
        isSearchVisible={true}
        isFilterVisible={true}
        isMapVisible={false}
      />
      <DealsSeeAllContainer
        filters={appliedFilters}
        onDealPress={handleDealPress}
        onTabChange={setSelectedTab}
        search={debouncedSearch}
        selectedTab={selectedTab}
        title={getDealsSectionTitle(selectedTab, t)}
      />
      <SeeAllFilterSheet
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
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
