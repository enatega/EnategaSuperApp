import React, { useState } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { RouteProp, useNavigation, useRoute } from "@react-navigation/native";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { useTranslation } from "react-i18next";
import { GenericFilterablePaginatedListScreen } from "../../../components/filterablePaginatedList";
import type { GenericListFilters } from "../../../components/filters";
import {
  useFilterValues,
  useNearbyStores,
  useShopTypeProducts,
} from "../../../hooks";
import type {
  MultiVendorStackParamList,
  SeeAllItem,
} from "../../navigation/types";
import VerticalStoreListSkeleton from "../../components/HomeTab/HomeTabSkeletons/VerticalStoreListSkeleton";
import SeeAllHeader from "./components/SeeAllHeader";
import SeeAllFilterSheet from "./components/SeeAllFilterSheet";
import useDebouncedValue from "../../../../../general/hooks/useDebouncedValue";
import useGenericListFilters from "../../../hooks/filterablePaginatedList/useGenericListFilters";

function useSeeAllNearbyStores({
  enabled,
  filters,
  search,
}: {
  enabled: boolean;
  filters: GenericListFilters;
  search: string;
}) {
  return useNearbyStores({
    mode: "paginated",
    enabled,
    filters,
    search,
  });
}

function useSeeAllShopTypeProducts({
  enabled,
  filters,
  search,
  shopTypeId,
}: {
  enabled: boolean;
  filters: GenericListFilters;
  search: string;
  shopTypeId?: string;
}) {
  return useShopTypeProducts(shopTypeId ?? "", {
    mode: "paginated",
    filters,
    search,
    enabled: enabled && Boolean(shopTypeId),
  });
}

type SeeAllScreenConfig = {
  useListQuery: (params: {
    enabled: boolean;
    filters: GenericListFilters;
    search: string;
  }) => {
    data: SeeAllItem[];
    totalCount?: number;
    isPending: boolean;
    isError: boolean;
    error?: Error | null;
    refetch: () => Promise<unknown> | unknown;
    hasNextPage?: boolean;
    isFetchingNextPage: boolean;
    fetchNextPage: () => Promise<unknown> | unknown;
    isRefetching: boolean;
  };
  itemKeyExtractor: (item: SeeAllItem, index: number) => string;
  loadingComponent: React.ReactNode;
  paginationLoadingComponent: React.ReactNode;
};

function getSeeAllScreenConfig(params: {
  queryType: MultiVendorStackParamList["SeeAllScreen"]["queryType"];
  shopTypeId?: string;
}): SeeAllScreenConfig {
  if (params.queryType === "shop-type-products") {
    return {
      useListQuery: (queryParams) =>
        useSeeAllShopTypeProducts({
          ...queryParams,
          shopTypeId: params.shopTypeId,
        }),
      itemKeyExtractor: (item, index) =>
        "productId" in item
          ? `${item.productId}-${item.storeId}-${index}`
          : `${item.storeId}-${index}`,
      loadingComponent: <VerticalStoreListSkeleton />,
      paginationLoadingComponent: <VerticalStoreListSkeleton />,
    };
  }

  return {
    useListQuery: useSeeAllNearbyStores,
    itemKeyExtractor: (item, index) =>
      "productId" in item ? `${item.productId}-${index}` : item.storeId,
    loadingComponent: <VerticalStoreListSkeleton />,
    paginationLoadingComponent: <VerticalStoreListSkeleton />,
  };
}

export default function SeeAllScreen() {
  const { t } = useTranslation("deliveries");
  const navigation =
    useNavigation<NativeStackNavigationProp<MultiVendorStackParamList>>();
  const route =
    useRoute<RouteProp<MultiVendorStackParamList, "SeeAllScreen">>();
  const { queryType, title, shopTypeId } = route.params;
  const screenConfig = getSeeAllScreenConfig({
    queryType,
    shopTypeId,
  });
  const { data: filterValues } = useFilterValues();
  const [searchText, setSearchText] = useState("");
  const debouncedSearch = useDebouncedValue(searchText.trim(), 500);
  const {
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
  } = useGenericListFilters({
    filterData: filterValues?.filters,
  });
  const listQuery = screenConfig.useListQuery({
    enabled: true,
    filters: appliedFilters,
    search: debouncedSearch,
  });
  const items = listQuery.data ?? [];

  const header = (
    <SeeAllHeader
      searchPlaceholder={t("generic_list_search_placeholder")}
      searchValue={searchText}
      onSearchChangeText={setSearchText}
      isSearchEditable={true}
      onOpenFilters={openFilters}
      onMapPress={() =>
        navigation.navigate("SeeAllMapView", {
          items,
          title,
        })
      }
      isSearchVisible={true}
      isFilterVisible={true}
      isMapVisible={true}
    />
  );

  const filterSheet = (
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
  );

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
        itemKeyExtractor={screenConfig.itemKeyExtractor}
        chips={chips}
        clearAllLabel={t("clear_all")}
        onRemoveChip={removeChip}
        onClearAll={clearAllFilters}
        header={header}
        filterSheet={filterSheet}
        emptyTitle={t("generic_list_empty_title")}
        emptyDescription={t("generic_list_empty_description")}
        loadingComponent={screenConfig.loadingComponent}
        paginationLoadingComponent={screenConfig.paginationLoadingComponent}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
  },
});
