import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTheme } from '../../../../../general/theme/theme';
import { useShopTypes } from '../../../hooks';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import MultiVendorShopTypeCard from '../../components/HomeTab/ShopTypeCard';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import ShopTypeCardSkeleton from '../../components/HomeTabSkeletons/ShopTypeCardSkeleton';

export default function HomeTab() {
  const { colors } = useTheme();
  const { t } = useTranslation('deliveries');
  const { data: shopTypes = [], isPending } = useShopTypes();

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

        {isPending ? (
          <ShopTypeCardSkeleton />
        ) : (
          <HorizontalList
            data={shopTypes}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.shopTypesListContent}
            ItemSeparatorComponent={() => <View style={styles.shopTypeSeparator} />}
            renderItem={({ item }) => (
              <MultiVendorShopTypeCard
                image={{ uri: item.image ?? '' }}
                title={item.name}
              />
            )}
          />
        )}
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
