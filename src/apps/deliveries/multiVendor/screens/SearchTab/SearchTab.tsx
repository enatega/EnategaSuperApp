import React from 'react';
import { useTranslation } from 'react-i18next';
import MainSearch from '../../components/Search/MainSearch';

export default function SearchTab() {
  const { t } = useTranslation('deliveries');

  return <MainSearch />
}
