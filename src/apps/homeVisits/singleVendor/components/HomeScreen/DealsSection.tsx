import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../../general/components/discovery';
import type { HomeVisitsSingleVendorDeal } from '../../api/types';
import useSingleVendorDeals from '../../hooks/useSingleVendorDeals';
import type { HomeVisitsSingleVendorNavigationParamList } from '../../navigation/types';
import ServicesCard from '../../../components/ServicesCard';

export default function DealsSection() {
  const { t } = useTranslation('homeVisits');
  const navigation =
    useNavigation<NativeStackNavigationProp<HomeVisitsSingleVendorNavigationParamList>>();
  const { data: deals = [], isPending, isError } = useSingleVendorDeals();
  const isEmpty = !isPending && !isError && deals.length === 0;

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsSingleVendorDeal }) => <ServicesCard item={item} />,
    [],
  );

  const keyExtractor = useCallback(
    (item: HomeVisitsSingleVendorDeal) => `${item.productId}-${item.serviceCenterId}`,
    [],
  );

  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('SeeAllScreen', {
      queryType: 'deals-services',
      title: t('single_vendor_deals_title'),
      scope: 'single-vendor',
      cardType: 'service',
    });
  }, [navigation, t]);

  return (
    <View style={styles.section}>
      <SectionActionHeader
        title={t('single_vendor_deals_title')}
        actionLabel={t('single_vendor_see_all')}
        onActionPress={handleSeeAllPress}
      />

      {isPending ? (
        <DiscoveryResultsSkeleton />
      ) : isError ? (
        <DiscoverySectionState
          tone="error"
          title={t('single_vendor_home_section_error_title')}
          message={t('single_vendor_home_section_error_message')}
        />
      ) : isEmpty ? (
        <DiscoverySectionState
          title={t('single_vendor_home_section_empty_title')}
          message={t('single_vendor_home_section_empty_message')}
        />
      ) : (
        <HorizontalList
          data={deals}
          keyExtractor={keyExtractor}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
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
