import React from 'react';
import { useTranslation } from 'react-i18next';
import ModePlaceholderScreen from '../../components/ModePlaceholderScreen';

type Props = Record<string, never>;

export default function ChainHomeScreen({}: Props) {
  const { t } = useTranslation('homeVisits');

  return (
    <ModePlaceholderScreen
      body={t('chain_home_body')}
      subtitle={t('chain_desc')}
      title={t('chain_title')}
    />
  );
}
