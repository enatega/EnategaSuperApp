import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTheme } from '../../../../../general/theme/theme';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import MultiVendorShopTypeCard from '../../components/HomeTab/ShopTypeCard';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';

const shopTypeImages = {
  gift: {
    uri: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?auto=format&fit=crop&w=240&q=80',
  },
  milk: {
    uri: 'https://images.unsplash.com/photo-1563636619-e9143da7973b?auto=format&fit=crop&w=240&q=80',
  },
  flower: {
    uri: 'https://images.unsplash.com/photo-1527061011665-3652c757a4d4?auto=format&fit=crop&w=240&q=80',
  },
  liquor: {
    uri: 'https://images.unsplash.com/photo-1569529465841-dfecdab7503b?auto=format&fit=crop&w=240&q=80',
  },
} as const;

export default function HomeTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');

  const shopTypes = [
    {
      id: 'gift',
      image: shopTypeImages.gift,
      title: t('multi_vendor_shop_type_gift'),
    },
    {
      id: 'milk',
      image: shopTypeImages.milk,
      title: t('multi_vendor_shop_type_milk'),
    },
    {
      id: 'flower',
      image: shopTypeImages.flower,
      title: t('multi_vendor_shop_type_flower'),
    },
    {
      id: 'liquor',
      image: shopTypeImages.liquor,
      title: t('multi_vendor_shop_type_liquor'),
    },
  ];

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <MultiVendorAddressHeader />

      <View style={styles.section}>
        <SectionActionHeader
          actionLabel={t('multi_vendor_see_all')}
          title={t('multi_vendor_shop_types_title')}
        />

        <HorizontalList
          data={shopTypes}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.shopTypesListContent}
          ItemSeparatorComponent={() => <View style={styles.shopTypeSeparator} />}
          renderItem={({ item }) => (
            <MultiVendorShopTypeCard
              image={item.image}
              title={item.title}
            />
          )}
        />
      </View>

      <MultiVendorSpecialOffers />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  contentContainer: {
    gap: 28,
    paddingBottom: 28,
  },
  section: {
    gap: 18,
    paddingHorizontal: 20,
  },
  shopTypesListContent: {
    paddingRight: 4,
  },
  shopTypeSeparator: {
    width: 14,
  },
});
