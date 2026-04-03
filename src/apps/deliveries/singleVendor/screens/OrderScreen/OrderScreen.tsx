import React from 'react';
import { useTranslation } from 'react-i18next';
import SingleVendorTabPlaceholder from '../../components/navigation/SingleVendorTabPlaceholder';

export default function OrderScreen() {
  const { t } = useTranslation('deliveries');

  return (
    <SingleVendorTabPlaceholder
      message={t('single_vendor_tab_orders_placeholder')}
      title={t('single_vendor_tab_orders')}
    />
  );
}
