import React from 'react';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useTranslation } from 'react-i18next';
import Deals from '../../../components/deals/Deals';
import { useDeals } from '../../../hooks';
import type { DeliveriesStackParamList } from '../../../navigation/types';

type NavigationProp = NativeStackNavigationProp<DeliveriesStackParamList>;

export default function MultiVendorDealsSection() {
  const { t } = useTranslation('deliveries');
  const {
    data: dealsData = [],
    isPending: isDealsPending,
    isError: hasDealsError,
  } = useDeals();
  const navigation = useNavigation<NavigationProp>();

  return (
    <Deals
      actionLabel={t('multi_vendor_see_all')}
      isError={hasDealsError}
      isPending={isDealsPending}
      items={dealsData}
      onActionPress={() => {
        navigation.navigate('DealsSeeAll');
      }}
      title={t('multi_vendor_deals_title')}
    />
  );
}
