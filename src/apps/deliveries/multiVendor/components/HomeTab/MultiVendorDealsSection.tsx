import React from 'react';
import { useTranslation } from 'react-i18next';
import Deals from '../../../components/deals/Deals';
import { useDeals } from '../../../hooks';

export default function MultiVendorDealsSection() {
  const { t } = useTranslation('deliveries');
  const {
    data: dealsData = [],
    isPending: isDealsPending,
    isError: hasDealsError,
  } = useDeals();

  return (
    <Deals
      actionLabel={t('multi_vendor_see_all')}
      isError={hasDealsError}
      isPending={isDealsPending}
      items={dealsData}
      title={t('multi_vendor_deals_title')}
    />
  );
}
