import React from 'react';
import SpecialOffersBanner from '../../../../deliveries/components/specialOffersBanner/SpecialOffersBanner';
import useSingleVendorBanners from '../../hooks/useSingleVendorBanners';

export default function SingleVendorSpecialOffersBanner() {
  const { data: banners = [], isPending } = useSingleVendorBanners();

  return <SpecialOffersBanner banners={banners} isPending={isPending} />;
}
