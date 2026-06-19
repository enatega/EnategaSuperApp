import React, { useCallback, useMemo, useState } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import AppPopup from '../../../../../general/components/AppPopup';
import { useTheme } from '../../../../../general/theme/theme';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useNearbyStores } from '../../../hooks';
import type { DeliveryNearbyStore } from '../../../api/types';
import {
  DiscoveryResultsSkeleton,
} from '../../../components/discovery';
import DeliveriesSectionEmptyState from '../../../components/home/DeliveriesSectionEmptyState';
import StoreCard from '../../../components/storeCard/StoreCard';
import type { MultiVendorStackParamList } from '../../navigation/types';
import type { GenericListFilters } from '../../../components/filters/types';

type NavProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  "SeeAllScreen"
>;

type Props = {
  search?: string;
  selectedCategoryId?: string | null;
  selectedShopTypeId?: string | null;
  filters?: GenericListFilters;
};

export default function NearbyStoreList(props: Props) {
  const { search, selectedCategoryId, selectedShopTypeId, filters } = props;
  const { t } = useTranslation('deliveries');
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();
  const resolvedCategoryIds =
    selectedCategoryId ? [selectedCategoryId] : (filters?.category_ids ?? []);
  const resolvedCategoryId = resolvedCategoryIds[0] ?? undefined;
  const hasSelectedShopTypeProp = Object.prototype.hasOwnProperty.call(
    props,
    'selectedShopTypeId',
  );
  const activeShopTypeId =
    selectedShopTypeId && selectedShopTypeId.trim().length > 0
      ? selectedShopTypeId
      : undefined;
  const shouldSkipBecauseEmptyShopType =
    hasSelectedShopTypeProp && !activeShopTypeId;

  const { data: nearbyStoresData = [], isPending: isNearbyStoresPending } = useNearbyStores({
    enabled: !shouldSkipBecauseEmptyShopType,
    search,
    filters: {
      category_ids: resolvedCategoryIds,
      price_tiers: filters?.price_tiers ?? null,
      address_id: filters?.address_id ?? null,
      stock: filters?.stock ?? null,
      sort_by: filters?.sort_by ?? null,
    },
    requestParams: {
      category_id: resolvedCategoryId,
      shop_type_id: activeShopTypeId,
    },
  });
  const [selectedClosedStore, setSelectedClosedStore] = useState<DeliveryNearbyStore | null>(null);
  const isEmpty = !isNearbyStoresPending && nearbyStoresData.length === 0;
  const shouldShowSeeAll = !isNearbyStoresPending && nearbyStoresData.length > 0;
  const closedStoreTypeName = useMemo(
    () => selectedClosedStore?.shopTypeName?.trim() || t('store_details_closed_store_fallback_name'),
    [selectedClosedStore?.shopTypeName, t],
  );

  const handleSeeAllNearbyRestaurants = useCallback(() => {
    navigation.navigate('SeeAllScreen', {
      queryType: 'nearby-stores',
      title: t('multi_vendor_nearby_store_title'),
      cardType: 'store',
    });
  }, [navigation, t]);

  const renderItem = ({ item }: { item: DeliveryNearbyStore }) => (
    <StoreCard
      store={item}
      showClosedOverlay={item.isOpen === false}
      onClosedPress={item.isOpen === false ? () => setSelectedClosedStore(item) : undefined}
    />
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={shouldShowSeeAll ? t('multi_vendor_see_all') : undefined}
        title={t('multi_vendor_nearby_store_title')}
        onActionPress={handleSeeAllNearbyRestaurants}
      />

      {isNearbyStoresPending ? (
        <DiscoveryResultsSkeleton />
      ) : isEmpty ? (
        <DeliveriesSectionEmptyState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_location_stores_empty')}
        />
      ) : (
        <HorizontalList
          data={nearbyStoresData}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
      )}

      <AppPopup
        description={t('store_details_closed_store_description', { shopTypeName: closedStoreTypeName })}
        dismissOnOverlayPress
        onRequestClose={() => setSelectedClosedStore(null)}
        primaryAction={{
          label: t('store_details_close'),
          onPress: () => setSelectedClosedStore(null),
        }}
        secondaryAction={{
          label: t('store_closed_see_menu'),
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
        title={t('store_closed_modal_title')}
        visible={Boolean(selectedClosedStore)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
