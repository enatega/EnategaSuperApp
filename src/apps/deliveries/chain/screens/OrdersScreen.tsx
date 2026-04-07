import React from 'react';
import { useTranslation } from 'react-i18next';
import ChainPlaceholderScreen from '../components/ChainPlaceholderScreen';

type Props = Record<string, never>;

export default function OrdersScreen({}: Props) {
  const { t } = useTranslation('deliveries');

  return <ChainPlaceholderScreen label={t('chain_tab_orders')} />;
}
