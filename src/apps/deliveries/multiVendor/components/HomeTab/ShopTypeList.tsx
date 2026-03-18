import React from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useShopTypeProductsSections, useShopTypes } from '../../../hooks';
import ShopTypeCardSkeleton from './HomeTabSkeletons/ShopTypeCardSkeleton';
import MultiVendorShopTypeCard from './ShopTypeCard';
import ShopTypeProductList from './ShopTypeProductList';

export default function ShopTypeList() {
  const { t } = useTranslation('deliveries');
  const { data: shopTypes = [], isPending } = useShopTypes();
  const shopTypeProductSections = useShopTypeProductsSections(shopTypes);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_shop_types_title')}
      />

      {isPending ? (
        <ShopTypeCardSkeleton />
      ) : (
        <HorizontalList
          data={shopTypes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <MultiVendorShopTypeCard
              image={{ uri: item.image ?? '' }}
              title={item.name}
            />
          )}
        />
      )}

      {shopTypeProductSections.map(
        ({ shopType, data = [], error, isPending: isProductsPending }) => (
          <ShopTypeProductList
            key={shopType.id}
            errorMessage={error?.message}
            isLoading={isProductsPending}
            products={data}
            title={shopType.name}
          />
        ),
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    gap: 18,
    paddingHorizontal: 20,
  },
  listContent: {
    paddingRight: 4,
  },
  separator: {
    width: 14,
  },
});
