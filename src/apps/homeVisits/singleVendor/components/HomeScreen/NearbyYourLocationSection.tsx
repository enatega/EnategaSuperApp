import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../../general/components/discovery';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import type { HomeVisitsSingleVendorNearbyService } from '../../api/types';
import useSingleVendorNearbyServices from '../../hooks/useSingleVendorNearbyServices';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../navigation/types';
import ServicesCard from '../../../components/ServicesCard';

type Props = {
  latitude?: number;
  longitude?: number;
};

export default function NearbyYourLocationSection({
  latitude,
  longitude,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const {
    data: nearbyServices = [],
    isPending,
    isError,
    isEnabled,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useSingleVendorNearbyServices({ latitude, longitude });

  const isEmpty = !isPending && !isError && nearbyServices.length === 0;

  const handleSeeAllNearbyServices = useCallback(() => {
    navigation.navigate('SeeAllScreen', {
      queryType: 'nearby-services',
      title: t('single_vendor_nearby_location_title'),
      scope: 'single-vendor',
      cardType: 'service',
      latitude,
      longitude,
    });
  }, [latitude, longitude, navigation, t]);
  
  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsSingleVendorNearbyService }) => (
      <ServicesCard item={item} />
    ),
    [],
  );

  const keyExtractor = useCallback(
    (item: HomeVisitsSingleVendorNearbyService) =>
      `${item.productId}-${item.serviceCenterId}`,
    [],
  );

  const handleEndReached = useCallback(() => {
    if (!hasNextPage || isFetchingNextPage) {
      return;
    }

    void fetchNextPage();
  }, [fetchNextPage, hasNextPage, isFetchingNextPage]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={t('single_vendor_nearby_location_title')}
        actionLabel={t('single_vendor_see_all')}
        onActionPress={handleSeeAllNearbyServices}
      />

      {!isEnabled ? (
        <DiscoverySectionState
          title={t('single_vendor_home_section_empty_title')}
          message={t('single_vendor_nearby_location_select_address_message')}
        />
      ) : isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('single_vendor_home_section_error_title')}
          message={t('single_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('single_vendor_home_section_empty_title')}
          message={t('single_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={nearbyServices}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          onEndReached={handleEndReached}
          onEndReachedThreshold={0.6}
        />
      )}
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
