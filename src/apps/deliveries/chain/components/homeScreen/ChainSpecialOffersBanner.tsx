import React from 'react';
import SpecialOffersBanner from '../../../components/specialOffersBanner/SpecialOffersBanner';
import useChainBanners from '../../hooks/useChainBanners';

export default function ChainSpecialOffersBanner() {
  const { data: banners = [], isPending } = useChainBanners();

  return <SpecialOffersBanner banners={banners} isPending={isPending} />;
}
