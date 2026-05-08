import React from 'react';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTheme } from '../../../../../general/theme/theme';
import ScreenHeader from '../../../../../general/components/ScreenHeader';
import CategoriesSeeAllContainer from '../../components/CategoriesSeeAll/CategoriesSeeAllContainer';
import type { MultiVendorStackParamList } from '../../navigation/types';

type CategoriesSeeAllRoute = RouteProp<
  MultiVendorStackParamList,
  'CategoriesSeeAll'
>;

export default function CategoriesSeeAll() {
  const { colors } = useTheme();
  const navigation = useNavigation();
  const route = useRoute<CategoriesSeeAllRoute>();
  const { shopTypeId, title } = route.params;

  return (
    <View style={[styles.screen, { backgroundColor: colors.background }]}> 
      <ScreenHeader showBack={navigation.canGoBack()} />
      <CategoriesSeeAllContainer shopTypeId={shopTypeId} title={title} />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1 },
});
