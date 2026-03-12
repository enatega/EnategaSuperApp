import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import { useTopBrands } from '../../../hooks';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import { styles } from './HomeTabStyle';

export default function HomeTab() {
  const { colors } = useTheme();
  const { data: topBrands = [], isPending: isTopBrandsPending } = useTopBrands();

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <MultiVendorAddressHeader />
      <ShopTypeList />
      <MultiVendorSpecialOffers />
      <TopBrandsList brands={topBrands} isLoading={isTopBrandsPending} />
    </ScrollView>
  );
}
