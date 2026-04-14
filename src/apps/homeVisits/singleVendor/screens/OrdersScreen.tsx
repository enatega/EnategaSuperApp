import React from 'react';
import { useTranslation } from 'react-i18next';
import ModePlaceholderScreen from '../../components/ModePlaceholderScreen';

type Props = Record<string, never>;

export default function SingleVendorOrdersScreen({}: Props) {
  const { t } = useTranslation('homeVisits');

  return (
    <ModePlaceholderScreen
      body={t('single_vendor_orders_body')}
      subtitle={t('single_vendor_desc')}
      title={t('single_vendor_tab_orders')}
    />
  );
}
