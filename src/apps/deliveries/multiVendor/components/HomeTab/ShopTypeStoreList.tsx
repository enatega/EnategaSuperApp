import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import type { DeliveryNearbyStore } from '../../../api/types';
import StoreCard from '../../../components/storeCard/StoreCard';
import type { MultiVendorStackParamList } from '../../navigation/types';
import HomeSectionState from './HomeSectionState';
import NearbyStoreListSkeleton from './HomeTabSkeletons/NearbyStoreListSkeleton';

type Props = {
  errorMessage?: string;
  isLoading: boolean;
  shopTypeId: string;
  stores: DeliveryNearbyStore[];
  title: string;
};

type NavProp = NativeStackNavigationProp<MultiVendorStackParamList, 'SeeAllScreen'>;

export default function ShopTypeStoreList({
  errorMessage,
  isLoading,
  shopTypeId,
  stores,
  title,
}: Props) {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavProp>();
  const hasError = Boolean(errorMessage);
  const isEmpty = !isLoading && !hasError && stores.length === 0;
  const handleSeeAllPress = useCallback(
    () =>
      navigation.navigate('SeeAllScreen', {
        queryType: 'shop-type-stores',
        title,
        cardType: 'store',
        shopTypeId,
      }),
    [navigation, shopTypeId, title],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        onActionPress={handleSeeAllPress}
        title={title}
      />

      {isLoading ? (
        <NearbyStoreListSkeleton />
      ) : hasError ? (
        <HomeSectionState
          message={errorMessage ?? t('multi_vendor_shop_type_stores_error')}
          tone="error"
        />
      ) : isEmpty ? (
        <HomeSectionState message={t('multi_vendor_shop_type_stores_empty')} />
      ) : (
        <HorizontalList
          data={stores}
          keyExtractor={(item) => item.storeId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <StoreCard store={item} />}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 12,
  },
  listContent: {
    paddingRight: 16,
  },
  separator: {
    width: 12,
  },
});
