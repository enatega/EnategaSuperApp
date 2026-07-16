import React from 'react';
import { RouteProp, useRoute } from '@react-navigation/native';
import { useTranslation } from 'react-i18next';
import SeeAllScreen from '../../../../general/screens/SeeAllScreen/SeeAllScreen';
import HomeVisitsSelectedFilterChips from '../../components/filters/HomeVisitsSelectedFilterChips';
import ServicesCard from '../../components/ServicesCard';
import HomeVisitsSeeAllFilterSheet from './components/HomeVisitsSeeAllFilterSheet';
import HomeVisitsSeeAllHeader from './components/HomeVisitsSeeAllHeader';
import useHomeVisitsSeeAllScreenState from './useHomeVisitsSeeAllScreenState';
import useHomeVisitsSeeAllScreenConfig from './useHomeVisitsSeeAllScreenConfig';
import type {
  HomeVisitsSingleVendorCategoryService,
  HomeVisitsSingleVendorDeal,
  HomeVisitsSingleVendorMostPopularService,
  HomeVisitsSingleVendorNearbyService,
} from '../../singleVendor/api/types';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../singleVendor/navigation/types';
import type { MultiVendorStackParamList } from '../../multiVendor/navigation/types';
import type { HomeVisitsMultiVendorNearbyService } from '../../multiVendor/api/types';
import type { ChainStackParamList } from '../../chain/navigation/types';

type HomeVisitsSingleVendorSeeAllItem =
  | HomeVisitsSingleVendorNearbyService
  | HomeVisitsSingleVendorMostPopularService
  | HomeVisitsSingleVendorDeal
  | HomeVisitsSingleVendorCategoryService
  | HomeVisitsMultiVendorNearbyService;

type SeeAllRouteProp = RouteProp<HomeVisitsSingleVendorNavigationParamList, 'SeeAllScreen'>;
type MultiVendorSeeAllRouteProp = RouteProp<MultiVendorStackParamList, 'MultiVendorSeeAll'>;
type ChainSeeAllRouteProp = RouteProp<ChainStackParamList, 'ChainSeeAll'>;
type HomeVisitsSeeAllRouteParams =
  (
    | SeeAllRouteProp['params']
    | MultiVendorSeeAllRouteProp['params']
    | ChainSeeAllRouteProp['params']
  ) & {
    mainServiceId?: string;
    providerId?: string;
  };

export default function HomeVisitsSeeAllScreen() {
  const { t } = useTranslation('homeVisits');
  const route = useRoute<
    SeeAllRouteProp | MultiVendorSeeAllRouteProp | ChainSeeAllRouteProp
  >();
  const params = route.params as HomeVisitsSeeAllRouteParams;
  const {
    queryType,
    title,
    categoryId,
    mainServiceId,
    providerId,
    latitude,
    longitude,
    scope = 'single-vendor',
    cardType = 'service',
    cardVariant = 'default',
  } = params;
  void cardType;
  void cardVariant;

  const state = useHomeVisitsSeeAllScreenState({ t });
  const {
    listQuery,
    itemKeyExtractor,
    loadingComponent,
    paginationLoadingComponent,
    isNearbyLocationMissing,
  } = useHomeVisitsSeeAllScreenConfig({
    enabled: true,
    scope,
    queryType,
    filters: state.appliedFilters,
    search: state.debouncedSearch,
    categoryId,
    mainServiceId,
    providerId,
    latitude,
    longitude,
  });

  return (
    <SeeAllScreen<HomeVisitsSingleVendorSeeAllItem>
      title={title}
      data={listQuery.data}
      isPending={listQuery.isPending}
      isError={listQuery.isError}
      error={listQuery.error}
      refetch={listQuery.refetch}
      hasNextPage={listQuery.hasNextPage}
      isFetchingNextPage={listQuery.isFetchingNextPage}
      fetchNextPage={listQuery.fetchNextPage}
      isRefetching={listQuery.isRefetching}
      itemKeyExtractor={itemKeyExtractor}
      chips={state.chips}
      clearAllLabel={t('clear_all')}
      onRemoveChip={state.removeChip}
      onClearAll={state.clearAllFilters}
      renderSelectedFilters={({ chips, clearAllLabel, onRemoveChip, onClearAll }) => (
        <HomeVisitsSelectedFilterChips
          chips={chips}
          clearAllLabel={clearAllLabel}
          onRemoveChip={onRemoveChip}
          onClearAll={onClearAll}
        />
      )}
      renderItemCard={(item) => (
        <ServicesCard
          bookingFlow={
            scope === 'multi-vendor' || scope === 'chain'
              ? 'multiVendor'
              : undefined
          }
          item={item}
          layout="fullWidth"
        />
      )}
      header={
        <HomeVisitsSeeAllHeader
          searchPlaceholder={t('home_visits_see_all_search_placeholder')}
          searchValue={state.searchText}
          onSearchChangeText={state.setSearchText}
          isSearchEditable
          onOpenFilters={state.openFilters}
          onMapPress={() => {}}
          isSearchVisible
          isFilterVisible
          isMapVisible={false}
        />
      }
      filterSheet={
        <HomeVisitsSeeAllFilterSheet
          visible={state.isFilterSheetVisible}
          filters={state.draftFilters}
          isApplyDisabled={!state.hasDraftFilters && !state.hasAppliedFilters}
          onClose={state.closeFilters}
          onApply={state.applyFilters}
          onClear={state.clearDraftFilters}
          onSelectStock={state.selectStock}
          onSelectPriceTiers={state.selectPriceTiers}
          onSelectSortBy={state.selectSortBy}
        />
      }
      loadingComponent={loadingComponent}
      paginationLoadingComponent={paginationLoadingComponent}
      emptyTitle={t('single_vendor_home_section_empty_title')}
      emptyDescription={
        isNearbyLocationMissing
            ? t('single_vendor_nearby_location_select_address_message')
            : t('single_vendor_home_section_empty_message')
      }
    />
  );
}
