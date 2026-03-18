import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useNearbyStores } from '../../../hooks';
import type { DeliveryNearbyStore } from '../../../api/types';
import StoreCard from '../../../components/store-card/StoreCard';
import NearbyStoreListSkeleton from './HomeTabSkeletons/NearbyStoreListSkeleton';

type NavProp = NativeStackNavigationProp<Record<string, object | undefined>>;

export default function NearbyStoreList() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const { data: nearbyStoresData = [], isPending: isNearbyStoresPending } = useNearbyStores();
  console.log('nearby_Store_data__',JSON.stringify(nearbyStoresData,null,2));
  

  const handleRestaurantPress = useCallback(
    (store: DeliveryNearbyStore) => {
      navigation.navigate('StoreDetails', { store });
    },
    [navigation],
  );

  const renderItem = ({ item }: { item: DeliveryNearbyStore }) => (
    <StoreCard store={item} onPress={() => handleRestaurantPress(item)} />
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_nearby_store_title')}
      />

      {isNearbyStoresPending ? (
        <NearbyStoreListSkeleton />
      ) : (
        <HorizontalList
          data={nearbyStoresData}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
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
