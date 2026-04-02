import React from 'react';
import { useTranslation } from 'react-i18next';
import SingleVendorTabPlaceholder from '../../components/navigation/SingleVendorTabPlaceholder';

export default function SearchScreen() {
  const { t } = useTranslation('deliveries');

  return (
    <SingleVendorTabPlaceholder
      message={t('single_vendor_tab_search_placeholder')}
      title={t('single_vendor_tab_search')}
    />
  );
}
