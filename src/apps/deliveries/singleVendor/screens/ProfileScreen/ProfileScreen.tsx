import React from 'react';
import { useTranslation } from 'react-i18next';
import SingleVendorTabPlaceholder from '../../components/navigation/SingleVendorTabPlaceholder';

export default function ProfileScreen() {
  const { t } = useTranslation('deliveries');

  return (
    <SingleVendorTabPlaceholder
      message={t('single_vendor_tab_profile_placeholder')}
      title={t('single_vendor_tab_profile')}
    />
  );
}
