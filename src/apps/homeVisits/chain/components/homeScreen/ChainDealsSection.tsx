import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import {
  DiscoveryResultsSkeleton,
  DiscoverySectionState,
} from '../../../../../general/components/discovery';
import HorizontalList from '../../../../../general/components/HorizontalList';
import SectionActionHeader from '../../../../../general/components/SectionActionHeader';
import ServicesCard from '../../../components/ServicesCard';
import type { HomeVisitsMultiVendorDeal } from '../../../multiVendor/api/types';
import type { ChainStackParamList } from '../../navigation/types';
import useChainDeals from '../../hooks/useChainDeals';

type Props = {
  isTemplatePending?: boolean;
};

export default function ChainDealsSection({
  isTemplatePending = false,
}: Props) {
  const { t } = useTranslation('homeVisits');
  const navigation = useNavigation<NativeStackNavigationProp<ChainStackParamList>>();
  const {
    data: deals = [],
    isPending,
    isError,
  } = useChainDeals();
  const isLoading = isTemplatePending || isPending;
  const isEmpty = !isLoading && !isError && deals.length === 0;

  const handleSeeAllPress = useCallback(() => {
    navigation.navigate('ChainSeeAll', {
      scope: 'chain',
      queryType: 'deals-services',
      title: t('multi_vendor_deals_title'),
      cardType: 'service',
    });
  }, [navigation, t]);

  const renderItem = useCallback(
    ({ item }: { item: HomeVisitsMultiVendorDeal }) => (
      <ServicesCard bookingFlow="multiVendor" item={item} />
    ),
    [],
  );

  return (
    <View style={styles.section}>
      <SectionActionHeader
        actionLabel={deals.length > 0 ? t('single_vendor_see_all') : undefined}
        title={t('multi_vendor_deals_title')}
        onActionPress={handleSeeAllPress}
      />

      {isLoading ? (
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
          message={t('multi_vendor_deals_empty')}
        />
      ) : (
        <HorizontalList
          data={deals}
          keyExtractor={(item, index) =>
            `${item.productId}-${item.serviceCenterId}-${index}`
          }
          contentContainerStyle={styles.listContent}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={renderItem}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  listContent: {
    paddingRight: 16,
  },
  section: {
    gap: 12,
    paddingHorizontal: 16,
  },
  separator: {
    width: 12,
  },
});
