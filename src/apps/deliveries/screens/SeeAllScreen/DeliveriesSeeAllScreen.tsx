import React, { useCallback, useMemo, useState } from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import SeeAllScreen from '../../../../general/screens/SeeAllScreen/SeeAllScreen';
import type { SupportedCardType } from '../../../../general/components/filterablePaginatedList';
import SelectedFilterChips from '../../components/filters/SelectedFilterChips';
import type { GenericFilterChip } from '../../components/filters/types';
import type { DeliveriesSeeAllParamList, SeeAllItem } from '../../navigation/sharedTypes';
import DeliveriesSeeAllHeader from './components/DeliveriesSeeAllHeader';
import DeliveriesSeeAllFilterSheet from './components/DeliveriesSeeAllFilterSheet';
import { renderSeeAllItemCard } from './components/renderers';
import useDeliveriesSeeAllScreenConfig from './useDeliveriesSeeAllScreenConfig';
import useDeliveriesSeeAllScreenState from './useDeliveriesSeeAllScreenState';
import type { DeliveryNearbyStore } from '../../api/types';
import AppPopup from '../../../../general/components/AppPopup';
import { G } from 'react-native-svg';
import { useTheme } from '../../../../general/theme/theme';

type NavigationProp = NativeStackNavigationProp<DeliveriesSeeAllParamList>;
type SeeAllRouteProp = RouteProp<DeliveriesSeeAllParamList, 'SeeAllScreen'>;

export default function DeliveriesSeeAllScreen() {
  const { t } = useTranslation('general');
  const { colors } = useTheme();
  const navigation = useNavigation<NavigationProp>();
  const route = useRoute<SeeAllRouteProp>();
  const { queryType, title, shopTypeId, vendorId, categoryId, cardType, cardVariant } =
    route.params;

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
  } = useDeliveriesSeeAllScreenState();
  const [selectedClosedStore, setSelectedClosedStore] = useState<DeliveryNearbyStore | null>(null);

  const {
    listQuery,
    itemKeyExtractor,
    loadingComponent,
    paginationLoadingComponent,
  } = useDeliveriesSeeAllScreenConfig({
    enabled: true,
    filters: appliedFilters,
    search: debouncedSearch,
    queryType,
    shopTypeId,
    vendorId,
    categoryId,
  });


  const items = listQuery.data ?? [];
  const closedStoreTypeName = useMemo(
    () => selectedClosedStore?.shopTypeName?.trim() || t('store_details_closed_store_fallback_name', { ns: 'deliveries' }),
    [selectedClosedStore?.shopTypeName, t],
  );

  console.log("my items are :", items);
  const isMapVisible =
    cardType === 'product'
      ? false
      : listQuery.isPending || listQuery.isRefetching || items.length > 0;

  const handleMapPress = useCallback(() => {
    if (!items.length) {
      return;
    }

    navigation.navigate('SeeAllMapView', {
      items,
      title,
    });
  }, [items, navigation, title]);

  const renderItemCard = useCallback(
    (item: SeeAllItem) =>
      renderSeeAllItemCard(
        cardType as SupportedCardType,
        item,
        undefined,
        cardVariant,
        true,
        {
          showClosedOverlay: true,
          onClosedPress: (store) => {
            setSelectedClosedStore(store);
          },
        },
      ),
    [cardType, cardVariant],
  );

  return (
    <>
      <SeeAllScreen<SeeAllItem, GenericFilterChip>
        title={title}
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
        clearAllLabel={t('clear_all')}
        onRemoveChip={removeChip}
        onClearAll={clearAllFilters}
        renderSelectedFilters={({ chips, clearAllLabel, onRemoveChip, onClearAll }) => (
          <SelectedFilterChips
            chips={chips}
            clearAllLabel={clearAllLabel}
            onRemoveChip={onRemoveChip}
            onClearAll={onClearAll}
          />
        )}
        renderItemCard={renderItemCard}
        header={
          <DeliveriesSeeAllHeader
            searchPlaceholder={t('generic_list_search_placeholder')}
            searchValue={searchText}
            onSearchChangeText={setSearchText}
            isSearchEditable
            onOpenFilters={openFilters}
            onMapPress={handleMapPress}
            isSearchVisible
            isFilterVisible
            isMapVisible={isMapVisible}
          />
        }
        filterSheet={
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
        }
        emptyTitle={t('generic_list_empty_title')}
        emptyDescription={t('generic_list_empty_description')}
        loadingComponent={loadingComponent}
        paginationLoadingComponent={paginationLoadingComponent}
      />

      <AppPopup
        description={t(
          'store_details_closed_store_description',
          { shopTypeName: closedStoreTypeName, ns: 'deliveries' },
        )}
        dismissOnOverlayPress
        onRequestClose={() => setSelectedClosedStore(null)}
        primaryAction={{
          label: t('store_details_close', { ns: 'deliveries' }),
          onPress: () => setSelectedClosedStore(null),
        }}
        secondaryAction={{
          label: t('store_closed_see_menu', { ns: 'deliveries' }),
          onPress: () => {
            if (!selectedClosedStore) {
              return;
            }

            navigation.navigate('StoreDetails', { store: selectedClosedStore });
            setSelectedClosedStore(null);
          },
          variant: 'secondary',
          labelStyle: { color: colors.primary },
        }}
        title={t('store_closed_modal_title', { ns: 'deliveries' })}
        visible={Boolean(selectedClosedStore)}
      />
    </>
  );
}
