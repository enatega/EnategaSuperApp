import React from 'react';
import { useTranslation } from 'react-i18next';
import ModePlaceholderScreen from '../../components/ModePlaceholderScreen';

type Props = Record<string, never>;

export default function MultiVendorHomeScreen({}: Props) {
  const { t } = useTranslation('homeVisits');

  return (
    <ModePlaceholderScreen
      body={t('multi_vendor_home_body')}
      subtitle={t('multi_vendor_desc')}
      title={t('multi_vendor_title')}
    />
  );
}
