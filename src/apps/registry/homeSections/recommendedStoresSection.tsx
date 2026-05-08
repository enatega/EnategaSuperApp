import React from 'react';
import DeliveriesRecommendedStoresSection from '../../deliveries/components/home/DeliveriesRecommendedStoresSection';
import type { SelectMiniAppFn } from './types';

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function RecommendedStoresSectionRegistry({
  onSelectMiniApp,
}: Props) {
  return <DeliveriesRecommendedStoresSection onSelectMiniApp={onSelectMiniApp} />;
}
