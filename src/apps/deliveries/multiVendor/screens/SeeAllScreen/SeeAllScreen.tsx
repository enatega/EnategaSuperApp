import React from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { GenericFilterablePaginatedListScreen } from "../../../components/filterablePaginatedList";
import type {
  MultiVendorStackParamList,
  SeeAllItem,
} from "../../navigation/types";
import SeeAllHeader from "./components/SeeAllHeader";
import SeeAllFilterSheet from "./components/SeeAllFilterSheet";
import useSeeAllScreenConfig from "./useSeeAllScreenConfig";
import useSeeAllScreenState from "./useSeeAllScreenState";

export default function SeeAllScreen() {
  const { t } = useTranslation("deliveries");
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route =
    useRoute<RouteProp<MultiVendorStackParamList, "SeeAllScreen">>();
  const { queryType, title, shopTypeId, vendorId } = route.params;
  const {
    filterValues,
    searchText,
    setSearchText,
    debouncedSearch,
    appliedFilters,
    draftFilters,
    isFilterSheetVisible,
    openFilters,
    closeFilters,
    applyFilters,
    clearAllFilters,
    clearDraftFilters,
    toggleCategory,
    selectPrice,
    selectAddress,
    selectStock,
    selectSort,
    removeChip,
    chips,
    hasAppliedFilters,
    hasDraftFilters,
  } = useSeeAllScreenState();
  const {
    listQuery,
    itemKeyExtractor,
    loadingComponent,
    paginationLoadingComponent,
  } = useSeeAllScreenConfig({
    enabled: true,
    filters: appliedFilters,
    search: debouncedSearch,
    queryType,
    shopTypeId,
    vendorId,
  });
  const items = listQuery.data ?? [];
  const isMapVisible =
    listQuery.isPending || listQuery.isRefetching || items.length > 0;

  return (
    <Pressable style={styles.screen} onPress={() => Keyboard.dismiss()}>
      <GenericFilterablePaginatedListScreen<SeeAllItem, "store">
        title={title}
        cardType="store"
        data={items}
        totalCount={listQuery.totalCount}
        isPending={listQuery.isPending}
        isError={listQuery.isError}
        error={listQuery.error}
        refetch={listQuery.refetch}
        hasNextPage={listQuery.hasNextPage}
        isFetchingNextPage={listQuery.isFetchingNextPage}
        fetchNextPage={listQuery.fetchNextPage}
        isRefetching={listQuery.isRefetching}
        itemKeyExtractor={itemKeyExtractor}
        chips={chips}
        clearAllLabel={t("clear_all")}
        onRemoveChip={removeChip}
        onClearAll={clearAllFilters}
        header={
          <SeeAllHeader
            searchPlaceholder={t("generic_list_search_placeholder")}
            searchValue={searchText}
            onSearchChangeText={setSearchText}
            isSearchEditable={true}
            onOpenFilters={openFilters}
            onMapPress={() => {
              if (!items.length) return;
              navigation.navigate("SeeAllMapView", {
                items,
                title,
              });
            }}
            isSearchVisible={true}
            isFilterVisible={true}
            isMapVisible={isMapVisible}
          />
        }
        filterSheet={
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
        }
        emptyTitle={t("generic_list_empty_title")}
        emptyDescription={t("generic_list_empty_description")}
        loadingComponent={loadingComponent}
        paginationLoadingComponent={paginationLoadingComponent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
