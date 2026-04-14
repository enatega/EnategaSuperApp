import React from 'react';
import SharedSpecialOffersBanner from '../../../components/specialOffersBanner/SpecialOffersBanner';
import { useMobileBanners } from '../../../hooks';

export default function SpecialOffersBanner() {
  const { data: banners = [], isPending } = useMobileBanners();

  return <SharedSpecialOffersBanner banners={banners} isPending={isPending} />;
}
