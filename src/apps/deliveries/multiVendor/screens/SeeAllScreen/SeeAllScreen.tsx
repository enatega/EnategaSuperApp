import React, { useEffect, useMemo, useRef, useState } from "react";
import { Keyboard, Pressable, StyleSheet } from "react-native";
import { RouteProp, useRoute } from "@react-navigation/native";
import { useTranslation } from "react-i18next";
import { GenericFilterablePaginatedListScreen } from "../../../components/filterablePaginatedList";
import type { GenericListFilters } from "../../../components/filters";
import { useNearbyStores, useShopTypeProducts } from "../../../hooks";
import type {
  DeliveryNearbyStore,
  DeliveryShopTypeProduct,
} from "../../../api/types";
import type { MultiVendorStackParamList } from "../../navigation/types";
import VerticalStoreListSkeleton from "../../components/HomeTab/HomeTabSkeletons/VerticalStoreListSkeleton";
import SeeAllHeader from "./components/SeeAllHeader";
import SeeAllFilterSheet from "./components/SeeAllFilterSheet";
import { getSeeAllFilterOptions } from "./components/seeAllFilterOptions";
import useDebouncedValue from "../../../../../general/hooks/useDebouncedValue";
import useGenericListFilters from "../../../hooks/filterablePaginatedList/useGenericListFilters";
import SeeAllMapView from "./components/SeeAllMapView";
import {
  SEE_ALL_DEFAULT_USER_COORDINATE,
  toSeeAllMapStore,
  type SeeAllMapStore,
} from "./components/mapStoreUtils";

function useSeeAllNearbyStores({
  filters,
  search,
}: {
  filters: GenericListFilters;
  search: string;
}) {
  return useNearbyStores({
    mode: "paginated",
    filters,
    search,
  });
}

function useSeeAllShopTypeProducts({
  filters: _filters,
  search,
  shopTypeId,
}: {
  filters: GenericListFilters;
  search: string;
  shopTypeId?: string;
}) {
  return useShopTypeProducts(shopTypeId ?? "", {
    mode: "paginated",
    search,
    enabled: Boolean(shopTypeId),
  });
}

type SeeAllItem = DeliveryNearbyStore | DeliveryShopTypeProduct;

type SeeAllScreenConfig = {
  useListQuery: (params: {
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
  const route =
    useRoute<RouteProp<MultiVendorStackParamList, "SeeAllScreen">>();
  const { queryType, title, shopTypeId } = route.params;
  const screenConfig = getSeeAllScreenConfig({
    queryType,
    shopTypeId,
  });
  const filterOptions = getSeeAllFilterOptions(t);
  const [searchText, setSearchText] = useState("");
  const [isMapMode, setIsMapMode] = useState(false);
  const [selectedStoreId, setSelectedStoreId] = useState<string | null>(null);
  const wasMapModeRef = useRef(false);
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
    selectSort,
    removeChip,
    chips,
    hasAppliedFilters,
    hasDraftFilters,
  } = useGenericListFilters({
    filterOptions,
  });
  const listQuery = screenConfig.useListQuery({
    filters: appliedFilters,
    search: debouncedSearch,
  });
  const items = listQuery.data ?? [];
  const mapStores = useMemo<SeeAllMapStore[]>(
    () => items.map((item, index) => toSeeAllMapStore(item, index)),
    [items],
  );
  const selectableMapStores = useMemo(
    () => mapStores.filter((store) => Boolean(store.coordinate)),
    [mapStores],
  );

  useEffect(() => {
    const wasMapMode = wasMapModeRef.current;
    wasMapModeRef.current = isMapMode;

    if (isMapMode && !wasMapMode && !selectedStoreId) {
      setSelectedStoreId(selectableMapStores[0]?.id ?? null);
      return;
    }

    if (!isMapMode) {
      return;
    }

    if (!selectedStoreId) {
      return;
    }

    if (selectableMapStores.some((store) => store.id === selectedStoreId)) {
      return;
    }

    setSelectedStoreId(null);
  }, [isMapMode, selectableMapStores, selectedStoreId]);

  const header = (
    <SeeAllHeader
      searchPlaceholder={t("generic_list_search_placeholder")}
      searchValue={searchText}
      onSearchChangeText={setSearchText}
      isSearchEditable={true}
      onOpenFilters={openFilters}
      onMapPress={() => setIsMapMode(true)}
      isSearchVisible={true}
      isFilterVisible={true}
      isMapVisible={true}
    />
  );

  const filterSheet = (
    <SeeAllFilterSheet
      visible={isFilterSheetVisible}
      draftFilters={draftFilters}
      resultCount={listQuery.totalCount}
      isApplyDisabled={!hasDraftFilters && !hasAppliedFilters}
      onClose={closeFilters}
      onApply={applyFilters}
      onClear={clearDraftFilters}
      onToggleCategory={toggleCategory}
      onSelectPrice={selectPrice}
      onSelectAddress={selectAddress}
      onSelectSort={selectSort}
      clearAllLabel={t("clear_all")}
    />
  );

  if (isMapMode) {
    return (
      <>
        <SeeAllMapView
          stores={mapStores}
          userCoordinate={SEE_ALL_DEFAULT_USER_COORDINATE}
          selectedStoreId={selectedStoreId}
          isLoading={listQuery.isPending && items.length === 0}
          loadingTitle={t("see_all_map_loading_title", { title })}
          loadingDescription={t("see_all_map_loading_description")}
          bottomSheetTitle={t("see_all_map_sheet_title")}
          ctaLabel={t("see_all_map_cta")}
          onBackPress={() => setIsMapMode(false)}
          onListPress={() => setIsMapMode(false)}
          onSelectStore={setSelectedStoreId}
          onCloseSheet={() => setSelectedStoreId(null)}
          onViewStore={() => setIsMapMode(false)}
        />
        {filterSheet}
      </>
    );
  }

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
