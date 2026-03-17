import React, { useCallback } from 'react';
import { ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTheme } from '../../../../../general/theme/theme';
import MultiVendorAddressHeader from '../../components/HomeTab/AddressHeader';
import ShopTypeList from '../../components/HomeTab/ShopTypeList';
import MultiVendorSpecialOffers from '../../components/HomeTab/SpecialOffersBanner';
import TopBrandsList from '../../components/HomeTab/TopBrandsList';
import NearbyStoreList from '../../components/HomeTab/NearbyStoreList';
import Deals from '../../components/HomeTab/Deals';
import OrderAgain from '../../components/HomeTab/OrderAgain';
import { styles } from './HomeTabStyle';

type NavProp = NativeStackNavigationProp<Record<string, object | undefined>>;

export default function HomeTab() {
  const { colors } = useTheme();
  const navigation = useNavigation<NavProp>();

  const handleAddressPress = useCallback(() => {
    navigation.navigate('AddressSearch', {});
  }, [navigation]);

  return (
    <ScrollView
      contentContainerStyle={[styles.contentContainer, { backgroundColor: colors.background }]}
      showsVerticalScrollIndicator={false}
      style={{ backgroundColor: colors.background }}
    >
      <MultiVendorAddressHeader onAddressPress={handleAddressPress} />
      <ShopTypeList />
      <MultiVendorSpecialOffers />
      <ShopTypeList />
      <TopBrandsList />
      <NearbyStoreList />
      <Deals />
      <OrderAgain />
    </ScrollView>
  );
}
