import React, { useCallback } from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import Text from '../../general/components/Text';
import HorizontalList from '../../general/components/HorizontalList';
import { useTheme } from '../../general/theme/theme';
import { useRecommendedStores } from '../../apps/deliveries/hooks';
import useAddress from '../../general/hooks/useAddress';
import useCurrentLocation from '../../general/hooks/useCurrentLocation';
import StoreCard from '../../apps/deliveries/components/storeCard/StoreCard';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../apps/deliveries/components/discovery';
import type { DeliveryNearbyStore } from '../../apps/deliveries/api/types';

type Props = {
  onPressStore?: (store: DeliveryNearbyStore) => void;
};

export default function RecommendedStoresSection({ onPressStore }: Props) {
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

  const renderItem = useCallback(
    ({ item }: { item: DeliveryNearbyStore }) => (
      <StoreCard
        store={item}
        onPress={onPressStore ? () => onPressStore(item) : undefined}
      />
    ),
    [onPressStore],
  );

  const isEmpty = !isLoading && !isError && data.length === 0;

  return (
    <View style={styles.section}>
      <Text
        weight="extraBold"
        style={{
          fontSize: typography.size.h5,
          lineHeight: typography.lineHeight.h5,
          letterSpacing: -0.36,
          color: colors.text,
        }}
      >
        {t('Recommended_restaurants')}
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
        <DiscoverySectionState
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
