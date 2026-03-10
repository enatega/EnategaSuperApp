import React from 'react';
import { useTranslation } from 'react-i18next';
import TabPlaceholder from '../../components/TabPlaceholder';

export default function SearchTab() {
  const { t } = useTranslation('deliveries');

  return <TabPlaceholder label={t('multi_vendor_tab_search')} />;
}
