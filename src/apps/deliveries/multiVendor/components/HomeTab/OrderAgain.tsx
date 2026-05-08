import React from 'react';
import type { BottomTabNavigationProp } from '@react-navigation/bottom-tabs';
import { useNavigation } from '@react-navigation/native';
import { StyleSheet, View } from 'react-native';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import { DiscoverySectionState } from '../../../components/discovery';
import { useOrderAgain } from '../../../hooks';
import ProductCard from '../../../components/productCard/ProductCard';
import StoreMiniCardSkeleton from './HomeTabSkeletons/StoreMiniCardSkeleton';
import type { MultiVendorBottomTabParamList } from '../../navigation/types';
import type { GenericListFilters } from '../../../components/filters/types';

type NavigationProp = BottomTabNavigationProp<MultiVendorBottomTabParamList>;

type Props = {
  search?: string;
  selectedCategoryId?: string | null;
  selectedShopTypeId?: string | null;
  filters?: GenericListFilters;
};

export default function OrderAgain(props: Props) {
  const { search, selectedCategoryId, selectedShopTypeId, filters } = props;
  const { t } = useTranslation('deliveries');
  const resolvedCategoryIds =
    selectedCategoryId ? [selectedCategoryId] : (filters?.category_ids ?? []);
  const resolvedCategoryId = resolvedCategoryIds[0] ?? undefined;
  const hasSelectedShopTypeProp = Object.prototype.hasOwnProperty.call(
    props,
    'selectedShopTypeId',
  );
  const activeShopTypeId =
    selectedShopTypeId && selectedShopTypeId.trim().length > 0
      ? selectedShopTypeId
      : undefined;
  const shouldSkipBecauseEmptyShopType =
    hasSelectedShopTypeProp && !activeShopTypeId;

  const { data: orderAgainData = [], isPending: isOrderAgainPending } = useOrderAgain(
    {
      search,
      category_id: resolvedCategoryId,
      category_ids: resolvedCategoryIds.length > 0 ? resolvedCategoryIds : undefined,
      subcategory_id: undefined,
      shop_type_id: activeShopTypeId,
    },
    {
      enabled: !shouldSkipBecauseEmptyShopType,
    },
  );
  const navigation = useNavigation<NavigationProp>();

  const handleSeeAllPress = () => {
    navigation.navigate('MultiVendorTabOrders');
  };
  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={t('multi_vendor_see_all')}
        title={t('multi_vendor_order_again_title')}
        onActionPress={handleSeeAllPress}
      />

      {isOrderAgainPending ? (
        <StoreMiniCardSkeleton />
      ) : orderAgainData.length === 0 ? (
        <DiscoverySectionState
          title={t('multi_vendor_home_section_empty_title')}
          message={t('multi_vendor_home_section_empty_order_again')}
        />
      ) : (
        <HorizontalList
          data={orderAgainData}
          keyExtractor={(item) => item.productId}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <ProductCard product={item} variant="orderAgain" />
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
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
