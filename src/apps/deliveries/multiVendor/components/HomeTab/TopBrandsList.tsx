import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { useTopBrands } from '../../../hooks';
import TopBrandsListSkeleton from './HomeTabSkeletons/TopBrandsListSkeleton';
import TopBrandCard from '../../../components/storeCard/TopBrandCard';
import type { MultiVendorStackParamList } from '../../navigation/types';

type NavigationProp = NativeStackNavigationProp<
  MultiVendorStackParamList,
  'TopBrandsSeeAll'
>;

export default function TopBrandsList() {
  const { t } = useTranslation('deliveries');
  const navigation = useNavigation<NavigationProp>();
  const { data: topBrands = [], isPending: isTopBrandsPending } = useTopBrands();
  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('TopBrandsSeeAll');
  }, [navigation]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_top_brands_title')}
        onActionPress={handleSeeAllPress}
      />

      {isTopBrandsPending ? (
        <TopBrandsListSkeleton />
      ) : (
        <HorizontalList
          data={topBrands}
          keyExtractor={(item, index) => `${item.name}-${index}`}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => <TopBrandCard brand={item} />}
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
