import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../../../general/components/Text';
import HorizontalList from '../../../../general/components/HorizontalList';
import { useTheme } from '../../../../general/theme/theme';
import { useRecommendedStores } from '../../hooks';
import useAddress from '../../../../general/hooks/useAddress';
import useCurrentLocation from '../../../../general/hooks/useCurrentLocation';
import StoreCard from '../storeCard/StoreCard';
import DeliveriesSectionEmptyState from './DeliveriesSectionEmptyState';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../discovery';
import type { DeliveryNearbyStore } from '../../api/types';
import type { SelectMiniAppFn } from '../../../registry/homeSections/types';

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function DeliveriesRecommendedStoresSection({
  onSelectMiniApp,
}: Props) {
  const { typography, colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const { latitude: selectedLatitude, longitude: selectedLongitude } = useAddress();
  const { currentCoordinates } = useCurrentLocation();

  const latitude = currentCoordinates?.latitude ?? selectedLatitude;
  const longitude = currentCoordinates?.longitude ?? selectedLongitude;

  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useRecommendedStores({
    mode: 'paginated',
    enabled: typeof latitude === 'number' && typeof longitude === 'number',
    requestParams: {
      // latitude,
      // longitude,
      sort_by: 'recommended',
    },
  });

  const handleLoadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      void fetchNextPage();
    }
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  const handlePressStore = useCallback(
    (store: DeliveryNearbyStore) => {
      onSelectMiniApp?.('deliveries', {
        screen: 'MultiVendor',
        params: {
          screen: 'StoreDetails',
          params: { store },
        },
      });
    },
    [onSelectMiniApp],
  );

  const renderItem = useCallback(
    ({ item }: { item: DeliveryNearbyStore }) => (
      <StoreCard store={item} onPress={() => handlePressStore(item)} />
    ),
    [handlePressStore],
  );

  const isEmpty = !isLoading && !isError && data.length === 0;

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          fontSize: typography.size.lg,
          lineHeight: typography.lineHeight.md,
          color: colors.text,
        }}
      >
        {t('multi_vendor_recommended_restaurants_title')}
      </Text>

      {isLoading ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('multi_vendor_home_section_error_title')}
          message={t('multi_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DeliveriesSectionEmptyState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={data}
          keyExtractor={(item, index) => `${item.storeId}-${index}`}
          renderItem={renderItem}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          contentContainerStyle={styles.content}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.4}
          ListFooterComponent={
            isFetchingNextPage ? (
              <View style={styles.loader}>
                <ActivityIndicator color={colors.primary} size="small" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  content: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
  loader: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 8,
  },
});
