import React from 'react';
import { ScrollView } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import { styles } from './HomeTabStyle';

export default function HomeTab() {
  const { colors } = useTheme();

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <MultiVendorAddressHeader />
      <ShopTypeList />
      <MultiVendorSpecialOffers />
    </ScrollView>
  );
}
