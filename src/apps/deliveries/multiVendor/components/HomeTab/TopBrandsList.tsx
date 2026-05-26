import React, { useCallback } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useNearbyStores, useTopBrands } from '../../../hooks';
import type { DeliveryTopBrand } from '../../../api/types';
import TopBrandsListSkeleton from './HomeTabSkeletons/TopBrandsListSkeleton';
import TopBrandCard from '../../../components/storeCard/TopBrandCard';
import DeliveriesSectionEmptyState from '../../../components/home/DeliveriesSectionEmptyState';
import type { MultiVendorStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  'TopBrandsSeeAll'
>;

export default function TopBrandsList() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const { data: topBrands = [], isPending: isTopBrandsPending } = useTopBrands();
  const { data: nearbyStores = [] } = useNearbyStores();
  const shouldShowSeeAll = !isTopBrandsPending && topBrands.length > 0;
  const isEmpty = !isTopBrandsPending && topBrands.length === 0;
  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('TopBrandsSeeAll');
  }, [navigation]);

  const resolveStoreFromBrand = useCallback((brand: DeliveryTopBrand) => {
    const normalizedBrandName = brand.name.trim().toLowerCase();

    const exactMatch = nearbyStores.find(
      (store) => store.name.trim().toLowerCase() === normalizedBrandName,
    );

    if (exactMatch) {
      return exactMatch;
    }

    return nearbyStores.find((store) =>
      store.name.trim().toLowerCase().includes(normalizedBrandName),
    );
  }, [nearbyStores]);

  const handleTopBrandPress = useCallback((brand: DeliveryTopBrand) => {
    const matchedStore = resolveStoreFromBrand(brand);

    if (matchedStore) {
      navigation.navigate('StoreDetails', { store: matchedStore });
      return;
    }

    if (!brand.vendorId) {
      return;
    }

    navigation.navigate('SeeAllScreen', {
      queryType: 'top-brand-stores',
      title: brand.name,
      cardType: 'store',
      vendorId: brand.vendorId,
    });
  }, [navigation, resolveStoreFromBrand]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={shouldShowSeeAll ? t('multi_vendor_see_all') : undefined}
        title={t('multi_vendor_top_brands_title')}
        onActionPress={handleSeeAllPress}
      />

      {isTopBrandsPending ? (
        <TopBrandsListSkeleton />
      ) : isEmpty ? (
        <DeliveriesSectionEmptyState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={topBrands}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={item.name}
              onPress={() => handleTopBrandPress(item)}
              disabled={!item.vendorId}
            >
              <TopBrandCard brand={item} />
            </Pressable>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 8,
    paddingHorizontal: 16,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
