import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import {
  CompositeNavigationProp,
  useNavigation,
} from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import Text from '../../../../../general/components/Text';
import HorizontalList from '../../../../../general/components/HorizontalList';
import { useTheme } from '../../../../../general/theme/theme';
import { useShopTypeStoresSections, useShopTypes } from '../../../hooks';
import StoreCard from '../../../components/storeCard/StoreCard';
import { DeliveriesStackParamList } from '../../../navigation/types';
import { MultiVendorStackParamList } from '../../navigation/types';
import DeliveriesSectionEmptyState from '../../../components/home/DeliveriesSectionEmptyState';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../components/discovery';

type NavProp = CompositeNavigationProp<
  NativeStackNavigationProp<MultiVendorStackParamList>,
  NativeStackNavigationProp<DeliveriesStackParamList>
>;

export default function ShopTypeStoreSections() {
  const { t } = useTranslation('deliveries');
  const { typography } = useTheme();
  const navigation = useNavigation<NavProp>();
  const { data: shopTypes = [] } = useShopTypes();
  const shopTypeStoreSections = useShopTypeStoresSections(shopTypes);

  const handleShopTypeSeeAll = useCallback(
    (shopTypeId: string, title: string) => {
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title,
        cardType: 'store',
        shopTypeId,
      });
    },
    [navigation],
  );



  return (
    <View style={styles.container}>
      {shopTypeStoreSections.map(
        ({ shopType, data = [], error, isPending: isStoresPending }) => {
          const isEmpty = !isStoresPending && !error && data.length === 0;
          const shouldShowSeeAll = !isStoresPending && !error && data.length > 0;

          return (
            <View key={shopType.id} style={styles.storeSection}>
              {!shouldShowSeeAll ? (
                <Text
                  weight="extraBold"
                  style={{
                    fontSize: typography.size.h5,
                    letterSpacing: -0.36,
                    lineHeight: typography.lineHeight.h5,
                  }}
                >
                  {shopType.name}
                </Text>
              ) : (
                <SectionActionHeader
                  title={shopType.name}
                  actionLabel={t('multi_vendor_see_all')}
                  onActionPress={() => handleShopTypeSeeAll(shopType.id, shopType.name)}
                />
              )}

              {isStoresPending ? (
                <DiscoveryResultsSkeleton />
              ) : error ? (
                <DiscoverySectionState
                  tone="error"
                  title={t('multi_vendor_home_section_error_title')}
                  message={t('multi_vendor_home_section_error_message')}
                />
              ) : isEmpty ? (
                <DeliveriesSectionEmptyState
                  title={t('multi_vendor_home_section_empty_title')}
                  message={t('multi_vendor_shop_type_stores_empty')}
                />
              ) : (
                <HorizontalList
                  data={data}
                  keyExtractor={(item) => item.storeId}
                  contentContainerStyle={styles.listContent}
                  ItemSeparatorComponent={() => <View style={styles.separator} />}
                  renderItem={({ item }) => <StoreCard store={item} />}
                />
              )}
            </View>
          );
        },
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 12,
  },
  storeSection: {
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
