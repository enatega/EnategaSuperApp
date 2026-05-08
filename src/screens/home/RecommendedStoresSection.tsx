import React from 'react';
import RecommendedStoresSectionRegistry from '../../apps/registry/homeSections/recommendedStoresSection';
import type { SelectMiniAppFn } from '../../apps/registry/homeSections/types';

type Props = {
  onSelectMiniApp?: SelectMiniAppFn;
};

export default function RecommendedStoresSection({ onSelectMiniApp }: Props) {
  return (
    <RecommendedStoresSectionRegistry onSelectMiniApp={onSelectMiniApp} />
  );
}
